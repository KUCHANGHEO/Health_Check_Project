import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const result = await axios.get('/api/services');
      setServices(result.data);
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/api/services/${id}`);
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <div>
      <h1>Services</h1>
      <ul>
        {services.map(service => (
          <li key={service.id}>
            {service.name} - {service.url}
            <button onClick={() => handleDelete(service.id)}>Delete</button>
            <Link to={`/services/${service.id}/edit`}>Edit</Link>
          </li>
        ))}
      </ul>
      <Link to="/service/new">Add New Service</Link>
      <br />
      <Link to="/status">View Status Checks</Link>
    </div>
  );
};

export default ServiceList;
