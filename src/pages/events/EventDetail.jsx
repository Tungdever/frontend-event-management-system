import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EventDetail = () => {
  const { eventId } = useParams(); // Lấy eventId từ URL
  const [event, setEvent] = useState(null);

  useEffect(() => {
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
    <div>
      <h1>{event.eventName}</h1>
      <p>{event.eventDescription}</p>
      <p>{event.eventLocation}</p>
      <p>{event.eventDetail}</p>
    </div>
  );
};

export default EventDetail;
