import supertest from 'supertest';
// import expect from 'expect';
import { expect } from 'chai';
import { app, server }  from '../app.js';

const request = supertest(app);

import { connectDB, disconnectDB } from '../config/db.js';

describe('API test', () => {
  before(() => {
    connectDB();
  });

  after(() => {
    disconnectDB();
    server.close();
  });

  describe('POST /api/short', () => {
    it('creates a shortened URL', async () => {
      const res = await request.post('/api/test', {
        origUrl: 'http://example.com/example?foo=bar'
      });

      expect(res.status).to.equal(201);
    });
  });
});
