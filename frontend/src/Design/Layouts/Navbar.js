import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Job Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/add-job">
              Add Job
            </Nav.Link>
            <Nav.Link as={Link} to="/single-job">
              Single Job
            </Nav.Link>
            <Nav.Link as={Link} to="/user-data">
              User Data
            </Nav.Link>
            <Nav.Link as={Link} to="/user-login">
              User Login
            </Nav.Link>
            <Nav.Link as={Link} to="/view-jobs">
              View Jobs
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
