import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ServiceList from "./components/ServiceList";
import ServiceForm from "./components/ServiceForm";
import ServiceEditForm from "./components/ServiceEditForm";
import StatusCheckList from "./components/StatusCheckList";
import Home from "./components/Home";
import ServiceDetail from "./components/ServiceDetail";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/service/new">Add New Service</Link>
            </li>
            <li>
              <Link to="/status">Status Checks</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/service/new" element={<ServiceForm />} />
          <Route path="/services/:id/edit" element={<ServiceEditForm />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/status" element={<StatusCheckList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
