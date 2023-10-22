import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from './home/Home'
import Login from "./login/Login";
import Register from "./register/Register";
import ManageFriends from "./manage-friends/ManageFriends";

export default function Routing() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Manage-Friends" element={<ManageFriends />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </div>
  );
}
