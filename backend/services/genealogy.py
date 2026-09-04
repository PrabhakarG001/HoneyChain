from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Dict, Any, List, Set
from .. import models

class GenealogyEngine:
    """
    High-performance, non-N+1 Batch Genealogy and Traceability Engine for HoneyChain.
    Reconstructs complete supply chain provenance from products back to beekeepers,
    and forward from harvests to end-consumer products.
    """

    @staticmethod
    def get_parent_batches(db: Session, batch_id: str) -> List[models.Batch]:
        """Finds all parent batches that contributed to creating `batch_id` via MERGE/SPLIT."""
        transformations = db.query(models.BatchTransformation)\
            .options(joinedload(models.BatchTransformation.parent_batch))\
            .filter(models.BatchTransformation.child_batch_id == batch_id).all()
        return [t.parent_batch for t in transformations if t.parent_batch]

    @staticmethod
    def get_child_batches(db: Session, batch_id: str) -> List[models.Batch]:
        """Finds all child batches resulting from `batch_id` via MERGE/SPLIT."""
        transformations = db.query(models.BatchTransformation)\
            .options(joinedload(models.BatchTransformation.child_batch))\
            .filter(models.BatchTransformation.parent_batch_id == batch_id).all()
        return [t.child_batch for t in transformations if t.child_batch]

    @staticmethod
    def get_all_lineage_batch_ids(db: Session, start_batch_id: str) -> Set[str]:
        """Recursively collects all ancestor batch IDs feeding into `start_batch_id`."""
        visited: Set[str] = set()
        queue = [start_batch_id]

        while queue:
            current = queue.pop(0)
            if current in visited:
                continue
            visited.add(current)

            parents = db.query(models.BatchTransformation.parent_batch_id)\
                .filter(models.BatchTransformation.child_batch_id == current).all()
            for p in parents:
                if p[0] not in visited:
                    queue.append(p[0])

        return visited

    @staticmethod
    def get_batch_harvests(db: Session, batch_id: str) -> List[models.Harvest]:
        """
        Finds all harvest events contributing to a batch across its full lineage.
        Uses bulk eager loading to prevent N+1 query overhead.
        """
        all_batch_ids = GenealogyEngine.get_all_lineage_batch_ids(db, batch_id)

        # 1. Harvests directly assigned to any lineage batch
        direct_harvests = db.query(models.Harvest)\
            .options(
                joinedload(models.Harvest.hive).joinedload(models.Hive.apiary).joinedload(models.Apiary.beekeeper),
                joinedload(models.Harvest.hive).joinedload(models.Hive.owner)
            )\
            .filter(models.Harvest.batch_id.in_(all_batch_ids)).all()

        # 2. Harvests linked via batch_sources
        source_harvests = db.query(models.Harvest)\
            .join(models.BatchSource, models.BatchSource.harvest_id == models.Harvest.id)\
            .options(
                joinedload(models.Harvest.hive).joinedload(models.Hive.apiary).joinedload(models.Apiary.beekeeper),
                joinedload(models.Harvest.hive).joinedload(models.Hive.owner)
            )\
            .filter(models.BatchSource.batch_id.in_(all_batch_ids)).all()

        # Deduplicate harvests by ID
        harvest_dict = {h.id: h for h in (direct_harvests + source_harvests)}
        return list(harvest_dict.values())

    @staticmethod
    def get_product_genealogy(db: Session, product_id: str) -> Dict[str, Any]:
        """
        Reconstructs complete supply chain provenance for a sellable product:
        Product -> Batch -> Ancestor Batches -> Harvest Events -> Hives -> Apiaries -> Beekeepers.
        Answers: "Where did this product come from?"
        """
        product = db.query(models.Product).filter(
            (models.Product.id == product_id) | (models.Product.product_code == product_id)
        ).first()

        target_batch_id = product.batch_id if product else product_id
        batch = db.query(models.Batch).filter(models.Batch.id == target_batch_id).first()

        if not batch:
            return {
                "success": False,
                "error": f"Product or batch '{product_id}' not found"
            }

        lineage_batch_ids = GenealogyEngine.get_all_lineage_batch_ids(db, batch.id)

        # Fetch all lineage batches
        lineage_batches = db.query(models.Batch).filter(models.Batch.id.in_(lineage_batch_ids)).all()

        # Fetch all harvests
        harvests = GenealogyEngine.get_batch_harvests(db, batch.id)

        # Extract hives, apiaries, beekeepers
        hives_map = {}
        apiaries_map = {}
        beekeepers_map = {}

        for h in harvests:
            if h.hive:
                hives_map[h.hive.id] = {
                    "id": h.hive.id,
                    "name": h.hive.name or h.hive.id,
                    "hive_code": h.hive.hive_code or h.hive.id,
                    "location": h.hive.location or (h.hive.apiary.name if h.hive.apiary else None),
                    "install_date": h.hive.install_date.isoformat() if h.hive.install_date else None
                }
                if h.hive.apiary:
                    apiary = h.hive.apiary
                    apiaries_map[apiary.id] = {
                        "id": apiary.id,
                        "name": apiary.name,
                        "lat": apiary.lat,
                        "lng": apiary.lng,
                        "beekeeper_id": apiary.beekeeper_id
                    }
                    if apiary.beekeeper:
                        bk = apiary.beekeeper
                        beekeepers_map[bk.id] = {
                            "id": bk.id,
                            "license_no": bk.license_no,
                            "location": bk.location,
                            "username": bk.user.username if bk.user else None
                        }

        # Fetch lab tests for all lineage batches
        lab_tests = db.query(models.LabTest).filter(models.LabTest.batch_id.in_(lineage_batch_ids)).all()

        # Fetch blockchain transaction indexes for product, batches, harvests
        related_ids = [batch.id] + list(lineage_batch_ids) + [h.id for h in harvests]
        if product:
            related_ids.append(product.id)

        tx_records = db.query(models.BlockchainTransaction).filter(
            models.BlockchainTransaction.related_id.in_(related_ids)
        ).all()

        parent_batches = GenealogyEngine.get_parent_batches(db, batch.id)
        child_batches = GenealogyEngine.get_child_batches(db, batch.id)

        return {
            "success": True,
            "product": {
                "id": product.id if product else None,
                "product_code": product.product_code if product else None,
                "name": product.name if product else "Pure Raw Honey",
                "bottle_date": product.bottle_date.isoformat() if product and product.bottle_date else None,
                "qr_code": product.qr_code if product else None
            } if product else None,
            "batch": {
                "id": batch.id,
                "batch_code": batch.batch_code or batch.id,
                "status": batch.status,
                "is_merged": batch.is_merged,
                "created_at": batch.created_at.isoformat()
            },
            "harvests": [
                {
                    "id": h.id,
                    "hive_id": h.hive_id,
                    "quantity_kg": h.weight_kg,
                    "timestamp": h.timestamp.isoformat(),
                    "tx_hash": h.tx_hash
                } for h in harvests
            ],
            "hives": list(hives_map.values()),
            "apiaries": list(apiaries_map.values()),
            "beekeepers": list(beekeepers_map.values()),
            "parent_batches": [
                {"id": pb.id, "batch_code": pb.batch_code or pb.id, "status": pb.status} for pb in parent_batches
            ],
            "child_batches": [
                {"id": cb.id, "batch_code": cb.batch_code or cb.id, "status": cb.status} for cb in child_batches
            ],
            "lab_tests": [
                {
                    "id": lt.id,
                    "batch_id": lt.batch_id,
                    "test_type": lt.test_type,
                    "result": lt.result,
                    "lab_name": lt.lab_name,
                    "created_at": lt.created_at.isoformat()
                } for lt in lab_tests
            ],
            "blockchain_records": [
                {
                    "id": tx.id,
                    "related_table": tx.related_table,
                    "related_id": tx.related_id,
                    "tx_hash": tx.tx_hash,
                    "action_type": tx.action_type,
                    "timestamp": tx.timestamp.isoformat()
                } for tx in tx_records
            ]
        }

    @staticmethod
    def get_harvest_downstream_products(db: Session, harvest_id: str) -> List[models.Product]:
        """
        Answers: "Which products originated from this harvest?"
        Traverses downstream through honey batches and transformations.
        """
        harvest = db.query(models.Harvest).filter(models.Harvest.id == harvest_id).first()
        if not harvest:
            return []

        # Find direct batches
        direct_batches = set()
        if harvest.batch_id:
            direct_batches.add(harvest.batch_id)

        bs_records = db.query(models.BatchSource.batch_id).filter(models.BatchSource.harvest_id == harvest_id).all()
        for bs in bs_records:
            direct_batches.add(bs[0])

        # Traverse downstream child batches recursively
        visited_batches: Set[str] = set()
        queue = list(direct_batches)

        while queue:
            current = queue.pop(0)
            if current in visited_batches:
                continue
            visited_batches.add(current)

            children = db.query(models.BatchTransformation.child_batch_id)\
                .filter(models.BatchTransformation.parent_batch_id == current).all()
            for c in children:
                if c[0] not in visited_batches:
                    queue.append(c[0])

        # Query all products linked to any of these batches
        products = db.query(models.Product).filter(models.Product.batch_id.in_(visited_batches)).all()
        return products
