import React, { useState } from "react";
import Select from "react-select";
import categories from "../Data/categories"; // Import the category list

const AddJobForm = () => {
  const [jobData, setJobData] = useState({
    jobTitle: "",
    location: "",
    company: "",
    aboutUs: "",
    jobOverview: "",
    responsibilities: "",
    requirements: "",
    howToApply: "",
    categories: [], // ✅ FIXED - Always an array
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  // Handle category selection
  const handleCategoryChange = (selectedOptions) => {
    setJobData({
      ...jobData,
      categories: selectedOptions.map((option) => option.value), // Store only category values
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate if all fields are filled
    if (Object.values(jobData).some((field) => field === "")) {
      setError("All fields are required");
      return;
    }

    try {
      // Send POST request using fetch
      const response = await fetch("http://localhost:5012/addNewJobManual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to add job");
      }

      const result = await response.json();
      setSuccess(result.message || "Job added successfully!");

      // Reset the form
      setJobData({
        jobTitle: "",
        location: "",
        company: "",
        aboutUs: "",
        jobOverview: "",
        responsibilities: "",
        requirements: "",
        howToApply: "",
      });
    } catch (err) {
      setError("Failed to add job. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New Job</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="jobTitle" className="form-label">
            Job Title
          </label>
          <input
            type="text"
            className="form-control"
            id="jobTitle"
            name="jobTitle"
            value={jobData.jobTitle}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categories</label>
          <Select
            options={categories}
            isMulti
            isSearchable
            value={categories.filter(
              (category) =>
                jobData.categories?.includes(category.value) || false
            )} // ✅ Fixed issue
            onChange={handleCategoryChange}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            name="location"
            value={jobData.location}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="company" className="form-label">
            Company
          </label>
          <input
            type="text"
            className="form-control"
            id="company"
            name="company"
            value={jobData.company}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="aboutUs" className="form-label">
            About Us
          </label>
          <textarea
            className="form-control"
            id="aboutUs"
            name="aboutUs"
            value={jobData.aboutUs}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="jobOverview" className="form-label">
            Job Overview
          </label>
          <textarea
            className="form-control"
            id="jobOverview"
            name="jobOverview"
            value={jobData.jobOverview}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="responsibilities" className="form-label">
            Responsibilities
          </label>
          <textarea
            className="form-control"
            id="responsibilities"
            name="responsibilities"
            value={jobData.responsibilities}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="requirements" className="form-label">
            Requirements
          </label>
          <textarea
            className="form-control"
            id="requirements"
            name="requirements"
            value={jobData.requirements}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="howToApply" className="form-label">
            How to Apply
          </label>
          <textarea
            className="form-control"
            id="howToApply"
            name="howToApply"
            value={jobData.howToApply}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Job
        </button>
      </form>
    </div>
  );
};

export default AddJobForm;
