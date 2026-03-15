const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Mock Auth Middleware BEFORE requiring routes
jest.mock('../../middleware/authMiddleware', () => ({
  protect: (req, res, next) => next(),
}));

const notificationRoutes = require('../../routes/notificationRoutes');
const Notification = require('../../models/Notification');

// Setup App
const app = express();
app.use(express.json());

// Mock Auth Middleware
const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test User'
};

// Mock middleware to inject user
app.use((req, res, next) => {
  req.user = mockUser;
  // Mock io
  req.io = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn()
  };
  next();
});

app.use('/api/notifications', notificationRoutes);

describe('Notification Controller', () => {
  
  beforeEach(async () => {
    // Seed some data
    await Notification.create([
      {
        recipient: mockUser._id,
        type: 'info',
        title: 'Info Notification',
        message: 'Info Message',
        isRead: false
      },
      {
        recipient: mockUser._id,
        type: 'success',
        title: 'Success Notification',
        message: 'Success Message',
        isRead: true
      },
      {
        recipient: new mongoose.Types.ObjectId(), // Other user
        type: 'warning',
        title: 'Other Notification',
        message: 'Other Message',
        isRead: false
      }
    ]);
  });

  it('GET /api/notifications returns user notifications', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.status).toBe(200);
    expect(res.body.notifications.length).toBe(2);
    expect(res.body.total).toBe(2);
    expect(res.body.unreadCount).toBe(1);
  });

  it('GET /api/notifications filters by type', async () => {
    const res = await request(app).get('/api/notifications?type=info');
    expect(res.status).toBe(200);
    expect(res.body.notifications.length).toBe(1);
    expect(res.body.notifications[0].title).toBe('Info Notification');
  });

  it('PUT /api/notifications/read marks all as read', async () => {
    const res = await request(app).put('/api/notifications/read');
    expect(res.status).toBe(200);
    
    const unread = await Notification.countDocuments({ recipient: mockUser._id, isRead: false });
    expect(unread).toBe(0);
  });

  it('POST /api/notifications/delete deletes notifications', async () => {
    const notif = await Notification.findOne({ title: 'Info Notification' });
    
    const res = await request(app)
      .post('/api/notifications/delete')
      .send({ ids: [notif._id] });
      
    expect(res.status).toBe(200);
    
    const count = await Notification.countDocuments({ recipient: mockUser._id });
    expect(count).toBe(1);
  });
});
