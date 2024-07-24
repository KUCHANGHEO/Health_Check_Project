import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const navigate = useNavigate();

  // 서비스 데이터를 가져오는 함수
  const fetchData = useCallback(async (tag = "all") => {
    try {
      const result = await axios.get("/api/services", { params: { tag } });
      setServices(result.data);
      setLoading(false);
      applyFilter(result.data, tag); // 데이터를 가져온 후 필터 적용
    } catch (error) {
      setError("Error fetching home data.");
      setLoading(false);
    }
  }, []);

  // 태그 목록을 가져오는 함수
  const fetchTags = async () => {
    try {
      const result = await axios.get("/api/filters");
      setTags(result.data.tags);
    } catch (error) {
      setError("Error fetching tags.");
    }
  };

  useEffect(() => {
    fetchData();
    fetchTags();
  }, [fetchData]);

  // 서비스 상태를 새로고침하는 함수
  const refreshServices = async () => {
    setRefreshing(true);
    try {
      await Promise.all(
        services.map((service) =>
          axios.get(`/api/services/${service.id}/refresh`)
        )
      );
      // refresh 후에 데이터를 다시 가져오기
      await fetchData(selectedTag);
    } catch (error) {
      setError("Error refreshing service statuses.");
    }
    setRefreshing(false);
  };

  const handleTagChange = (e) => {
    const tag = e.target.value;
    setSelectedTag(tag);
    fetchData(tag); // 태그 변경 시 데이터 다시 가져오기
  };

  // 필터를 적용하는 함수
  const applyFilter = useCallback((servicesData, tag) => {
    if (tag === "all") {
      setFilteredServices(servicesData);
    } else {
      const newFilteredServices = servicesData.filter(
        (service) => service.tags && service.tags.split(",").includes(tag)
      );
      setFilteredServices(newFilteredServices);
    }
  }, []);

  useEffect(() => {
    applyFilter(services, selectedTag);
  }, [selectedTag, services, applyFilter]);

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
          {filteredServices.map((service) => (
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
