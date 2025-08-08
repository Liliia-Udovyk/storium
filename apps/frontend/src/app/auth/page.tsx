'use client';

import { GoogleSignInButton } from "../components/google-signIn-button";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col items-center justify-center w-full max-w-sm border border-gray-300 rounded-md shadow-md bg-white p-6 text-center space-y-4">
        <div className="text-3xl font-bold text-blue-800">
          Storium
        </div>
        <p className="text-m font-bold text-gray-600">File Storage App</p>
        <p className="text-sm text-gray-600">Sign in / Sign up</p>
        <GoogleSignInButton />
      </div>
    </div>
  );
}
