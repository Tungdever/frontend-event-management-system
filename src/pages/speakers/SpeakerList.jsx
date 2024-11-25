import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Grid,
} from '@mui/material';
import { Link } from "react-router-dom";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const SpeakerList = () => {
    const [speakers, setSpeakers] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSpeakerId, setSelectedSpeaker] = useState(null);
    const [imageUrls, setImageUrls] = useState({});  // State to store image URLs

    const open = Boolean(anchorEl);

    // Fetch data from API
    useEffect(() => {
        fetch('http://localhost:8080/man/speaker', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
            },
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('API Response:', result);
                if (Array.isArray(result.data)) {
                    setSpeakers(result.data);
                } else {
                    console.error('Unexpected API response format:', result);
                    setSpeakers([]);
                }
            })
            .catch((error) => console.error('Error fetching speakers:', error));
    }, []);

    // Handle dots menu
    const handleMenuOpen = (event, speakerId) => {
        setAnchorEl(event.currentTarget);
        setSelectedSpeaker(speakerId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedSpeaker(null);
    };

    const handleEdit = () => {
        console.log('Edit speaker:', selectedSpeakerId);
        handleMenuClose();
    };

    const handleDelete = () => {
        console.log('Delete speaker:', selectedSpeakerId);
        handleMenuClose();
    };

    // Fetch image with authentication headers
    const fetchImage = async (image) => {
        try {
            const response = await fetch(`http://localhost:8080/file/${image}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
                },
            });
            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setImageUrls((prevState) => ({ ...prevState, [image]: imageUrl }));
            } else {
                console.error('Failed to fetch image');
            }
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    useEffect(() => {
        speakers.forEach((speaker) => {
            fetchImage(speaker.image);
            console.log(speaker.image) // Fetch image for each speaker
        });
    }, [speakers]);

    return (
        <Box sx={{ padding: 2 }}>
            <Box display="flex" justifyContent="end" mt="20px" marginBottom="20px" marginRight="10px">
                <Link to={`/speakers/add`} style={{ textDecoration: 'none' }}>
                    <Button type="submit" color="secondary" variant="contained">
                        Add Speaker
                    </Button>
                </Link>
            </Box>
            <Grid container spacing={2}>
                {speakers.map((speaker) => (
                    <Grid item xs={12} sm={6} md={4} key={speaker.id}>
                        <Card sx={{ position: 'relative' }}>
                            {/* Dots Menu */}
                            <div style={{ position: 'relative' }}>
                                <IconButton
                                    style={{ position: 'absolute', top: 8, right: 8 }}
                                    onClick={(event) => handleMenuOpen(event, speaker.id)}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                </Menu>
                            </div>

                            {/* Speaker Information */}
                            <CardContent>
                                {/* Show image if available */}
                                <Avatar
                                    src={imageUrls[speaker.image] || ''}
                                    alt={speaker.name}
                                    sx={{ width: 56, height: 56, marginBottom: 2 }}
                                />
                                <Typography variant="h4" gutterBottom>
                                    {speaker.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    {speaker.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ marginTop: 1 }}>
                                    {speaker.description}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ marginTop: 1, display: 'flex', alignItems: 'center' }}
                                >
                                    <EmailOutlinedIcon fontSize="small" sx={{ marginRight: 0.5 }} /> {speaker.email}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <PhoneOutlinedIcon fontSize="small" sx={{ marginRight: 0.5 }} /> {speaker.phone}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <LocationOnOutlinedIcon fontSize="small" sx={{ marginRight: 0.5 }} />{' '}
                                    {speaker.address}
                                </Typography>
                            </CardContent>

                            {/* Preview Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                                <Link to={`/speakers/${speaker.id}/detail`} style={{ textDecoration: 'none' }}>
                                    <Button variant="outlined" size="small">
                                        Preview
                                    </Button>
                                </Link>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SpeakerList;
