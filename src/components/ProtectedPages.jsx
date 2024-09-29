import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";

function ProtectedPages() {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  return <Outlet />;
}

export default ProtectedPages;
