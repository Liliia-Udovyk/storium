import { FcGoogle } from 'react-icons/fc';

import Button from './ui/button';

export const GoogleSignInButton = () => {
  const handleLogin = () => {
    const url = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
      : 'http://localhost:4000/auth/google';
    window.location.href = url;
  };

  return (
    <Button
      onClick={handleLogin}
      variant="secondary"
      icon={<FcGoogle size={20} />}
      aria-label="Sign in with Google"
    >
      Sign in with Google
    </Button>
  );
};
