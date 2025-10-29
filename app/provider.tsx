"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { OnSaveContext } from "@/context/OnSaveContext";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userDetails, setUserDetails] = useState<any>();
  const [onSaveDate, setOnSaveDate] = useState<any>();

  // useEffect(() => {
  //   console.log("Is SignedIn?", isSignedIn, "user:", user);
  //   if (isLoaded && isSignedIn && user) {
  //     CreateNewUser();
  //   }
  // }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  // const CreateNewUser = async () => {
  // const result = await axios.post("/api/users", {});
  // console.log(result.data);

  // try {
  //   const result = await axios.post("/api/users", {});
  //   console.log("API response:", result.data);
  //   setUserDetails(result.data?.user);
  // } catch (error: any) {
  //     console.error("API call failed:", error?.response?.data || error.message);
  //   }
  // };

  const CreateNewUser = async () => {
    try {
      const result = await axios.post(
        "/api/users",
        {}
        // { withCredentials: true }
      );
      console.log("API response:", result.data);
      setUserDetails(result.data.user);
    } catch (error: any) {
      console.error("API call failed:", error?.response?.data || error.message);
    }
  };

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <OnSaveContext.Provider value={{ onSaveDate, setOnSaveDate }}>
          {children}
        </OnSaveContext.Provider>
      </UserDetailContext.Provider>
    </div>
  );
};

export default Provider;
