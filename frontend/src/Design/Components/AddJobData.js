import React, { useState, useEffect } from "react";
import Select from "react-select";
import categories from "../Data/categories";

export default function AddJobData() {
  const [userData, setUserData] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
      alert("User data not found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "categories",
      JSON.stringify(selectedCategories.map((cat) => cat.value))
    );
    if (cvFile) {
      formData.append("cv", cvFile);
    }

    try {
      const response = await fetch(
        "http://localhost:5012/api/updateUserCategories",
        {
          method: "POST",
          body: formData, // Sending as FormData because it includes a file
        }
      );

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="text-center mb-4">Select Categories & Upload CV</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Categories</label>
                <Select
                  options={categories}
                  isMulti
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select categories..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Upload CV (PDF only)</label>
                <input
                  type="file"
                  className="form-control"
                  accept="application/pdf"
                  onChange={(e) => setCvFile(e.target.files[0])}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
