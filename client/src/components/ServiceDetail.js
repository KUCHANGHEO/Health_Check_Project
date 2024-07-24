import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchService = useCallback(async () => {
    try {
      const response = await axios.get(`/api/services/${id}`);
      setService(response.data);
    } catch (error) {
      setError("Error fetching service data.");
    }
  }, [id]);

  const fetchLogs = useCallback(async () => {
    try {
      const response = await axios.get(`/api/services/${id}/logs`);
      setLogs(response.data);
    } catch (error) {
      setError("Error fetching service logs.");
    }
  }, [id]);

  const refreshService = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`/api/services/${id}/refresh`);
      setService(response.data);
    } catch (error) {
      setError("Error refreshing service data.");
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchService();
    fetchLogs();
  }, [fetchService, fetchLogs]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!service) {
    return <p>Loading...</p>;
  }

  const handleEdit = () => {
    navigate(`/services/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/services/${id}`);
      navigate("/services");
    } catch (error) {
      setError("Error deleting service.");
    }
  };

  return (
    <div>
      <h1>Service Detail</h1>
      <p>Name: {service.name}</p>
      <p>URL: {service.url}</p>
      <p>Server Info: {service.server_info || "N/A"}</p>
      <p>Description: {service.description || "N/A"}</p>
      <p>Work Directory: {service.work_directory || "N/A"}</p>
      <p>Execute Command: {service.execute_command || "N/A"}</p>
      <p>
        Tags:{" "}
        {service.tags
          ? service.tags
              .split(",")
              .map((tag) => tag.trim())
              .join(", ")
          : "N/A"}
      </p>
      <p>Status: {service.server_status}</p>
      <button onClick={refreshService} disabled={refreshing}>
        {refreshing ? "Refreshing..." : "Refresh"}
      </button>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
      <h2>Health Check Logs</h2>
      <div style={{ maxHeight: "200px", overflowY: "scroll" }}>
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              {log.check_time}:{" "}
              {log.status_code === 200 ? "Healthy" : "Unhealthy"}
            </li>
          ))}
        </ul>
      </div>
      <Link to="/services">Back to Services</Link>
    </div>
  );
};

export default ServiceDetail;
