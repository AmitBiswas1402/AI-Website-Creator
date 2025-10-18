"use client";
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect } from 'react';

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    console.log("Is SignedIn?", isSignedIn, "user:", user);
    if (isLoaded && isSignedIn && user) {
      CreateNewUser();
    }
  }, [isLoaded, isSignedIn, user]);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post('/api/users', {});
      console.log("API response:", result.data);
    } catch (error: any) {
      console.error("API call failed:", error?.response?.data || error.message);
    }
  };

  return (
    <div>
      {children}
    </div>
  );
};

export default Provider;
