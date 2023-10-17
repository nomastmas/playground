import supertest from 'supertest';
import { expect } from 'chai';
import { app, server }  from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';

const request = supertest(app);

describe('API test', () => {
  before( async () => {
    await connectDB();
  });

  after(async () => {
    await disconnectDB();
    server.closeAllConnections();
    // app close?
  });

  describe('POST /api/shorten', () => {
    it('creates a shortened URL', async () => {
      const res = await request.post('/api/shorten', {
        origUrl: 'http://example.com/example?foo=bar'
      });

      console.log(res.error);
      expect(res.status).to.equal(200);
    });
  });
});
