const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Global mocks for testing
jest.mock('../utils/sendEmail', () => {
  return jest.fn().mockImplementation(() => Promise.resolve());
});

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
