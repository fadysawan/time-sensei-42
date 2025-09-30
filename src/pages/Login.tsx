import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';

export const Login: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  // If user is already logged in, redirect to intended page or home
  if (currentUser) {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
    return null;
  }

  const handleClose = () => {
    setIsModalOpen(false);
    // Redirect to home if no intended destination
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  return (
    <AuthModal
      isOpen={isModalOpen}
      onClose={handleClose}
      defaultMode="login"
    />
  );
};



