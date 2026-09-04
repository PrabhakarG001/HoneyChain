import os
import joblib
import numpy as np
import librosa
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

MODEL_SAVE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "audio_classifier_model.joblib"))

CLASSES = ["Calm", "Agitated/Piping", "Queenless Swarming"]

def generate_synthetic_audio(state_label: str, duration_sec: float = 1.0, sr: int = 22050, seed: int | None = None) -> np.ndarray:
    """
    Generates a 1-second synthetic audio waveform simulating hive acoustic states.
    - Calm: Steady low frequency buzz (180-220 Hz) + mild harmonics + soft background noise
    - Agitated/Piping: High-frequency piping spikes (450-550 Hz) + strong high harmonics
    - Queenless Swarming: Chaotic broadband noise + fluctuating mid-range frequency (320-400 Hz)
    """
    if seed is not None:
        np.random.seed(seed)
        
    t = np.linspace(0, duration_sec, int(sr * duration_sec), endpoint=False)
    
    if state_label == "Calm":
        f0 = np.random.uniform(180, 220)
        signal = 0.6 * np.sin(2 * np.pi * f0 * t) + 0.3 * np.sin(2 * np.pi * (2 * f0) * t) + 0.1 * np.sin(2 * np.pi * (3 * f0) * t)
        noise = 0.05 * np.random.randn(len(t))
        audio = signal + noise
    elif state_label == "Agitated/Piping":
        f0 = np.random.uniform(450, 550)
        piping = 0.8 * np.sin(2 * np.pi * f0 * t) * (1 + 0.5 * np.sin(2 * np.pi * 10 * t))
        harmonics = 0.4 * np.sin(2 * np.pi * (1.5 * f0) * t)
        noise = 0.15 * np.random.randn(len(t))
        audio = piping + harmonics + noise
    elif state_label == "Queenless Swarming":
        f_base = np.random.uniform(320, 400)
        freq_mod = f_base + 50 * np.sin(2 * np.pi * 5 * t)
        phase = 2 * np.pi * np.cumsum(freq_mod) / sr
        swarm_buzz = 0.5 * np.sin(phase)
        noise = 0.35 * np.random.randn(len(t))
        audio = swarm_buzz + noise
    else:
        audio = 0.1 * np.random.randn(len(t))
        
    # Normalize audio to [-1, 1] range
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val
        
    return audio

def extract_audio_features(audio: np.ndarray, sr: int = 22050) -> np.ndarray:
    """
    Extracts 40 MFCC features (20 means + 20 stds) from an audio waveform.
    """
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=20)
    mfcc_mean = np.mean(mfcc, axis=1)
    mfcc_std = np.std(mfcc, axis=1)
    return np.hstack([mfcc_mean, mfcc_std])

def train_audio_classifier():
    print("Generating synthetic hive audio dataset for acoustic classification...")
    X = []
    y = []
    
    samples_per_class = 120
    sr = 22050
    
    for label_idx, class_name in enumerate(CLASSES):
        for i in range(samples_per_class):
            seed = label_idx * 1000 + i
            audio_wave = generate_synthetic_audio(class_name, duration_sec=1.0, sr=sr, seed=seed)
            feats = extract_audio_features(audio_wave, sr=sr)
            X.append(feats)
            y.append(label_idx)
            
    X = np.array(X)
    y = np.array(y)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"Training set shape: {X_train.shape}, Test set shape: {X_test.shape}")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Audio Classifier Accuracy: {acc:.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred, target_names=CLASSES))
    
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    joblib.dump({"model": clf, "classes": CLASSES, "sr": sr, "n_mfcc": 20}, MODEL_SAVE_PATH)
    print(f"Audio classifier model saved to: {MODEL_SAVE_PATH}")
    return clf

if __name__ == "__main__":
    train_audio_classifier()
