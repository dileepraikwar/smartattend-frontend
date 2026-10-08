import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={{
      padding: "12px 24px",
      background: "#4f46e5",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div style={{ display: "flex", gap: "16px" }}>
        {role === "ADMIN" && (
          <Link to="/dashboard" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>Dashboard</Link>
        )}
        <Link to="/checkin" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>Check In</Link>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {name && <span style={{ color: "#fff" }}>{name}</span>}
        <button
          onClick={handleLogout}
          style={{ background: "#fff", color: "#4f46e5", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;