import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await axios.get("/api/services");
        setServices(result.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching services.");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/services/${id}`);
      setServices(services.filter((service) => service.id !== id));
    } catch (error) {
      console.error("There was an error deleting the service:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Services</h1>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <Link to={`/services/${service.id}`}>{service.name}</Link>
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
