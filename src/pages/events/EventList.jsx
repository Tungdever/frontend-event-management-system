import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CardMedia, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EventList = ({ setSelectedEvent }) => {
    console.log(setSelectedEvent);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [imageUrls, setImageUrls] = useState({});
    const defaultImage = 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Hinh-dai-dien-hai-huoc-meme-deo-kinh.jpg?1704789860473';
    useEffect(() => {
        axios
            .get("http://localhost:8080/man/event", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
                },
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
    useEffect(() => {
        const fetchImages = async () => {
            const urls = {};
            for (const event of events) {
                if (event.eventImg) {
                    try {
                        const response = await axios.get(`http://localhost:8080/file/${event.eventImg}`, {
                            headers: {
                                Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
                            },
                            responseType: 'blob',
                        });
                        urls[event.eventId] = URL.createObjectURL(response.data);
                    } catch {
                        urls[event.eventId] = defaultImage;
                    }
                } else {
                    urls[event.eventId] = defaultImage;
                }
            }
            setImageUrls(urls);
        };

        if (events.length > 0) fetchImages();
    }, [events]);

    const handleEventClick = (event) => {
        console.log(`Navigating to: /events/${event.eventId}`);
        setSelectedEvent(event);
        navigate(`/events/${event.eventId}`);
    };

    return (
        <Grid container spacing={4}>
            {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.eventId}>
                    <Card onClick={() => handleEventClick(event)}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={imageUrls[event.eventId] || defaultImage}
                            alt={`${event.eventName}'s avatar`}
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
