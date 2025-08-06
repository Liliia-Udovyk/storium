'use client';

import { GoogleSignInButton } from "../components/google-signIn-button";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm border border-gray-300 rounded-md shadow-md bg-white p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold">VRealSoft test task</h1>
        <p className="text-sm text-gray-600">Sign in / Sign up</p>
        <GoogleSignInButton />
        <a href="#" className="text-xs text-blue-500 hover:underline block">
          Need help?
        </a>
      </div>
    </div>
  );
}
