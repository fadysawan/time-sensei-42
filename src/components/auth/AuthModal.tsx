import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { SocialLoginButtons } from './SocialLoginButtons';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleClose = () => {
    setMode(defaultMode);
    setError('');
    setShowForgotPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Only close when explicitly closed, not on click outside
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {mode === 'login' ? (
            <LoginForm
              onToggleMode={handleToggleMode}
              onForgotPassword={handleForgotPassword}
            />
          ) : (
            <SignupForm onToggleMode={handleToggleMode} />
          )}

          <SocialLoginButtons onError={handleError} />
        </div>
      </DialogContent>
    </Dialog>
  );
};



