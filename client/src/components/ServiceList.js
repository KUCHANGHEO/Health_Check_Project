import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await axios.get("/api/services");
        setServices(result.data);
      } catch (error) {
        setError("Error fetching services.");
        console.error("There was an error fetching the services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/services/${id}`);
      setServices(services.filter((service) => service.id !== id));
    } catch (error) {
      setError("Error deleting service.");
      console.error("There was an error deleting the service:", error);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Services</h1>
      <ul>
        {services.map((service) => (
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
