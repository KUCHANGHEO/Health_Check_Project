import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ServiceEditForm = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [serverInfo, setServerInfo] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const result = await axios.get(`/api/services/${id}`);
        const service = result.data;
        setName(service.name);
        setUrl(service.url);
        setServerInfo(service.server_info);
        setDescription(service.description);
      } catch (error) {
        console.error('There was an error fetching the service:', error);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const service = { name, url, server_info: serverInfo, description };
    try {
      await axios.put(`/api/services/${id}`, service);
      navigate('/services');
    } catch (error) {
      console.error('There was an error updating the service:', error);
    }
  };

  return (
    <div>
      <h1>Edit Service</h1>
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

export default ServiceEditForm;
