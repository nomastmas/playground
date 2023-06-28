require('dotenv').config()
const request = require('supertest')('https://api-ssl.bitly.com')
const assert = require('chai').assert;

/*
Pretend you have been tasked with automating a key user workflow in the Bitly API.

1. A user creates a shortened link.
2. The user reads and asserts against the created Bitlink.
3. The user updates the Bitlink.
4. The user reads and asserts against the updated Bitlink.

Bitlink: the short link created by the Bitly platform
*/

describe('POST /v4/bitlinks', () => {
  const long_url = 'https://www.linkedin.com/in/thomaswtsang/';
  const bitlink = 'https://bit.ly/3qThfsT';
  const bitlink_id = 'bit.ly/3qThfsT';
  
  const title = 'foobar';
  const tags = ['foo', 'bar'];
  const header = {
    authorization: `Bearer ${process.env.BITLY_AUTH_TOKEN}`
  };

  it('should create a Bitlink with title and tags', async () => {
    const data = {
      long_url: long_url,
      title: title,
      tags: tags
    };

    const res = await request
                        .post('/v4/bitlinks')
                        .set(header)
                        .send(data);

    const body = res.body;

    assert(res.status === 200, `Expected 200, received ${res.status}`);
    assert.containsAllKeys(body, ['created_at', 'id', 'link', 'custom_bitlinks', 'long_url', 'title', 'tags', 'archived', 'deeplinks', 'references']);
    assert(body.id === bitlink_id);
    assert(body.link === bitlink);
    assert(body.long_url === long_url);
    assert(body.title === title);
    assert(body.archived === false);
    assert.sameMembers(body.tags, tags);
    assert.property(body.references, 'group');
  });

  it('should create a Bitlink without title and tags', async () => {
    const data = {
      long_url: long_url,
    };

    const res = await request
                        .post('/v4/bitlinks')
                        .set(header)
                        .send(data);

    const body = res.body;

    assert(res.status === 200, `Expected 200, received ${res.status}`);
    assert.notProperty(body, 'title');
    assert(body.tags.length === 0); 
  });

  it('should fail to create a Bitlink without a URL', async () => {
    const data = {
      tags: [ "foo" ]
    };

    const res = await request
                        .post('/v4/bitlinks')
                        .set(header)
                        .send(data);

    assert(res.status === 400, `Expected 400, received ${res.status}`);
  });

  it('should fail to create a Bitlink with an invalid URL', async () => {
    const data = {
      long_url: "foobar",
      tags: [ "foo" ]
    };

    const res = await request
                        .post('/v4/bitlinks')
                        .set(header)
                        .send(data);

    assert(res.status === 400, `Expected 400, received ${res.status}`);
  });

  it('should fail to create a Bitlink with an improper JSON body', async () => {
    const data = {
      long_url: long_url,
      tags: [ 123, "foo" ]
    };

    const res = await request
                        .post('/v4/bitlinks')
                        .set(header)
                        .send(data);

    assert(res.status === 422, `Expected 422, received ${res.status}`);
  });

  it('should fail to create a Bitlink with bad header ', async () => {
    const data = {
      long_url: long_url,
      tags: tags
    };

    header['accept'] = "text/html";

    const res = await request
                        .post('/v4/bitlinks')
                        .set(header)
                        .send(data);

    assert(res.status === 406, `Expected 406, received ${res.status}`);
  });

  it('should fail to create a Bitlink with no auth token', async () => {
    const data = {
      long_url: long_url,
      tags: tags
    };

    const res = await request
                        .post('/v4/bitlinks')
                        .send(data);

    assert(res.status === 403, `Expected 403, received ${res.status}`);
  });
});

describe('PATCH /v4/bitlinks/{bitlink}', () => {
  const bitlink = 'https://bit.ly/3qThfsT';
  const bitlink_id = 'bit.ly/3qThfsT';
  
  const title = 'catbug';
  const tags = ['cat', 'bug'];
  const header = {
    authorization: `Bearer ${process.env.BITLY_AUTH_TOKEN}`
  };

  it('should update a Bitlink with title and tags', async () => {
    const data = {
      title: title,
      tags: tags
    };

    const res = await request
                        .patch(`/v4/bitlinks/${bitlink_id}`)
                        .set(header)
                        .send(data);

    const body = res.body;

    assert(res.status === 200, `Expected 200, received ${res.status}`);
    assert(body.title === title)
    assert.sameMembers(body.tags, tags);
  });

  it('should update a Bitlink without title and tags', async () => {
    const data = {
    };

    const res = await request
                        .patch(`/v4/bitlinks/${bitlink_id}`)
                        .set(header)
                        .send(data);

    assert(res.status === 200, `Expected 200, received ${res.status}`);
  });

  it('should fail to update a Bitlink with invalid JSON ', async () => {
    const data = {
      title: title,
      tags: [ 123, "123"]
    };

    const res = await request
                        .patch(`/v4/bitlinks/${bitlink_id}`)
                        .set(header)
                        .send(data);

    const body = res.body;

    assert(res.status === 422, `Expected 422, received ${res.status}`);
  });

  it('should fail to update a Bitlink that does not exist', async () => {
    const data = {
      title: title,
      tags: tags
    };

    const res = await request
                        .patch(`/v4/bitlinks/bit.ly/catbug`)
                        .set(header)
                        .send(data);

    const body = res.body;

    assert(res.status === 404, `Expected 404, received ${res.status}`);
  });

  it('should fail to update a Bitlink that is forbidden', async () => {
    const data = {
      title: title,
      tags: tags
    };

    const res = await request
                        .patch(`/v4/bitlinks/bit.ly/foobar`)
                        .set(header)
                        .send(data);

    const body = res.body;

    assert(res.status === 403, `Expected 403, received ${res.status}`);
  });

  it('should fail to update a Bitlink with no auth token', async () => {
    const data = {
      title: title,
      tags: tags
    };

    const res = await request
                        .patch(`/v4/bitlinks/${bitlink_id}`)
                        .send(data);

    const body = res.body;

    assert(res.status === 403, `Expected 403, received ${res.status}`);
  });
});
