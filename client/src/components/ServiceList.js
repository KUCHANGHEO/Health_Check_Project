import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // navigate 대신 Link를 사용하려는 것 같습니다

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await axios.get("/api/services");
        setServices(result.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching services");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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
          </li>
        ))}
      </ul>
      <Link to="/service/new">Add New Service</Link>
    </div>
  );
};

export default ServiceList;
