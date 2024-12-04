import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Switch,
    Grid,
} from "@mui/material";
import Datetime from 'react-datetime';
const CreateEventForm = () => {

    const [formData, setFormData] = useState({
        eventName: "",
        eventType: "",
        eventHost: "",
        eventStatus: "",
        eventDescription: "",
        eventImg: "",
        eventLocation: "",
        eventStart: "",
        eventEnd: "",
        eventDetail: "",
    });
    useEffect(() => {
        // Lấy ngày giờ hiện tại và chuyển thành định dạng 'yyyy-MM-ddThh:mm'
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 16); // Lấy đến phần ngày và giờ
        setFormData({
            ...formData,
            eventStart: formattedDate,
        });
    }, []);
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
       
    };


    useEffect(() => {
        console.log(formData); 
    }, [formData]);

    return (
        <Box
            sx={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography variant="h4" sx={{ marginBottom: "20px" }}>
                Create an Event
            </Typography>

            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                Event title and description
            </Typography>

            <Typography variant="h6" sx={{ color: "#9b9b9b", marginLeft: 1, marginBottom: 1 }}>
                Event name
                <span style={{ color: "red", marginLeft: 1 }}>*</span>
            </Typography>
            <TextField
                fullWidth
                placeholder="Title of event (example: Tech conference 2024)"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                sx={{ marginBottom: "20px" }}
            />
            <Typography variant="h6" sx={{ color: "#9b9b9b", marginLeft: 1, marginBottom: 1 }}>
                Event type
                <span style={{ color: "red", marginLeft: 1 }}>*</span>
            </Typography>
            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
                <Select defaultValue={"default"} onChange={handleChange}>
                    <MenuItem value="default">Select</MenuItem>
                    <MenuItem value="conference">Conference</MenuItem>
                    <MenuItem value="workshop">Workshop</MenuItem>
                    <MenuItem value="webinar">Webinar</MenuItem>
                    <MenuItem value="corporate">Corporate or Business Meeting</MenuItem>
                    <MenuItem value="convention">Convention</MenuItem>
                    <MenuItem value="party">Party or Social Gathering</MenuItem>
                    <MenuItem value="concert">Concert or Performance</MenuItem>
                    <MenuItem value="screening">Screening</MenuItem>
                    <MenuItem value="liveMusic">Live Music</MenuItem>
                    <MenuItem value="presentation">Presentation</MenuItem>
                    <MenuItem value="tradeshow">Tradeshow</MenuItem>
                    <MenuItem value="seminar">Seminar or Talk</MenuItem>
                    <MenuItem value="expo">Tradeshow or Expo</MenuItem>
                    <MenuItem value="fair">Fair or Festival</MenuItem>
                    <MenuItem value="ceremony">Ceremony</MenuItem>
                </Select>
            </FormControl>

            <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
                <Grid item xs={3}>
                    <Typography variant="h6" sx={{ color: "#9b9b9b" }}>
                        Event start
                        <span style={{ color: "red", marginLeft: 1 }}>*</span>
                    </Typography>
                    <TextField
                        type="datetime-local"
                        name="eventStart"
                        value={formData.eventStart}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="h6" sx={{ color: "#9b9b9b" }}>
                        Event end
                        <span style={{ color: "red", marginLeft: 1 }}>*</span>
                    </Typography>
                    <TextField
                        type="datetime-local"
                        name="eventEnd"
                        value={formData.eventEnd}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{ shrink: true }}
                    />

                </Grid>
            </Grid>
            <Typography variant="h6" sx={{ color: "#9b9b9b", marginLeft: 1, marginBottom: 1 }}>
                Location
                <span style={{ color: "red", marginLeft: 1 }}>*</span>
            </Typography>
            <TextField
                fullWidth
                placeholder="Enter location"
                name = "eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
                sx={{ marginBottom: "20px" }}
            />
            <Typography variant="h6" sx={{ color: "#9b9b9b", marginLeft: 1, marginBottom: 1 }}>
                Event host
                <span style={{ color: "red", marginLeft: 1 }}>*</span>
            </Typography>
            <TextField
                fullWidth
                placeholder="Enter host name"
                name="eventHost"
                value={formData.eventHost}
                onChange={handleChange}
                sx={{ marginBottom: "20px" }}
            />
            <Typography variant="h6" sx={{ color: "#9b9b9b", marginLeft: 1, marginBottom: 1 }}>
                Event description
                <span style={{ color: "red", marginLeft: 1 }}>*</span>
            </Typography>
            <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Enter details about your event - agenda, speakers, sponsor info, etc."
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleChange}
                sx={{ marginBottom: "20px" }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={handleDraftClick}>Save & Finish Later</Button>
                <Button variant="contained" onClick={handlePublicClick} color="primary" sx={{
                    backgroundColor: "#1c7de8",
                    color: "white",
                    "&:hover": { backgroundColor: "#1565c0" },
                }}>
                    Save & Continue
                </Button>
            </Box>
        </Box>
    );
};

export default CreateEventForm;
