import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CardMedia, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';


const EventList = ({ setSelectedEvent }) => {
    console.log(setSelectedEvent);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [imageUrls, setImageUrls] = useState({});
    const defaultImage = 'https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg';
    useEffect(() => {
        axios
            .get("http://localhost:8080/man/event", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
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
                                Authorization: localStorage.getItem("token"),
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
        //console.log(`Navigating to: /events/${event.eventId}`);
        setSelectedEvent(event);
        navigate(`/events/${event.eventId}`);
    };

    return (
        <Grid container spacing={4}sx={{ marginTop: '0px'}}>
            {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.eventId}>
                    <Card
                        onClick={() => handleEventClick(event)}
                        sx={{
                            width: '350px',  // Chiều rộng cố định
                            height: '330px', // Chiều cao cố định
                            margin: 'auto',  // Căn giữa card trong grid
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Đổ bóng
                            transition: 'transform 0.3s',
                            '&:hover': {
                                transform: 'scale(1.05)', // Hiệu ứng phóng to khi hover
                            },
                        }}
                    >
                        {/* Event Image */}
                        <CardMedia
                            component="img"
                            height="180"
                            image={imageUrls[event.eventId] || defaultImage}
                            alt={`${event.eventName}'s avatar`}
                        />

                        {/* Nội dung */}
                        <CardContent>
                            {/* Event Name */}
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    marginBottom: '8px',
                                }}
                            >
                                {event.eventName}
                            </Typography>

                            {/* Event Description */}
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontSize: '12px',
                                    fontStyle: 'italic',
                                    marginBottom: '12px',
                                }}
                            >
                                {event.eventDescription}
                            </Typography>

                            {/* Event Location */}
                            <Box display="flex" alignItems="center" mb={1}>
                                <PlaceOutlined sx={{ fontSize: 18, marginRight: 1 }} />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: '13px' }}
                                >
                                    <strong>Location:</strong> {event.eventLocation}
                                </Typography>
                            </Box>

                            {/* Event Details */}
                            <Box display="flex" alignItems="center">
                                <InfoOutlined sx={{ fontSize: 18, marginRight: 1 }} />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: '13px' }}
                                >
                                    <strong>Details:</strong> {event.eventDetail}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>

    );
};


export default EventList;
