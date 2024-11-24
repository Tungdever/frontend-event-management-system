import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
    CircularProgress,
} from "@mui/material";

// Tạo instance Axios
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/man/sponsor/", // Base URL của Spring Boot
    headers: {
        
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`, // Thêm JWT token từ localStorage
    },
});

const SponsorDetail = () => {
    const { sponsorId } = useParams(); // Lấy sponsorId từ URL
    const [sponsor, setSponsor] = useState(null);
    const [error, setError] = useState(null);
    const theme = useTheme(); // Lấy theme từ Material-UI

    useEffect(() => {
        const fetchSponsorDetail = async () => {
            try {
                console.log(sponsorId);
                const response = await axiosInstance.get(`/${sponsorId}`);
                console.log(response.data);
                setSponsor(response.data.data);
            } catch (err) {
                console.error("Error fetching sponsor detail:", err);
                setError("Unable to fetch sponsor details. Please try again later.");
            }
        };

        if (sponsorId) {
            fetchSponsorDetail();
        }
    }, [sponsorId]);

    // Kiểm tra điều kiện nếu dữ liệu chưa có hoặc có lỗi
    if (error) return <Typography color="error">{error}</Typography>;
    if (!sponsor) return <CircularProgress />; // Loading indicator khi chưa có dữ liệu

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
                {sponsor.name}
            </Typography>

            {/* Thông tin nhà tài trợ */}
            <div style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "15px" }}>
                    <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
                        Contact
                    </Typography>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={sponsor.contact}
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
                        value={sponsor.email}
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
                        value={sponsor.phone}
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
                        value={sponsor.address}
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
                        value={sponsor.website}
                        InputProps={{ style: { fontSize: "15px" } }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <Typography variant="h6" style={{ fontWeight: "600", marginBottom: "5px", fontSize: "15px" }}>
                        Sponsorship Level
                    </Typography>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={sponsor.sponsorshipLevel}
                        InputProps={{ style: { fontSize: "15px" } }}
                    />
                </div>
            </div>

            {/* Danh sách sự kiện tài trợ */}
            <Typography
                variant="h5"
                style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    marginBottom: "10px",
                    fontSize: "24px",
                }}
            >
                Sponsored Events
            </Typography>
            <CardActions>
                <Link to={`/sponsor/${sponsor.id}/event`} style={{ textDecoration: "none" }}>
                    <Button
                        size="large"
                        color="primary"
                        variant="contained"
                        style={{ fontWeight: "bold" }}
                    >
                        Add Event
                    </Button>
                </Link>
            </CardActions>

            {/* Kiểm tra và hiển thị danh sách sự kiện */}
            {(sponsor.listSponsorEvents && sponsor.listSponsorEvents.length > 0) ? (
                <Grid container spacing={3}>
                    {sponsor.listSponsorEvents.map((event, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                style={{
                                    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                                    padding: "20px",
                                    borderRadius: "10px",
                                }}
                            >
                                <CardContent>
                                    {/* Tên sự kiện */}
                                    <Typography
                                        variant="h5"
                                        style={{ fontWeight: "600", marginBottom: "15px", fontSize: "1.25rem" }}
                                    >
                                        {event.eventName}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Link to={`/sponsor/event/${event.id}`} style={{ textDecoration: "none" }}>
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
                <Typography>No events available. Không tồn tại.</Typography>
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
                Edit Sponsor
            </Button>
        </div>
    );
};

export default SponsorDetail;
