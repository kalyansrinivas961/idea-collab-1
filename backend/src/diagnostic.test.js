const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');

// Set dummy API key for controller initialization
process.env.GROQ_API_KEY = 'test-key';

const User = require('./models/User');
const Problem = require('./models/Problem');
const Solution = require('./models/Solution');
const ActivityLog = require('./models/ActivityLog');

// Mock Groq SDK BEFORE requiring routes/controllers
jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'AI Enhanced Content' } }]
        })
      }
    }
  }));
});

// Mock notification controller to avoid actual notifications during tests
jest.mock('./controllers/notificationController', () => ({
  createNotification: jest.fn().mockResolvedValue(true)
}));

const qaRoutes = require('./routes/qaRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Setup a test app that bypasses real auth but injects a user
const app = express();
app.use(express.json());

// Simple mock user middleware
let currentTestUser = null;
app.use((req, res, next) => {
  req.user = currentTestUser;
  // Mock io
  req.io = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn()
  };
  next();
});

// Mock Auth Middleware to always pass if currentTestUser is set
jest.mock('./middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    next();
  },
}));

app.use('/api/qa', qaRoutes);
app.use('/api/ai', aiRoutes);

describe('Comprehensive Diagnostic Analysis', () => {
  let mongoServer;
  let authorUser, solverUser;
  let testProblem;

  beforeAll(async () => {
    // Close any existing connection first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create test users
    authorUser = await User.create({
      name: 'Author User',
      email: 'author@test.com',
      password: 'password123',
      reputation: 10
    });

    solverUser = await User.create({
      name: 'Solver User',
      email: 'solver@test.com',
      password: 'password123',
      reputation: 10
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Create a fresh problem for each test
    testProblem = await Problem.create({
      title: 'Diagnostic Problem',
      description: 'Need help with tests',
      category: 'technical',
      author: authorUser._id
    });
  });

  afterEach(async () => {
    // Clean up
    await Problem.deleteMany({});
    await Solution.deleteMany({});
  });

  describe('Task 1: AI Expansion Diagnostic', () => {
    it('SUCCESS: should expand description using AI', async () => {
      currentTestUser = authorUser;
      const res = await request(app)
        .post('/api/ai/enhance-description')
        .send({
          text: 'Short description',
          mode: 'expand',
          title: 'Test Problem',
          category: 'technical'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.enhancedText).toBe('AI Enhanced Content');
    });

    it('FAILURE: should fail if text is missing and mode is not generate', async () => {
      currentTestUser = authorUser;
      const res = await request(app)
        .post('/api/ai/enhance-description')
        .send({
          mode: 'expand'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Text is required');
    });
  });

  describe('Task 2: Solution Restriction Diagnostic', () => {
    it('SUCCESS: should allow non-author to submit a solution', async () => {
      currentTestUser = solverUser;
      const res = await request(app)
        .post(`/api/qa/problems/${testProblem._id}/solutions`)
        .send({
          content: 'Here is a solution'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.content).toBe('Here is a solution');
    });

    it('FAILURE: should prevent author from solving their own problem', async () => {
      currentTestUser = authorUser;
      const res = await request(app)
        .post(`/api/qa/problems/${testProblem._id}/solutions`)
        .send({
          content: 'My own solution'
        });
      
      expect(res.status).toBe(403);
      expect(res.body.message).toContain('You cannot reply to your own question');
    });

    it('SUCCESS: should allow author to reply to someone else\'s solution', async () => {
      // Create a solution first
      const solution = await Solution.create({
        problemId: testProblem._id,
        content: 'Original solution',
        author: solverUser._id
      });

      currentTestUser = authorUser;
      const res = await request(app)
        .post(`/api/qa/problems/${testProblem._id}/solutions`)
        .send({
          content: 'Author reply to solution',
          parentReply: solution._id
        });
      
      expect(res.status).toBe(201);
      expect(res.body.parentReply.toString()).toBe(solution._id.toString());
    });
  });

  describe('Task 3: Status Toggle Diagnostic', () => {
    it('SUCCESS: should allow author to mark as solved', async () => {
      currentTestUser = authorUser;
      const res = await request(app)
        .patch(`/api/qa/problems/${testProblem._id}/status`)
        .send({
          status: 'solved'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('solved');
      expect(res.body.isResolved).toBe(true);
    });

    it('FAILURE: should prevent non-author from changing status', async () => {
      currentTestUser = solverUser;
      const res = await request(app)
        .patch(`/api/qa/problems/${testProblem._id}/status`)
        .send({
          status: 'solved'
        });
      
      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Not authorized to update status');
    });

    it('FAILURE: should fail with invalid status', async () => {
      currentTestUser = authorUser;
      const res = await request(app)
        .patch(`/api/qa/problems/${testProblem._id}/status`)
        .send({
          status: 'invalid-status'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid status value');
    });
  });
});
