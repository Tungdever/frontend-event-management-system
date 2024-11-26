import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CardMedia, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EventList = ({ setSelectedEvent }) => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy dữ liệu sự kiện
    axios
      .get("http://localhost:8080/man/event",{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
        }
      })
      .then((response) => {
        if (response.data.statusCode === 0) {
          setEvents(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);
  const handleEventClick = (event) => {
    setSelectedEvent(event); // Cập nhật selectedEvent khi nhấn vào một event
    navigate(`/event/${event.eventId}`); // Chuyển hướng đến trang chi tiết event
  };
  return (
    <Grid container spacing={4}>
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} key={event.eventId}>
          <Card onClick={() => handleEventClick(event)}>
            <CardMedia
              component="img"
              height="200"
              image={`http://localhost:8080/images/${event.eventImg}`}
              alt={event.eventName}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {event.eventName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.eventDescription}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={2}>
                <strong>Location:</strong> {event.eventLocation}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Details:</strong> {event.eventDetail}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EventList;
