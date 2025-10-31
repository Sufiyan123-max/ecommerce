import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignInModal from '../components/SignInModal';

const SignIn = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = (userData) => {
    signIn(userData);
    navigate('/');
  };

  const handleClose = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SignInModal 
        isOpen={isModalOpen} 
        onClose={handleClose} 
        onSignIn={handleSignIn} 
      />
    </div>
  );
};

export default SignIn;

