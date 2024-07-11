import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchService = async () => {
    try {
      const result = await axios.get(`/api/services/${id}`);
      setService(result.data);
      const logResult = await axios.get(`/api/services/${id}/logs`);
      setLogs(logResult.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching service data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`/api/services/${id}/refresh`);
      setService(result.data);
      const logResult = await axios.get(`/api/services/${id}/logs`);
      setLogs(logResult.data);
      setLoading(false);
    } catch (error) {
      setError("Error refreshing service data.");
      setLoading(false);
    }
  };

  const handleChangeToWait = async () => {
    try {
      const result = await axios.put(`/api/services/${id}`, {
        server_status: "wait",
      });
      setService(result.data);
    } catch (error) {
      setError("Error changing server status to wait.");
      console.error(
        "There was an error changing the server status to wait:",
        error
      );
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/services/${id}`);
      navigate("/services");
    } catch (error) {
      setError("Error deleting service.");
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
      <h1>{service.name}</h1>
      <p>URL: {service.url}</p>
      <p>Server Status: {service.server_status}</p>
      <p>Server Info: {service.server_info || ""}</p>
      <p>Description: {service.description || ""}</p>
      <p>Work Directory: {service.work_directory || ""}</p>
      <p>Execute Command: {service.execute_command || ""}</p>
      <p>Tags: {service.tags ? service.tags.join(", ") : ""}</p>
      <button onClick={() => navigate(`/services/${id}/edit`)}>Edit</button>
      <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
        Delete
      </button>
      <button onClick={handleRefresh} style={{ marginLeft: "10px" }}>
        Refresh
      </button>
      {service.server_status === "down" && (
        <button onClick={handleChangeToWait} style={{ marginLeft: "10px" }}>
          Change to Wait
        </button>
      )}
      <br />
      <Link to="/services">Back to Services</Link>

      <h2>Health Check Logs</h2>
      <div
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "10px",
        }}
      >
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              {new Date(log.check_time).toLocaleString()} -{" "}
              {log.status ? log.status.toUpperCase() : "UNKNOWN"} (Response
              time: {log.response_time}ms, Status code: {log.status_code})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceDetail;
