import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import About from './pages/About';
import Blogs from './pages/Blogs';
import Create from './pages/Create';
import PostView from './pages/PostView';
import ContactUs from './components/ContactUs';
import EditPost from './pages/EditPost';
import Login from './pages/Login';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <div className="App">
          <Router>
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<Blogs />} />
                <Route path="/about" element={<About />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
                <Route path="/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
                <Route path="/post/:postId" element={<PostView />} />
              </Routes>
            </div>
            <ContactUs />
          </Router>
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
