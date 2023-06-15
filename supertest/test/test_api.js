const request = require('supertest')('https://jsonplaceholder.typicode.com')
const assert = require('chai').assert;

/*
Pick different routes/endpoints of choice from https://jsonplaceholder.typicode.com
API tests and performance tests
For 2-3 API endpoints chosen from the earlier step, what test categories and actual tests would you write to test these API endpoints? Pick any framework you are already comfortable with and pseudo code or real-code example tests.
Think through performance testing using Locust for the endpoints chosen in the above step. Describe the approaches and potential challenges for using this framework at scale for enterprise-level performance/load tests.
Bonus points for actually implementing tests.
*/

describe('GET /posts/{d}', () => {
  it('responds correctly with valid post id', async () => {
    const body = {
      userId: 1,
      id: 1,
      title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\n' +
        'suscipit recusandae consequuntur expedita et cum\n' +
        'reprehenderit molestiae ut ut quas totam\n' +
        'nostrum rerum est autem sunt rem eveniet architecto'
    };

    const res = await request.get('/posts/1');

    assert(res.status === 200, `Expected 200, received ${res.status}`);

    assert('content-type' in res.header);
    assert(res.header['content-type'] === 'application/json; charset=utf-8')

    assert('content-encoding' in res.header);
    assert(res.header['content-encoding'] === 'gzip')

    assert(res.header['x-ratelimit-limit'] === '1000')
    assert(res.header['x-ratelimit-remaining'] === '999')

    assert.deepEqual(body, res.body);
  });

  it('responds correctly with query parameters', async () => {
    const body = {
      userId: 1,
      id: 1,
      title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\n' +
        'suscipit recusandae consequuntur expedita et cum\n' +
        'reprehenderit molestiae ut ut quas totam\n' +
        'nostrum rerum est autem sunt rem eveniet architecto'
    };

    const res = await request.get('/posts/1?foo=bar');

    assert(res.status === 200, `Expected 200, received ${res.status}`);

    assert.deepEqual(body, res.body);
  });

  invalid_inputs = ['9000', '0', '-1', 'cat', '@foo']
  invalid_inputs.forEach(input => {
    it(`responds with 404 for '${input}'`, async () => {
      const res = await request.get(`/posts/${input}`);

      assert(res.status === 404, `Expected 404, received ${res.status}`);
      assert.deepEqual(res.body, {});
    });
  });
});

describe('POST /posts', () => {
  it('responds correctly with valid header and body', async () => {
    const body = { title: 'foo', body: 'bar', userId: 1 };
    const headers = { 'accept': 'application/json; charset=UTF-8' };
    const res = await request.post('/posts/')
      .set(headers)
      .send(body);

    assert(res.status === 201);
    assert('content-type' in res.header)
    assert(res.headers['content-type'].includes('json'), res)
    assert('id' in res.body);
  });

  it('responds with 400 when missing payload fields', async () => {
    const body = {};
    const headers = { 'accept': 'application/json; charset=UTF-8' };
    const res = await request.post('/posts/')
      .set(headers)
      .send(body);

    assert(res.status === 400, `Expected status code to be 400, received ${res.status}`);
  });

  it('responds gracefully with bad json', async () => {
    const body = '{ "invalid" }';
    const headers = { 'content-type': 'application/json; charset=UTF-8' };
    const res = await request.post(`/posts`)
      .set(headers)
      .send(body);
    
    assert(res.status === 400, `Expected status code to be 400, received ${res.status}`);
  });
});

describe('PATCH /posts', () => {
  // assert bad json should be 400
  it('responds correctly with valid header and body', async () => {
    const body = { title: 'foo', body: 'bar' };
    const headers = { 'content-type': 'application/json; charset=UTF-8' };
    const res = await request.patch('/posts/1')
      .set(headers)
      .send(body);
    
    assert(res.status === 200);
    assert('id' in res.body);
    assert(res.body['id'] === 1);
    assert.deepInclude(res.body, body);
  });

  it('does not update id', async () => {
    const body = { title: 'foo', body: 'bar', id: 123};
    const headers = { 'content-type': 'application/json; charset=UTF-8' };
    const postId = 1;
    const res = await request.patch(`/posts/${postId}`)
      .set(headers)
      .send(body);
    
    assert(res.status === 200);
    assert('id' in res.body);
    assert(res.body['id'] === postId, `Expected 'id' to be ${postId}, received ${res.body['id']}`)
  });

  it('does not update userId', async () => {
    const body = { title: 'foo', body: 'bar', userId: 123};
    const headers = { 'content-type': 'application/json; charset=UTF-8' };
    const postId = 1;
    const userId = 1;
    const res = await request.patch(`/posts/${postId}`)
      .set(headers)
      .send(body);
    
    assert(res.status === 200);
    assert('userId' in res.body);
    assert(res.body['userId'] === userId, `Expected 'userId' to be ${userId}, received ${res.body['id']}`)
  });

  it('responds gracefully with bad json', async () => {
    const body = '{ "invalid" }';
    const headers = { 'content-type': 'application/json; charset=UTF-8' };
    const res = await request.patch(`/posts/1`)
      .set(headers)
      .send(body);
    
    assert(res.status === 400, `Expected status code to be 400, received ${res.status}`);
  });
});
