import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const ServiceEditForm = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [serverInfo, setServerInfo] = useState("");
  const [description, setDescription] = useState("");
  const [workDirectory, setWorkDirectory] = useState("");
  const [executeCommand, setExecuteCommand] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const result = await axios.get(`/api/services/${id}`);
        const service = result.data;
        setName(service.name);
        setUrl(service.url);
        setServerInfo(service.server_info);
        setDescription(service.description);
        setWorkDirectory(service.work_directory);
        setExecuteCommand(service.execute_command);
        setLoading(false);
      } catch (error) {
        setError("Error fetching service data.");
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedService = {
      name,
      url,
      server_info: serverInfo,
      description,
      work_directory: workDirectory,
      execute_command: executeCommand,
    };
    try {
      await axios.put(`/api/services/${id}`, updatedService);
      navigate("/services");
    } catch (error) {
      setError("Error updating service.");
      console.error("There was an error updating the service:", error);
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
      <h1>Edit Service</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div>
          <label>Server Info:</label>
          <input
            type="text"
            value={serverInfo}
            onChange={(e) => setServerInfo(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Work Directory:</label>
          <input
            type="text"
            value={workDirectory}
            onChange={(e) => setWorkDirectory(e.target.value)}
          />
        </div>
        <div>
          <label>Execute Command:</label>
          <input
            type="text"
            value={executeCommand}
            onChange={(e) => setExecuteCommand(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <br />
      <Link to="/services">Back to Service List</Link>
    </div>
  );
};

export default ServiceEditForm;
