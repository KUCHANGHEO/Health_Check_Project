import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const result = await axios.get("/api/services");
      setServices(result.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching home data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshServices = async () => {
    setRefreshing(true);
    try {
      const serviceStatuses = await Promise.all(
        services.map((service) =>
          axios
            .get(`/api/services/${service.id}/check`)
            .then((response) => response.data)
        )
      );
      setServices(serviceStatuses);
    } catch (error) {
      setError("Error refreshing service statuses.");
    }
    setRefreshing(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const getStatusColor = (status) => {
    if (status === "Healthy") return "green";
    if (status === "Unhealthy") return "red";
    return "gray";
  };

  const handleServiceClick = (id) => {
    navigate(`/services/${id}`);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>
          Services
          <button
            onClick={refreshServices}
            disabled={refreshing}
            style={{ marginLeft: "16px" }}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              style={{
                border: `2px solid black`,
                borderRadius: "8px",
                padding: "16px",
                margin: "8px",
                cursor: "pointer",
                width: "200px",
                textAlign: "center",
              }}
            >
              <h3>{service.name}</h3>
              <p>
                Status:{" "}
                <span style={{ color: getStatusColor(service.status) }}>
                  {service.status}
                </span>
              </p>
            </div>
          ))}
        </div>
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
