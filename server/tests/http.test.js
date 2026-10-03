// These tests don't need a database: they only cover behaviour that happens before any query.
import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

const withServer = async (fn) => {
  const server = app.listen(0);
  try {
    await fn(`http://localhost:${server.address().port}`);
  } finally {
    server.close();
  }
};

test('GET / health check', () =>
  withServer(async (base) => {
    const res = await fetch(base);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: 'ok' });
  }));

test('API returns a clean 500 when the database is unreachable', async () => {
  delete process.env.MONGODB_URI;
  const original = console.error;
  console.error = () => {};
  try {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/posts`);
      assert.equal(res.status, 500);
      assert.equal((await res.json()).message, 'Something went wrong');
    });
  } finally {
    console.error = original;
  }
});
