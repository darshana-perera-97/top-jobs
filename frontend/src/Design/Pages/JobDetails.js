import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const JobDetails = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the job details based on the job ID from the backend
    fetch(`http://localhost:5012/getJobDetails/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (!job) {
    return <p>Job not found</p>;
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body>
          <Card.Title>{job.jobTitle}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {job.company}
          </Card.Subtitle>
          <Card.Text>{job.jobOverview}</Card.Text>
          <Card.Text>
            <strong>Responsibilities:</strong>
            <ul>
              {Array.isArray(job.responsibilities) &&
                job.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
            </ul>
          </Card.Text>
          <Card.Text>
            <strong>Requirements:</strong>
            <ul>
              {Array.isArray(job.requirements) &&
                job.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
            </ul>
          </Card.Text>
          <Card.Text>
            <strong>How to Apply:</strong>
            <p>{job.howToApply}</p>
          </Card.Text>
          <Button variant="primary" href="/">
            Back to Jobs
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default JobDetails;
