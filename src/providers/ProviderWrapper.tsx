'use client';
import { useAppDispatch } from "@/hooks/hooks";
import { setUser } from "@/redux/features/authSlice";
import { useAuthUserQuery } from "@/redux/service/auth";
import React, { useEffect } from "react";

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data } = useAuthUserQuery();
  const user = data?.payload;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser({ user }));
    }
  }, [user, dispatch]);

  return (
    <>
     
      {children}
    </>
  );
};

export default ProviderWrapper;
