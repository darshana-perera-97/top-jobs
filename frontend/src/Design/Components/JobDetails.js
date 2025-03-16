import React from "react";

const JobDetails = ({ jobData }) => {
  // Check if jobData is defined and set fallback default values
  if (!jobData) {
    return <p>Loading job details...</p>;
  }

  // Check if responsibilities and requirements are arrays
  const responsibilities = Array.isArray(jobData.responsibilities)
    ? jobData.responsibilities
    : [];
  const requirements = Array.isArray(jobData.requirements)
    ? jobData.requirements
    : [];

  return (
    <div className="container">
      <h2>{jobData.jobTitle}</h2>
      <h4>Location: {jobData.location}</h4>
      <h5>Company: {jobData.company}</h5>
      <p>
        <strong>About Us:</strong> {jobData.aboutUs}
      </p>
      <p>
        <strong>Job Overview:</strong> {jobData.jobOverview}
      </p>

      {/* Displaying Responsibilities as a list */}
      <h5>Responsibilities:</h5>
      <ul>
        {responsibilities.length > 0 ? (
          responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))
        ) : (
          <p>No responsibilities listed</p>
        )}
      </ul>

      {/* Displaying Requirements as a list */}
      <h5>Requirements:</h5>
      <ul>
        {requirements.length > 0 ? (
          requirements.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))
        ) : (
          <p>No requirements listed</p>
        )}
      </ul>

      <h5>How to Apply:</h5>
      <p>{jobData.howToApply}</p>
    </div>
  );
};

export default JobDetails;
