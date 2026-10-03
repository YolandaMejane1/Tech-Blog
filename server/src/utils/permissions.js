// A user can change a post if they are an admin or they own it.
// Posts without an owner (migrated from the old site) can only be changed by admins.
export const canModifyPost = (user, post) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return Boolean(post.author_id) && String(post.author_id) === String(user.id);
};
