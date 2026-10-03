import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const redirectTo = location.state?.from || '/blogs';

  if (!loading && user) return <Navigate to={redirectTo} replace />;

  const handleSuccess = async (response) => {
    setError('');
    setBusy(true);
    try {
      await signInWithGoogle(response.credential);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign you in. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div
      className="flex w-screen justify-center items-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1459278558918-f94278c0f022?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="w-full max-w-md p-6 bg-white bg-opacity-5 backdrop-blur-sm shadow-lg border border-gray-300">
        <h2 className="text-2xl font-thin text-center mb-2 text-white">Sign in</h2>
        <p className="text-sm font-light text-center mb-6 text-white">
          Sign in to write, edit and delete your own posts. New here? Continuing with Google
          creates your account automatically.
        </p>

        {!process.env.REACT_APP_GOOGLE_CLIENT_ID ? (
          <p className="text-center text-white text-sm">
            Google sign-in isn&apos;t configured. Set REACT_APP_GOOGLE_CLIENT_ID in client/.env.
          </p>
        ) : (
          <div className={`flex justify-center ${busy ? 'opacity-50 pointer-events-none' : ''}`}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setError('Google sign-in failed. Please try again.')}
              theme="outline"
              shape="rectangular"
              size="large"
              text="continue_with"
            />
          </div>
        )}

        {busy && <p className="mt-4 text-center text-white text-sm font-light">Signing you in...</p>}
        {error && (
          <p role="alert" className="mt-4 text-center text-sm text-white border border-white p-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
