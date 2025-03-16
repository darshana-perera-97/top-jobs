import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import categories from "../Data/categories";

export default function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    categories: [],
  });
  const [cvFile, setCvFile] = useState(null);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const { options } = e.target;
    const selectedCategories = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedCategories.push(options[i].value);
      }
    }
    setUserData({ ...userData, categories: selectedCategories });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("categories", JSON.stringify(userData.categories));
    if (cvFile) {
      formData.append("cv", cvFile);
    }

    const res = await fetch("http://localhost:5012/api/users", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: userData.username,
          email: userData.email,
          categories: userData.categories,
        })
      );
      navigate("/profile");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="form-control mb-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="form-control mb-2"
          />

          <label>Select Categories:</label>
          <select
            multiple
            className="form-control mb-2"
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <label>Upload CV:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCvFile(e.target.files[0])}
            className="form-control mb-3"
          />

          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
