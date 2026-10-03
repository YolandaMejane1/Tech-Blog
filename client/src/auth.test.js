import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { getMe } from './api/authApi';

// factory mock so the real module (and axios, which jest can't parse) is never loaded
jest.mock('./api/authApi', () => ({
  getMe: jest.fn(),
  googleSignIn: jest.fn(),
  logout: jest.fn(),
}));

const renderAt = (path) =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<p>login page</p>} />
          <Route path="/create" element={<ProtectedRoute><p>secret create page</p></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

test('signed-out visitors are sent to the login page', async () => {
  getMe.mockResolvedValue({ data: { user: null } });
  renderAt('/create');
  expect(await screen.findByText('login page')).toBeInTheDocument();
  expect(screen.queryByText('secret create page')).not.toBeInTheDocument();
});

test('signed-in users can see protected pages', async () => {
  getMe.mockResolvedValue({ data: { user: { id: 'u1', name: 'Jane', role: 'user' } } });
  renderAt('/create');
  await waitFor(() => expect(screen.getByText('secret create page')).toBeInTheDocument());
});
