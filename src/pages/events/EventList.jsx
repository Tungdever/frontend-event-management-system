import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CardMedia, Grid, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { display } from "@mui/system";


const EventList = ({ setSelectedEvent }) => {
    console.log(setSelectedEvent);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [imageUrls, setImageUrls] = useState({});
    const token = localStorage.getItem("token");
    const defaultImage = 'https://static.vecteezy.com/system/resources/previews/006/692/205/non_2x/loading-icon-template-black-color-editable-loading-icon-symbol-flat-illustration-for-graphic-and-web-design-free-vector.jpg';
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = events.filter((event) =>
            event.eventName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredEvents(filtered);
    };
    useEffect(() => {
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            // Lấy thông tin roles từ payload
            const roles = payload.roles || [];
            const userId = payload.userId || null;

            console.log(userId);
            if (roles.some(role => ["ROLE_MANAGER", "ROLE_ADMIN"].includes(role))) {
                axios
                    .get("http://localhost:8080/man/event", {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    })
                    .then((response) => {
                        if (response.data.statusCode === 0) {
                            setEvents(response.data.data);
                            setFilteredEvents(response.data.data);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching data", error);
                    });
            }
            else {
                axios
                    .get(`http://localhost:8080/emp/event/${userId}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
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
            }
        }



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
    const handleClickCreate = (event) => {
        navigate("/event/create");
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" >
                <TextField
                    placeholder="Search event"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{
                        width: "300px",
                        "& .MuiInputBase-root": {
                            height: "45px", // Điều chỉnh chiều cao input
                        },
                        "& .MuiInputLabel-root": {
                            lineHeight: "45px", // Căn chỉnh nhãn
                        },
                        marginLeft: 1                       
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px", // Khoảng cách giữa các phần tử
                    }}
                >
                    <FormControl fullWidth style={{ minWidth: "150px" }}>
                        <Select defaultValue={"All"} style={{ height: "45px", lineHeight: "45px" }}>
                            <MenuItem value="All">All event</MenuItem>
                            <MenuItem value="Live">Live</MenuItem>
                            <MenuItem value="Draft">Draft</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        onClick={handleClickCreate}
                        sx={{
                            backgroundColor: "#1c7de8",
                            color: "white",
                            "&:hover": { backgroundColor: "#1565c0" },
                            minWidth: 150,
                            minHeight: 45
                        }}
                    >
                        Create event
                    </Button>
                </div>

            </Box>
            <Grid container spacing={4} sx={{ marginTop: '0px' }}>
                {filteredEvents.map((event) => (
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
        </Box>
    );
};


export default EventList;
