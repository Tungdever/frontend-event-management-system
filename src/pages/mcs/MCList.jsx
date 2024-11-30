import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Box, Button } from '@mui/material';
import axios from 'axios';
import { Link } from "react-router-dom";
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import BadgeOutlined from '@mui/icons-material/BadgeOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';



const McList = () => {
    const [mcList, setMcList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState({}); // URL ảnh tải về
    const defaultImage = 'path/to/default/image.jpg'; // Ảnh mặc định
    
    useEffect(() => {
        const fetchMcList = async () => {
            try {
                const response = await axios.get('http://localhost:8080/man/mc', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                });
                setMcList(response.data.data || []);
            } catch (error) {
                console.error('Lỗi khi tải danh sách MC:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMcList();
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            const urls = {};
            for (const mc of mcList) {
                if (mc.image) {
                    try {
                        const response = await axios.get(`http://localhost:8080/file/${mc.image}`, {
                            headers: {
                                Authorization: localStorage.getItem("token"),
                            },
                            responseType: 'blob',
                        });
                        urls[mc.mcID] = URL.createObjectURL(response.data);
                    } catch {
                        urls[mc.mcID] = defaultImage;
                    }
                } else {
                    urls[mc.mcID] = defaultImage;
                }
            }
            setImageUrls(urls);
        };

        if (mcList.length > 0) fetchImages();
    }, [mcList]);

    return (
<div style={{ padding: '20px' }}>
    <Box display="flex" justifyContent="end" mt="20px" marginBottom="20px" marginRight="10px">
        <Link to={`/mcs/addMc`} style={{ textDecoration: 'none' }}>
            <Button type="submit" color="secondary" variant="contained">
                Add MC
            </Button>
        </Link>
    </Box>

    {loading ? (
        <CircularProgress />
    ) : (
        <Grid container spacing={3}>
            {mcList.map((mc) => (
                <Grid item xs={12} sm={6} md={4} key={mc.mcID}>
                    <Card>
                        <Box sx={{ position: 'relative' }}>
                            {/* Avatar tròn */}
                            <Box
                                component="img"
                                src={imageUrls[mc.mcID] || defaultImage}
                                alt={`${mc.mcName}'s avatar`}
                                sx={{
                                    height: 80,
                                    width: 80,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    top: 16,
                                    left: 16,
                                    border: '2px solid white',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                }}
                            />
                            {/* Nội dung card */}
                            <CardContent sx={{ paddingTop: 8 }}>
                                {/* Tên MC */}
                                <Typography variant="h5" sx={{ fontWeight: 'bold', marginLeft: '96px' }}>
                                    {mc.mcName}
                                </Typography>

                                {/* Các tiêu đề với Icon */}
                                <Box display="flex" alignItems="center" marginTop={2}>
                                    <EmailOutlined sx={{ fontSize: 20, marginRight: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Email: {mc.email}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" marginTop={1}>
                                    <BadgeOutlined sx={{ fontSize: 20, marginRight: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Title: {mc.title || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" marginTop={1}>
                                    <PhoneOutlined sx={{ fontSize: 20, marginRight: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Phone: {mc.phone || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" marginTop={1}>
                                    <HomeOutlined sx={{ fontSize: 20, marginRight: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Address: {mc.address || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" marginTop={1}>
                                    <DescriptionOutlined sx={{ fontSize: 20, marginRight: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Description: {mc.description || 'N/A'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )}
</div>


    );
};

export default McList;
