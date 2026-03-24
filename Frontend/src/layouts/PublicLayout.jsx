// src/layouts/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen">
      {/* If you have a public navbar/header, keep it here */}
      <Outlet />
    </div>
  );
}
