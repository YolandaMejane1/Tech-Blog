import test from 'node:test';
import assert from 'node:assert/strict';
import Post from '../src/models/Post.js';

test('toJSON exposes id/image_url and hides raw image bytes', () => {
  const post = new Post({
    title: 'Hello',
    content: 'World',
    author: 'Yolanda',
    image: { data: Buffer.from('x'), contentType: 'image/png' },
  });
  post.updated_at = new Date();
  const json = post.toJSON();

  assert.equal(json.id, post._id.toString());
  assert.match(json.image_url, new RegExp(`^/api/posts/${json.id}/image\\?v=\\d+$`));
  assert.equal(json._id, undefined);
  assert.equal(json.image, undefined);
});

test('image_url is null when a post has no image', () => {
  const post = new Post({ title: 'a', content: 'b', author: 'c' });
  assert.equal(post.toJSON().image_url, null);
});

test('title, content and author are required', () => {
  const errors = new Post({ title: 'only title' }).validateSync().errors;
  assert.deepEqual(Object.keys(errors).sort(), ['author', 'content']);
});
