import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ServiceList from './components/ServiceList';
import ServiceForm from './components/ServiceForm';
import ServiceEditForm from './components/ServiceEditForm';
import StatusCheckList from './components/StatusCheckList';

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
          <Route path="/services" element={<ServiceList />} />
          <Route path="/service/new" element={<ServiceForm />} />
          <Route path="/services/:id/edit" element={<ServiceEditForm />} />
          <Route path="/status" element={<StatusCheckList />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
