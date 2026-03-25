const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Idea = require('../models/Idea');
const userRoutes = require('../routes/userRoutes');
const { protect } = require('../middleware/authMiddleware');

// Mock protect middleware
jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    // Generate a fixed-format hex string for ObjectId to avoid using mongoose inside mock scope
    req.user = { _id: '507f1f77bcf86cd799439011', role: 'Developer' };
    next();
  }
}));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Search Exclusivity Tests', () => {
  beforeEach(async () => {
    // Create some users
    await User.create([
      { name: 'John Doe', email: 'john@example.com', role: 'Developer', status: 'Active', skills: ['React'] },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', status: 'Active', skills: ['Figma'] },
      { name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer', status: 'Active', skills: ['Node.js'] }
    ]);

    // Create some ideas with similar names/descriptions
    await Idea.create([
      { title: 'John Doe Project', description: 'A project about John Doe', category: 'Technical', owner: new mongoose.Types.ObjectId() },
      { title: 'Jane App', description: 'Designer tool like Figma', category: 'Design', owner: new mongoose.Types.ObjectId() }
    ]);

    // Manually ensure text index is created for User model in memory
    await User.ensureIndexes();
  });

  test('Search for "John" should only return users, never ideas', async () => {
    const res = await request(app).get('/api/users/search?query=John');
    
    expect(res.status).toBe(200);
    expect(res.body.users).toBeDefined();
    
    // Check that all returned items are users
    res.body.users.forEach(item => {
      // Users have a 'name' field, Ideas have a 'title' field
      expect(item.name).toBeDefined();
      expect(item.title).toBeUndefined();
      expect(item.description).toBeUndefined();
    });

    // Specific check for this test case
    const userNames = res.body.users.map(u => u.name);
    expect(userNames).toContain('John Doe');
    expect(userNames).not.toContain('John Doe Project');
  });

  test('Search for "Figma" (skill) should return relevant users but not ideas', async () => {
    const res = await request(app).get('/api/users/search?query=Figma');
    
    expect(res.status).toBe(200);
    
    res.body.users.forEach(item => {
      expect(item.name).toBeDefined();
      expect(item.title).toBeUndefined();
    });

    const userNames = res.body.users.map(u => u.name);
    expect(userNames).toContain('Jane Smith');
    expect(userNames).not.toContain('Jane App');
  });

  test('Search with role filter returns only users of that role', async () => {
    const res = await request(app).get('/api/users/search?role=Developer');
    
    expect(res.status).toBe(200);
    res.body.users.forEach(u => {
      expect(u.role).toBe('Developer');
    });
    expect(res.body.users.length).toBe(2);
  });
});
