import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const result = await axios.get(`/api/services/${id}`);
        setService(result.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching service data.");
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

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
      <p>Server Info: {service.server_info}</p>
      <p>Description: {service.description}</p>
      <p>Work Directory: {service.work_directory}</p>
      <p>Execute Command: {service.execute_command}</p>
      <button onClick={() => navigate(`/services/${id}/edit`)}>Edit</button>
      <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
        Delete
      </button>
      <br />
      <Link to="/services">Back to Services</Link>
    </div>
  );
};

export default ServiceDetail;
