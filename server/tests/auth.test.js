// Auth flow tests with Google and MongoDB replaced by fakes, so no network or database is needed.
import test, { mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

process.env.JWT_SECRET = 'x'.repeat(40);
process.env.ADMIN_EMAILS = 'boss@example.com';
process.env.GOOGLE_CLIENT_ID = 'test-client-id';

const { google, toPublicUser } = await import('../src/services/authService.js');
const { signSession } = await import('../src/services/sessionService.js');
const User = (await import('../src/models/User.js')).default;
const Post = (await import('../src/models/Post.js')).default;
const { googleSignIn, me, logout } = await import('../src/controllers/authController.js');
const { attachUser, requireAuth } = await import('../src/middleware/auth.js');
const { originCheck } = await import('../src/middleware/originCheck.js');
const postService = await import('../src/services/postService.js');

afterEach(() => mock.restoreAll());

const fakeRes = () => {
  const res = { cookies: {}, cleared: [], statusCode: 200, body: undefined };
  res.cookie = (name, value, opts) => ((res.cookies[name] = { value, opts }), res);
  res.clearCookie = (name) => (res.cleared.push(name), res);
  res.status = (code) => ((res.statusCode = code), res);
  res.json = (body) => ((res.body = body), res);
  return res;
};

// run an express-style handler and capture what it passes to next()
const run = (handler, req, res = fakeRes()) =>
  new Promise((resolve) => {
    const next = (err) => resolve({ err, res });
    Promise.resolve(handler(req, res, next)).then(() => resolve({ res }));
  });

const dbUser = (over = {}) => ({
  _id: new mongoose.Types.ObjectId(),
  googleId: 'g-1',
  email: 'jane@example.com',
  name: 'Jane',
  picture: 'http://img',
  ...over,
});

// ---------- sign in / sign up ----------
test('googleSignIn rejects a request with no credential', async () => {
  const { err } = await run(googleSignIn, { body: {} });
  assert.equal(err.status, 400);
});

test('googleSignIn rejects a credential Google says is invalid', async () => {
  mock.method(google, 'verifyCredential', async () => {
    const e = new Error('bad');
    e.status = 401;
    throw e;
  });
  const { err } = await run(googleSignIn, { body: { credential: 'x'.repeat(30) } });
  assert.equal(err.status, 401);
});

test('googleSignIn creates a session cookie and returns the public user', async () => {
  const user = dbUser();
  mock.method(google, 'verifyCredential', async () => ({ googleId: 'g-1', email: user.email, name: user.name }));
  mock.method(User, 'findOneAndUpdate', async () => user);

  const { res, err } = await run(googleSignIn, { body: { credential: 'x'.repeat(30) } });

  assert.equal(err, undefined);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.user.email, 'jane@example.com');
  assert.equal(res.body.user.role, 'user');
  assert.equal(res.body.user.googleId, undefined); // internal ids are not exposed
  assert.equal(res.cookies.session.opts.httpOnly, true);
  assert.equal(res.cookies.session.opts.sameSite, 'lax');
});

test('an email listed in ADMIN_EMAILS gets the admin role', () => {
  assert.equal(toPublicUser(dbUser({ email: 'boss@example.com' })).role, 'admin');
  assert.equal(toPublicUser(dbUser({ email: 'BOSS@example.com'.toLowerCase() })).role, 'admin');
  assert.equal(toPublicUser(dbUser()).role, 'user');
});

// ---------- session middleware ----------
test('attachUser leaves anonymous visitors alone', async () => {
  const req = { cookies: {} };
  await run(attachUser, req);
  assert.equal(req.user, undefined);
});

test('attachUser sets req.user from a valid session cookie', async () => {
  const user = dbUser();
  mock.method(User, 'findById', async () => user);
  const req = { cookies: { session: signSession(user._id) } };
  await run(attachUser, req);
  assert.equal(req.user.id, user._id.toString());
});

test('attachUser ignores and clears a bad cookie instead of failing the request', async () => {
  const req = { cookies: { session: 'not-a-real-token' } };
  const { res, err } = await run(attachUser, req);
  assert.equal(err, undefined);
  assert.equal(req.user, undefined);
  assert.deepEqual(res.cleared, ['session']);
});

test('attachUser clears the cookie if the account was deleted', async () => {
  mock.method(User, 'findById', async () => null);
  const req = { cookies: { session: signSession(new mongoose.Types.ObjectId()) } };
  const { res } = await run(attachUser, req);
  assert.equal(req.user, undefined);
  assert.deepEqual(res.cleared, ['session']);
});

test('requireAuth blocks anonymous requests with 401 and lets users through', async () => {
  assert.equal((await run(requireAuth, {})).err.status, 401);
  assert.equal((await run(requireAuth, { user: { id: 'u1' } })).err, undefined);
});

test('me returns null when signed out, and logout clears the cookie', async () => {
  assert.deepEqual((await run(me, {})).res.body, { user: null });
  assert.deepEqual((await run(logout, {})).res.cleared, ['session']);
});

// ---------- CSRF origin check ----------
test('originCheck blocks state-changing requests from other sites when CLIENT_ORIGIN is set', async () => {
  process.env.CLIENT_ORIGIN = 'https://blog.example.com';
  try {
    const post = (origin) => run(originCheck, { method: 'POST', headers: { origin } });
    assert.equal((await post('https://evil.example.com')).err.status, 403);
    assert.equal((await post('https://blog.example.com')).err, undefined);
    assert.equal((await run(originCheck, { method: 'GET', headers: { origin: 'https://evil.example.com' } })).err, undefined);
  } finally {
    delete process.env.CLIENT_ORIGIN;
  }
});

// ---------- post ownership rules ----------
const fakePost = (author_id) => ({
  author_id,
  deleted: false,
  saved: false,
  async save() { this.saved = true; return this; },
  async deleteOne() { this.deleted = true; },
});
const stubFind = (post) => mock.method(Post, 'findById', () => ({ select: async () => post }));
const alice = { id: 'alice', name: 'Alice', role: 'user' };
const bob = { id: 'bob', name: 'Bob', role: 'user' };

test('createPost records the signed-in user as owner and defaults the author name', async () => {
  let saved;
  mock.method(Post, 'create', async (doc) => (saved = doc));
  await postService.createPost({ title: 't', content: 'c', author: '  ' }, undefined, alice);
  assert.equal(saved.author_id, 'alice');
  assert.equal(saved.author, 'Alice');
});

test("a user cannot edit or delete someone else's post", async () => {
  const post = fakePost('alice');
  stubFind(post);
  await assert.rejects(postService.updatePost('id', { title: 'hacked' }, undefined, bob), { status: 403 });
  await assert.rejects(postService.deletePost('id', bob), { status: 403 });
  assert.equal(post.saved, false);
  assert.equal(post.deleted, false);
});

test('an owner can edit and delete their own post', async () => {
  const post = fakePost('alice');
  stubFind(post);
  await postService.updatePost('id', { title: 'new' }, undefined, alice);
  await postService.deletePost('id', alice);
  assert.equal(post.saved, true);
  assert.equal(post.deleted, true);
});

test('an admin can delete a legacy post that has no owner', async () => {
  const post = fakePost(null);
  stubFind(post);
  await postService.deletePost('id', { id: 'boss', role: 'admin' });
  assert.equal(post.deleted, true);
});
