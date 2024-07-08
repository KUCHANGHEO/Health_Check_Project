import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/services");
        setData(result.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching home data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Services</h2>
        <ul>
          {data.map((service) => (
            <li key={service.id}>
              <h3>{service.name}</h3>
              <p>URL: {service.url}</p>
              <p>Server Info: {service.server_info}</p>
              <p>Description: {service.description}</p>
              <p>Work Directory: {service.work_directory}</p>
              <p>Execute Command: {service.execute_command}</p>
            </li>
          ))}
        </ul>
      </div>
      <nav>
        <Link to="/services">View Services</Link>
        <br />
        <Link to="/service/new">Add New Service</Link>
        <br />
        <Link to="/status">View Status Checks</Link>
      </nav>
    </div>
  );
};

export default Home;
