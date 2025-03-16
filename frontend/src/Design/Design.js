import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddJob from "./Pages/AddJob";
import Home from "./Pages/Home";
import SingleJob from "./Pages/SingleJob";
import UserData from "./Pages/UserData";
import UserLogin from "./Pages/UserLogin";
import ViewJobs from "./Pages/ViewJobs";
import NavigationBar from "./Layouts/Navbar";
import JobDetails from "./Pages/JobDetails";
import Profile from "./Pages/Profile";
import UserLoginForm from "./Pages/UserLoginForm";

export default function Design() {
  return (
    <div>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-job" element={<AddJob />} />
          <Route path="/single-job" element={<SingleJob />} />
          <Route path="/user-data" element={<UserData />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/view-jobs" element={<ViewJobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<UserLoginForm />} />
        </Routes>
      </Router>
    </div>
  );
}
