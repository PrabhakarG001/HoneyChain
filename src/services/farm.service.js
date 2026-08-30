let mockFarms = [
  {
    id: 'farm-001',
    name: 'Sunny Valley Apiary',
    ownerId: 'usr-1',
    location: 'Gorakhpur, UP',
    area: 2.5,
    numberOfHives: 50,
    beeSpecies: 'Apis mellifera',
    floralSource: 'Mustard',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const farmService = {
  getFarms: async (userId) => {
    await delay(500);
    return mockFarms.filter(f => f.ownerId === userId);
  },
  
  getFarm: async (farmId) => {
    await delay(300);
    const farm = mockFarms.find(f => f.id === farmId);
    if (!farm) throw new Error('Farm not found');
    return farm;
  },

  createFarm: async (farmData, userId) => {
    await delay(800);
    const newFarm = {
      ...farmData,
      id: `farm-${Date.now()}`,
      ownerId: userId,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    mockFarms.push(newFarm);
    return newFarm;
  }
};
