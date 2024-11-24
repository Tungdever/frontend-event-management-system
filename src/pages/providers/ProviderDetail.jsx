import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";



// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/man/provider/", // Base URL của Spring Boot
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`, // Thêm JWT token từ localStorage
  },
});

const ProviderDetail = () => {
  const { providerId } = useParams(); // Lấy providerId từ URL
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const theme = useTheme(); // Lấy theme từ Material-UI

  useEffect(() => {
    const fetchProviderDetail = async () => {
      try {
        console.log("Fetching providerId from URL:", providerId);

        const response = await axiosInstance.get(`/${providerId}`)
        console.log(response.data);
        setProvider(response.data);
      } catch (err) {
        console.error("Error fetching provider detail:", err);
        setError("Unable to fetch provider details. Please try again later.");
      }
    };

    if (providerId) {
      fetchProviderDetail();
    }
  }, [providerId]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!provider) return <Typography>Loading...</Typography>;

  return (
    <div style={{ maxWidth: "96%", marginLeft: "15px", padding: "20px" }}>
      {/* Tiêu đề chính */}
      <Typography
        variant="h4"
        style={{
          fontWeight: "bold",
          color: "#333",
          textAlign: "left",
          marginBottom: "20px",
          fontSize: "32px",
        }}
      >
        {provider.name}
      </Typography>

      {/* Thông tin nhà cung cấp */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
            Contact
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={provider.contact}
            InputProps={{ style: { fontSize: "15px" } }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
            Email
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={provider.email}
            InputProps={{ style: { fontSize: "15px" } }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
            Phone
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={provider.phone}
            InputProps={{ style: { fontSize: "15px" } }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
            Address
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={provider.address}
            InputProps={{ style: { fontSize: "15px" } }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
            Website
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={provider.website}
            InputProps={{ style: { fontSize: "15px" } }}
          />
        </div>
      </div>

      {/* Danh sách dịch vụ */}
      <Typography
        variant="h5"
        style={{
          fontWeight: "bold",
          textAlign: "left",
          marginBottom: "10px",
          fontSize: "24px",
        }}
      >
        Provider Services
      </Typography>
      <CardActions>
        <Link to={`/provider/${provider.id}/service`} style={{ textDecoration: 'none' }}>
          <Button
            size="large"
            color="primary"
            variant="contained"
            style={{ fontWeight: "bold" }}
          >
            Add service
          </Button>
        </Link>
      </CardActions>


      {provider.listProviderServices && provider.listProviderServices.length > 0 ? (
        <Grid container spacing={3}>
          {provider.listProviderServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                style={{
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <CardContent>
                  {/* Tên dịch vụ */}
                  <Typography
                    variant="h5"
                    style={{ fontWeight: "600", marginBottom: "15px", fontSize: "1.25rem" }}
                  >
                    {service.serviceName}
                  </Typography>

                  {/* Loại dịch vụ */}
                  <Typography
                    variant="body1"
                    style={{ color: "#666", marginBottom: "10px", fontSize: "1rem" }}
                  >
                    <strong>Type:</strong> {service.serviceType}
                  </Typography>

                  {/* Giá */}
                  <Typography
                    variant="body1"
                    style={{ color: "#666", marginBottom: "10px", fontSize: "1rem" }}
                  >
                    <strong>Price:</strong> {service.price}
                  </Typography>

                  {/* Thời gian */}
                  <Typography
                    variant="body1"
                    style={{ color: "#666", marginBottom: "10px", fontSize: "1rem" }}
                  >
                    <strong>Duration:</strong> {service.duration}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link to={`/provider/service/${service.id}`} style={{ textDecoration: 'none' }}>
                    <Button
                      size="large"
                      color="primary"
                      variant="contained"
                      style={{ fontWeight: "bold" }}
                    >
                      Learn More
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No services available.</Typography>
      )}

      {/* Nút chỉnh sửa */}
      <Button
        variant="contained"
        color="primary"
        style={{
          backgroundColor: "#1976d2",
          color: "#fff",
          fontSize: "16px",
          padding: "15px 20px",
          display: "block",
          margin: "40px 0 0 auto",
        }}
      >
        Edit Provider
      </Button>
    </div>
  );
};

export default ProviderDetail;
