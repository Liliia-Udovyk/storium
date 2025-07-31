import { FcGoogle } from 'react-icons/fc';

import { Button } from './ui/button';

export const GoogleSignInButton = () => {
  const handleLogin = () => {
    const url = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
      : 'http://localhost:4000/auth/google';
    window.location.href = url;
  };

  return (
    <Button onClick={handleLogin} className="flex items-center justify-center gap-2" type="button" variant="secondary" aria-label="Sign in with Google">
      <FcGoogle size={20} />
      Sign in with Google
    </Button>
  );
};
