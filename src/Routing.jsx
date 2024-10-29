import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import ProtectedPages from "./components/ProtectedPages";
import Profile from "./components/Profile";
import Finance from "./components/Finance";
import Students from "./components/Students";
import UsersManage from "./components/UsersManage";
import Archive from "./components/Archive";
import Intervention from "./components/Intervention";

function Routing() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedPages />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/students" element={<Students />} />
          <Route path="/users-manage" element={<UsersManage />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/intervention/*" element={<Intervention />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default Routing;
