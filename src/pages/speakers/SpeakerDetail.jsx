import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, TextField, Button, Card, CardContent, CardActions, Grid, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/man/speaker/", // Base URL của API
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`, // Token authorization
  },
});

const SpeakerDetail = () => {
  const { speakerId } = useParams(); // Lấy speakerId từ URL
  const [speaker, setSpeaker] = useState(null);
  const [error, setError] = useState(null);
  const theme = useTheme(); // Lấy theme từ Material-UI

  useEffect(() => {
    const fetchSpeakerDetail = async () => {
      try {
        const response = await axiosInstance.get(`/${speakerId}`);
        setSpeaker(response.data.data);
      } catch (err) {
        console.error("Error fetching speaker details:", err);
        setError("Unable to fetch speaker details. Please try again later.");
      }
    };

    if (speakerId) {
      fetchSpeakerDetail();
    }
  }, [speakerId]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!speaker) return <Typography>Loading...</Typography>;

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
        {speaker.name}
      </Typography>

      {/* Ảnh diễn giả */}
      <Avatar
        alt={speaker.name}
        src={`http://localhost:8080/images/${speaker.imageSpeaker}`}
        style={{ width: 100, height: 100, marginBottom: "20px" }}
      />

      {/* Thông tin diễn giả */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
            Email
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={speaker.email}
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
            value={speaker.phone}
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
            value={speaker.address}
            InputProps={{ style: { fontSize: "15px" } }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
            Title
          </Typography>
          <TextField
            fullWidth
            disabled
            variant="outlined"
            value={speaker.title}
            InputProps={{ style: { fontSize: "15px" } }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
            Description
          </Typography>
          <TextField
            fullWidth
            disabled
            multiline
            rows={4}
            variant="outlined"
            value={speaker.description}
            InputProps={{ style: { fontSize: "15px" } }}
          />
        </div>
      </div>

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
        Edit Speaker
      </Button>
    </div>
  );
};

export default SpeakerDetail;
