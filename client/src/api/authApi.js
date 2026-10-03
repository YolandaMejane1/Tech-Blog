import client from './client';

export const getMe = () => client.get('/auth/me');
export const googleSignIn = (credential) => client.post('/auth/google', { credential });
export const logout = () => client.post('/auth/logout');
