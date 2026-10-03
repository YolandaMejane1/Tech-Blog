import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'x'.repeat(40);

const { signSession, verifySession, cookieOptions } = await import('../src/services/sessionService.js');

test('a signed session verifies and returns the user id', () => {
  assert.equal(verifySession(signSession('abc123')), 'abc123');
});

test('a tampered token is rejected with 401', () => {
  const token = signSession('abc123');
  const bad = token.slice(0, -2) + (token.endsWith('aa') ? 'bb' : 'aa');
  assert.throws(() => verifySession(bad), { status: 401 });
});

test('a token signed with a different secret is rejected', () => {
  const forged = jwt.sign({}, 'y'.repeat(40), { subject: 'abc123', issuer: 'tech-blog' });
  assert.throws(() => verifySession(forged), { status: 401 });
});

test('an expired token is rejected', () => {
  const expired = jwt.sign({}, process.env.JWT_SECRET, {
    subject: 'abc123',
    issuer: 'tech-blog',
    expiresIn: -10,
  });
  assert.throws(() => verifySession(expired), { status: 401 });
});

test('an unsigned ("alg: none") token is rejected', () => {
  const none = jwt.sign({}, '', { algorithm: 'none', subject: 'abc123', issuer: 'tech-blog' });
  assert.throws(() => verifySession(none), { status: 401 });
});

test('a missing or short JWT_SECRET is a configuration error, not a 401', () => {
  const original = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'short';
  try {
    assert.throws(() => signSession('abc123'), /JWT_SECRET/);
  } finally {
    process.env.JWT_SECRET = original;
  }
});

test('session cookie is httpOnly and sameSite=lax', () => {
  const opts = cookieOptions();
  assert.equal(opts.httpOnly, true);
  assert.equal(opts.sameSite, 'lax');
});
