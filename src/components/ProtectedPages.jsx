import React, { useLayoutEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import Header from "./Header";

function ProtectedPages() {
  const navigate = useNavigate();
  const auth = getAuth();

  useLayoutEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <>
      <Header /> <Outlet />
    </>
  );
}

export default ProtectedPages;
