/*
Authenticate (POST /auth)

Create a booking (POST /booking)

Retrieve a booking (GET /booking/{id})

Update a booking (PUT/PATCH /booking/{id})

Delete a booking (DELETE /booking/{id})
*/

const request = require('supertest')('https://petstore.swagger.io/v2');
const assert = require('chai').assert;

describe('/user', () => {
  it('returns a token with valid credentials', () => {
    return request.get('/user/login')
      .query({
        username: "admin",
        password: "admin123"
      })
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect(res => {
        assert('message' in res.body)
      })
  });

  it('logs out user', () => {
    return request.get('/user/logout')
    .expect(200)
    .expect(res => {
      assert.hasAnyKeys(res.body, 'message')
      assert.equal(res.body.message, 'ok')
    })
  })

  it('creates a user', () => {
    return request.post('/user')
    .set('Content-Type', 'application/json')
    .send({
      id: 1,
      username: "foo",
      firstName: "foo",
      lastName: "bar",
      email: "foobar@gmail.com",
      password: "foobar123",
      phone: "5555555555",
      userStatus: 0
    })
    .expect(200)
    .expect(res => {
      assert('message' in res.body)
    });
  })

  it('gets a user info', () => {
    const username = "foo";
    return request.get(`/user/${username}`)
    .set('Content-Type', 'application/json')
    .expect(200)
    .expect(res => {
      assert('email' in res.body);
      assert(res.body.email === 'foobar@gmail.com');
    })
  });

  it('errors out for non-existent users', () => {
    return request.get('/user/faker')
    .set('Content-Type', 'application/json')
    .expect(404)
    .expect(res => {
      assert('code' in res.body)
      assert(res.body.code === 1)
      assert('message' in res.body)
      assert(res.body.message === "User not found");
    })
  })
});

describe('/store', () => {
  it('gets inventory', () => {
    return request.get('/store/inventory')
    .set('Content-Type', 'application/json')
    .expect(200)
    .expect(res => {
      assert('sold' in res.body);
      assert('available' in res.body);
    })
  });

  it('place an order for a pet', () => {
    return request.post('/store/order')
    .set('Content-Type', 'application/json')
    .send({
      id: 0,
      petId: 1,
      quantity: 5
    })
    .expect(200)
    .expect(res => {
      assert('id' in res.body);
    })
  })
});
