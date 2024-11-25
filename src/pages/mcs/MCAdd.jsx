import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Card, CardMedia, CircularProgress } from '@mui/material';
import axios from 'axios';

const MCAdd = () => {
  const [mcName, setMcName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Tạo preview cho ảnh
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!mcName || !email || !image) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const formData = new FormData();
    formData.append('mcName', mcName);
    formData.append('email', email);
    formData.append('imageMc', image); // Đính kèm ảnh vào FormData

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/man/mc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
        },
      });
      alert('MC đã được thêm thành công');
      // Reset form sau khi thêm thành công
      setMcName('');
      setEmail('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Lỗi khi thêm MC:', error);
      alert('Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Thêm MC Mới
      </Typography>
      <Card style={{ padding: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* mcName */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên MC"
                variant="outlined"
                fullWidth
                value={mcName}
                onChange={(e) => setMcName(e.target.value)}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            {/* Ảnh đại diện */}
            <Grid item xs={12} sm={6}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="contained" component="span" fullWidth>
                  Chọn ảnh
                </Button>
              </label>
              {imagePreview && (
                <CardMedia
                  component="img"
                  height="200"
                  image={imagePreview}
                  alt="MC Image Preview"
                />
              )}
            </Grid>

            {/* Nút submit */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Thêm MC'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </div>
  );
};

export default MCAdd;
