import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const navigate = useNavigate();

  const fetchData = useCallback(async (tag = "all") => {
    try {
      const result = await axios.get("/api/services", { params: { tag } });
      console.log("Fetched services:", result.data);
      setServices(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching home data:", error);
      setError("Error fetching home data.");
      setLoading(false);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const result = await axios.get("/api/filters");
      setTags(result.data.tags);
    } catch (error) {
      setError("Error fetching tags.");
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchTags();
  }, [fetchData, fetchTags]);

  const refreshServices = async () => {
    setRefreshing(true);
    try {
      const refreshedServices = await Promise.all(
        services.map((service) =>
          axios
            .get(`/api/services/${service.id}/refresh`)
            .then((response) => response.data)
        )
      );
      setServices(refreshedServices);
    } catch (error) {
      setError("Error refreshing service statuses.");
    }
    setRefreshing(false);
  };

  const handleTagChange = (e) => {
    const tag = e.target.value;
    setSelectedTag(tag);
    fetchData(tag);
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
        <div>
          <select value={selectedTag} onChange={handleTagChange}>
            <option value="all">All</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
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
