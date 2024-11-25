import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Box, Button } from '@mui/material';
import axios from 'axios';
import { Link } from "react-router-dom";

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
                        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`, // Token JWT
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
                                Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
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
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={imageUrls[mc.mcID] || defaultImage}
                                    alt={`${mc.mcName}'s avatar`}
                                />
                                <CardContent>
                                    <Typography variant="h6">{mc.mcName}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Email: {mc.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Title: {mc.title || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Phone: {mc.phone || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Address: {mc.address || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Description: {mc.description || 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default McList;
