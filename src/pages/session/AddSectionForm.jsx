import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    FormControl,
    Grid,
    Typography,
    FormGroup,
    FormControlLabel,
    Radio,
    Select,
    MenuItem
} from "@mui/material";
import axios from "axios";
import SpeakerAdd from './AddSpeakerForm';
import { useParams } from "react-router-dom";
const AddSectionForm = ({ onAdd }) => {
    const { eventId } = useParams();
    const [open, setOpen] = useState(false); // Popup chính
    const [speakers, setSpeakers] = useState([]); // Danh sách speaker
    const [formData, setFormData] = useState({
        startTime: "09:00",
        startPeriod: "AM",
        endTime: "10:00",
        endPeriod: "AM",
        sectionTitle: "",
        sectionDescription: "", // Đổi tên từ description
        eventId: eventId, // Gán eventId mặc định
        speakerId: null, // Mảng speaker ID đã chọn
    });


    // Mở/đóng popup chính
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Cập nhật giá trị form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value, speakerId: e.target.value }));
    };

    // Cập nhật danh sách speaker đã chọn
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            speakerId: checked
                ? [...prevState.speakerId, value]
                : prevState.speakerId.filter((id) => id !== value),
        }));
    };


    // Gửi form lên server
    const handleSubmit = async () => {
        try {
            // Chuyển đổi thời gian
           
            if (!formData.sectionTitle || !formData.speakerId) {
                alert("Vui lòng điền đầy đủ thông tin.");
                return;
            }
            // Chuyển đổi startTime và endTime thành giá trị giờ để dễ dàng so sánh
            const convertTo24HourFormat = (time, period) => {
                let [hour, minute] = time.split(":").map(Number);
                if (period === "PM" && hour !== 12) hour += 12; // Chuyển PM
                if (period === "AM" && hour === 12) hour = 0; // Chuyển 12 AM thành 0 giờ
                return hour * 60 + minute; // Trả về tổng phút để so sánh dễ dàng
            };

            const startTimeInMinutes = convertTo24HourFormat(formData.startTime, formData.startPeriod);
            const endTimeInMinutes = convertTo24HourFormat(formData.endTime, formData.endPeriod);

            if (endTimeInMinutes <= startTimeInMinutes) {
                alert("Thời gian kết thúc phải muộn hơn thời gian bắt đầu.");
                return;
            }   
            // Tạo payload
            const formattedStartTime = `${formData.startTime} ${formData.startPeriod}`;
            const formattedEndTime = `${formData.endTime} ${formData.endPeriod}`;
            const payload = {
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                sectionTitle: formData.sectionTitle,
                sectionDescription: formData.sectionDescription,
                eventId: formData.eventId,
                speakerId: formData.speakerId, // Chuyển danh sách ID thành chuỗi
            };

            const response = await axios.post("http://localhost:8080/man/section", payload, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            alert("Section added successfully!");
            onAdd(response.data.data);
            setFormData({
                startTime: "09:00",
                startPeriod: "AM",
                endTime: "10:00",
                endPeriod: "AM",
                sectionTitle: "",
                sectionDescription: "",
                eventId: eventId, // Giữ lại eventId
                speakerId: null, // Reset speakerId về null
            });
            handleClose();
        } catch (error) {
            console.error("Error adding section:", error);
            alert("Failed to add section. Please try again later.");
        }
    };

    const fetchSpeakers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/man/speaker", {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            const speakersData = Array.isArray(response.data.data) ? response.data.data : [];
            setSpeakers(speakersData); // Gán đúng mảng speakers
        } catch (error) {
            console.error("Lỗi khi tải danh sách speakers:", error);
        }
    };
    const generateTimeSlots = () => {
        const times = [];
        for (let hour = 0; hour <= 12; hour++) {
            for (let minute = 0; minute < 60; minute += 5) {
                const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                times.push(time);
            }
        }
        return times;
    };

    const timeSlots = generateTimeSlots();
    useEffect(() => {
        if (open) {
            fetchSpeakers(); // Gọi API để tải danh sách speakers khi popup được mở
        }
    }, [open]);
    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            {/* Nút mở popup chính */}
            <Button
                variant="contained"
                onClick={handleClickOpen}
                sx={{
                    backgroundColor: "#1c7de8",
                    color: "white",
                    "&:hover": { backgroundColor: "#1565c0" },
                }}
            >
                Add Section
            </Button>

            {/* Popup chính */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ color: "#4c4c4c", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>Section Details</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        {/* Start Time */}
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <Typography variant="h6" sx={{ color: "#9b9b9b" }}>
                                    Start Time
                                    <span style={{ color: "red", marginLeft: 1 }}>*</span>
                                </Typography>
                                <Select name="startTime" value={formData.startTime} onChange={handleChange} sx={{ marginTop: 1 }}>
                                    {timeSlots.map((time) => (
                                        <MenuItem key={time} value={time}>
                                            {time}
                                        </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <Typography variant="h6" sx={{ color: "#9b9b9b", visibility: "hidden" }}>Start period</Typography>
                                <Select name="startPeriod" value={formData.startPeriod} onChange={handleChange} sx={{ marginTop: 1 }}>
                                    <MenuItem value="AM">AM</MenuItem>
                                    <MenuItem value="PM">PM</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* End Time */}
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <Typography variant="h6" sx={{ color: "#9b9b9b" }}>
                                    End Time
                                    <span style={{ color: "red", marginLeft: 1 }}>*</span>
                                </Typography>
                                <Select name="endTime" value={formData.endTime} onChange={handleChange} sx={{ marginTop: 1 }}>
                                    {timeSlots.map((time) => (
                                        <MenuItem key={time} value={time}>
                                            {time}
                                        </MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <Typography variant="h6" sx={{ color: "#9b9b9b", visibility: "hidden" }}>End period</Typography>
                                <Select name="endPeriod" value={formData.startPeriod} onChange={handleChange} sx={{ marginTop: 1 }}>
                                    <MenuItem value="AM">AM</MenuItem>
                                    <MenuItem value="PM">PM</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Section Title */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ color: "#9b9b9b" }}>
                                Section Title
                                <span style={{ color: "red", marginLeft: 1 }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                name="sectionTitle"
                                value={formData.sectionTitle}
                                onChange={handleChange}
                                sx={{ marginTop: 1 }}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ color: "#9b9b9b" }}>Description</Typography>
                            <TextField
                                fullWidth
                                name="sectionDescription"
                                value={formData.sectionDescription}
                                onChange={handleChange}
                                sx={{ marginTop: 1 }}
                            />
                        </Grid>

                        {/* Speaker Section */}
                        <Grid item xs={12}>
                            <FormControl component="fieldset" sx={{ marginTop: 2, border: 1, borderColor: "#d1d1d1", borderRadius: 2, minHeight: 100, minWidth: 535 }}>
                                <Typography variant="h6" sx={{ color: "#9b9b9b", margin: 2 }}>Speaker/Presenter(s)</Typography>
                                <FormGroup
                                    sx={{
                                        border: 1,
                                        borderColor: "#d1d1d1",
                                        marginTop: 0,
                                        marginLeft: 2,
                                        marginBottom: 0,
                                        marginRight: 2,
                                        bgcolor: "#f9f9f9",
                                        minHeight: 140,
                                        maxHeight: 140,
                                        minWidth: 500,
                                        overflow: "auto",
                                        flexWrap: "nowrap",
                                    }}
                                >
                                    {speakers.map((speaker) => (
                                        <FormControlLabel
                                            sx={{
                                                marginTop: 1,
                                                marginLeft: 1,
                                                maxHeight: 25
                                            }}
                                            key={speaker.id}
                                            control={
                                                <Radio
                                                    checked={formData.speakerId === String(speaker.id)}
                                                    onChange={handleChange}
                                                    value={speaker.id.toString()}
                                                    sx={{
                                                        "&.Mui-checked": {
                                                            color: "#0093dd",
                                                        },
                                                    }}
                                                />
                                            }
                                            label={speaker.name}

                                        />
                                    ))}
                                </FormGroup>
                                <SpeakerAdd onAdd={fetchSpeakers} />
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            backgroundColor: "#1c7de8",
                            "&:hover": { backgroundColor: "#1565c0" },
                        }}>
                        Save Section
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddSectionForm;
