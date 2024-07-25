import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const ServiceForm = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [serverStatus, setServerStatus] = useState("wait");
  const [serverInfo, setServerInfo] = useState("");
  const [description, setDescription] = useState("");
  const [workDirectory, setWorkDirectory] = useState("");
  const [executeCommand, setExecuteCommand] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const service = {
      name,
      url,
      server_status: serverStatus,
      server_info: serverInfo,
      description,
      work_directory: workDirectory,
      execute_command: executeCommand,
      tags: tags, // tags를 문자열로 전송
    };
    try {
      await axios.post("/api/services", service);
      navigate("/services");
    } catch (error) {
      console.error("There was an error registering the service:", error);
    }
  };

  return (
    <div>
      <h1>Register Service</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Server Status:</label>
          <select
            value={serverStatus}
            onChange={(e) => setServerStatus(e.target.value)}
            required
          >
            <option value="up">Up</option>
            <option value="down">Down</option>
            <option value="wait">Wait</option>
          </select>
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
        <div>
          <label>Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <br />
      <Link to="/services">Back to Service List</Link>
    </div>
  );
};

export default ServiceForm;
