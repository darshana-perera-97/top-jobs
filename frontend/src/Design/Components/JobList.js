import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all jobs from the backend
    fetch("http://localhost:5012/getAllJobs")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Available Jobs</h2>
      <Row>
        {jobs.map((job, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{job.jobTitle}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {job.company}
                </Card.Subtitle>
                <Card.Text>{job.jobOverview}</Card.Text>
                <Button variant="primary" href={`/job/${job.id}`}>
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default JobList;
