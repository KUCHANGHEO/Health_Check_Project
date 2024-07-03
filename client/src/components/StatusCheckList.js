import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StatusCheckList = () => {
  const [statusChecks, setStatusChecks] = useState([]);

  useEffect(() => {
    const fetchStatusChecks = async () => {
      const result = await axios.get('/api/status');
      setStatusChecks(result.data);
    };

    fetchStatusChecks();
  }, []);

  return (
    <div>
      <h1>Status Checks</h1>
      <ul>
        {statusChecks.map(status => (
          <li key={status.id}>
            {status.Service.name}: {status.status_code === 200 ? 'Healthy' : 'Unhealthy'} - {status.response_time ? `${status.response_time}ms` : 'No response'} at {new Date(status.check_time).toLocaleString()}
          </li>
        ))}
      </ul>
      <br />
      <Link to="/services">Back to Service List</Link>
    </div>
  );
};

export default StatusCheckList;
