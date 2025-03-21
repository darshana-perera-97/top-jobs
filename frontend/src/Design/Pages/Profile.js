import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddJobData from "../Components/AddJobData";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="container mt-5">
      {user ? (
        <div className="card p-4">
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>

          {/* Fix: Ensure categories exist before using .join() */}
          <p>
            Categories:{" "}
            {user.categories && Array.isArray(user.categories)
              ? user.categories.join(", ")
              : "No categories selected"}
          </p>

          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <AddJobData />
    </div>
  );
}
