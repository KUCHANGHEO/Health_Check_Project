import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const StatusCheckList = () => {
  const [statusChecks, setStatusChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatusChecks = async () => {
      try {
        const result = await axios.get("/api/status");
        setStatusChecks(result.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching status checks.");
        setLoading(false);
      }
    };

    fetchStatusChecks();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Status Checks</h1>
      <ul>
        {statusChecks.map((check) => (
          <li key={check.id}>
            <p>Service: {check.Service.name}</p>
            <p>Check Time: {new Date(check.check_time).toLocaleString()}</p>
            <p>Status Code: {check.status_code}</p>
            <p>Response Time: {check.response_time}ms</p>
          </li>
        ))}
      </ul>
      <nav>
        <Link to="/">Back to Home</Link>
      </nav>
    </div>
  );
};

export default StatusCheckList;
