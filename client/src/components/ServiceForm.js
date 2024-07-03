import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ServiceForm = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [serverInfo, setServerInfo] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const service = { name, url, server_info: serverInfo, description };
    try {
      await axios.post('/api/services', service);
      navigate('/services');
    } catch (error) {
      console.error('There was an error registering the service:', error);
    }
  };

  return (
    <div>
      <h1>Register Service</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>URL:</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div>
          <label>Server Info:</label>
          <input type="text" value={serverInfo} onChange={(e) => setServerInfo(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
      <br />
      <Link to="/services">Back to Service List</Link>
    </div>
  );
};

export default ServiceForm;
