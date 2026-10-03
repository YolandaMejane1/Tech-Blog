import test from 'node:test';
import assert from 'node:assert/strict';
import { canModifyPost } from '../src/utils/permissions.js';

const owner = { id: 'u1', role: 'user' };

test('owner can modify their own post', () => {
  assert.equal(canModifyPost(owner, { author_id: 'u1' }), true);
});

test("another user cannot modify someone else's post", () => {
  assert.equal(canModifyPost({ id: 'u2', role: 'user' }, { author_id: 'u1' }), false);
});

test('admin can modify any post, including ownerless legacy posts', () => {
  const admin = { id: 'a1', role: 'admin' };
  assert.equal(canModifyPost(admin, { author_id: 'u1' }), true);
  assert.equal(canModifyPost(admin, { author_id: null }), true);
});

test('regular users cannot modify legacy posts that have no owner', () => {
  assert.equal(canModifyPost(owner, { author_id: null }), false);
});

test('anonymous visitors cannot modify anything', () => {
  assert.equal(canModifyPost(undefined, { author_id: 'u1' }), false);
});
