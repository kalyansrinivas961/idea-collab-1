const request = require('supertest');
const app = require('../src/server');
const Problem = require('../src/models/Problem');
const Solution = require('../src/models/Solution');
const User = require('../src/models/User');
const ActivityLog = require('../src/models/ActivityLog');
const jwt = require('jsonwebtoken');

describe('Q&A Permission System', () => {
  let author, authorToken;
  let otherUser, otherToken;
  let problemId;

  const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  };

  beforeEach(async () => {
    author = await User.create({
      name: 'Author User',
      email: 'author@test.com',
      password: 'password123',
    });
    authorToken = createToken(author._id);

    otherUser = await User.create({
      name: 'Other User',
      email: 'other@test.com',
      password: 'password123',
    });
    otherToken = createToken(otherUser._id);

    const problem = await Problem.create({
      title: 'Test Problem',
      description: 'Test Description',
      category: 'technical',
      author: author._id,
    });
    problemId = problem._id;
  });

  describe('Deletion Rights', () => {
    test('Author can soft-delete their own question', async () => {
      const res = await request(app)
        .delete(`/api/qa/problems/${problemId}`)
        .set('Authorization', `Bearer ${authorToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);

      const deletedProblem = await Problem.findOne({ _id: problemId }).setOptions({ withDeleted: true });
      expect(deletedProblem.isDeleted).toBe(true);
      expect(deletedProblem.deletedAt).toBeDefined();

      // Ensure it's filtered out by default
      const foundProblem = await Problem.findById(problemId);
      expect(foundProblem).toBeNull();
    });

    test('Non-author cannot delete a question', async () => {
      const res = await request(app)
        .delete(`/api/qa/problems/${problemId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(403);
      const stillThere = await Problem.findById(problemId);
      expect(stillThere).not.toBeNull();
    });

    test('Cascade deletion: soft-deleting a problem soft-deletes its solutions', async () => {
      const solution = await Solution.create({
        problemId,
        content: 'Test Solution',
        author: otherUser._id,
      });

      await request(app)
        .delete(`/api/qa/problems/${problemId}`)
        .set('Authorization', `Bearer ${authorToken}`);

      const deletedSolution = await Solution.findOne({ _id: solution._id }).setOptions({ withDeleted: true });
      expect(deletedSolution.isDeleted).toBe(true);
      
      const foundSolution = await Solution.findById(solution._id);
      expect(foundSolution).toBeNull();
    });

    test('Deletion action is logged in ActivityLog', async () => {
      await request(app)
        .delete(`/api/qa/problems/${problemId}`)
        .set('Authorization', `Bearer ${authorToken}`);

      const log = await ActivityLog.findOne({ user: author._id, action: 'delete_problem' });
      expect(log).not.toBeNull();
      expect(log.metadata.problemId.toString()).toBe(problemId.toString());
    });
  });

  describe('Self-Reply Restriction', () => {
    test('Author cannot reply to their own question (top-level)', async () => {
      const res = await request(app)
        .post(`/api/qa/problems/${problemId}/solutions`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          content: 'Replying to myself',
          problemId: problemId,
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/cannot reply to your own question/i);
    });

    test('Others can reply to the question', async () => {
      const res = await request(app)
        .post(`/api/qa/problems/${problemId}/solutions`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          content: 'I can help with this',
          problemId: problemId,
        });

      expect(res.statusCode).toBe(201);
      const solution = await Solution.findOne({ problemId, author: otherUser._id });
      expect(solution).not.toBeNull();
    });
  });

  describe('Reply Permissions to Reactions', () => {
    test('Author can reply to others solutions on their own question', async () => {
      const solution = await Solution.create({
        problemId,
        content: 'Helpful solution',
        author: otherUser._id,
      });

      const res = await request(app)
        .post(`/api/qa/problems/${problemId}/solutions`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          content: 'Thanks for the help!',
          problemId: problemId,
          parentReply: solution._id,
        });

      expect(res.statusCode).toBe(201);
      const reply = await Solution.findOne({ parentReply: solution._id, author: author._id });
      expect(reply).not.toBeNull();
    });

    test('Author cannot reply to their own solution', async () => {
      const solution = await Solution.create({
        problemId,
        content: 'My own solution',
        author: author._id,
      });

      const res = await request(app)
        .post(`/api/qa/problems/${problemId}/solutions`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          content: 'Replying to myself again',
          problemId: problemId,
          parentReply: solution._id,
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/cannot reply to your own response/i);
    });
  });
});
