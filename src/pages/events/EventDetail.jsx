import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import EventNoteIcon from "@mui/icons-material/EventNote";

const EventDetail = () => {
  const { eventId } = useParams(); // Lấy eventId từ URL
  const [event, setEvent] = useState(null);
  const [eventImage, setEventImage] = useState(null); // Trạng thái URL ảnh

  useEffect(() => {
    // Lấy thông tin sự kiện
    axios
      .get(`http://localhost:8080/man/event/${eventId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`, // Token authorization
        },
      })
      .then((response) => {
        if (response.data.statusCode === 0) {
          setEvent(response.data.data);

          // Lấy ảnh từ API
          const imageUrl = `http://localhost:8080/file/${response.data.data.eventImg}`;
          axios
            .get(imageUrl, {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
              },
              responseType: "blob", // Lấy dữ liệu ảnh dưới dạng blob
            })
            .then((imageResponse) => {
              const blobUrl = URL.createObjectURL(imageResponse.data);
              setEventImage(blobUrl); // Lưu URL tạm thời của ảnh
            })
            .catch((imageError) => {
              console.error("Error fetching event image", imageError);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching event details", error);
      });
  }, [eventId]); // Khi eventId thay đổi, useEffect sẽ được gọi lại

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ maxWidth: "100%", margin: "0 auto", padding: 3 }}>
      {/* Event Image */}
      {eventImage && (
        <Box
          component="img"
          src={eventImage} // URL tạm thời của ảnh
          alt={event.eventName}
          sx={{
            width: "100%", // Fullwidth
            maxHeight: "200px", // Giới hạn chiều cao
            objectFit: "cover", // Giữ chất lượng và cắt ảnh theo khung
            borderRadius: 2,
            boxShadow: 3,
            marginBottom: 3,
          }}
        />
      )}

      {/* Event Name */}
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {event.eventName}
      </Typography>

      {/* Event Location */}
      <Grid container alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <LocationOnIcon sx={{ color: "primary.main", marginRight: 1 }} />
        </Grid>
        <Grid item>
          <Typography variant="h6">Location: {event.eventLocation}</Typography>
        </Grid>
      </Grid>

      {/* Event Date */}
      <Grid container alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <EventNoteIcon sx={{ color: "primary.main", marginRight: 1 }} />
        </Grid>
        <Grid item>
          <Typography variant="h6">
            Date: {event.eventDate ? event.eventDate : "TBD"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ marginBottom: 3 }} />

      {/* Event Description */}
      <Grid container alignItems="flex-start" sx={{ marginBottom: 2 }}>
        <Grid item>
          <DescriptionIcon sx={{ color: "primary.main", marginRight: 1 }} />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Description:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {event.eventDescription}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ marginBottom: 3 }} />

      {/* Event Detail */}
      <Grid container alignItems="flex-start">
        <Grid item>
          <InfoIcon sx={{ color: "primary.main", marginRight: 1 }} />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Event Detail:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {event.eventDetail}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventDetail;
