import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Card, CardMedia, CircularProgress } from '@mui/material';
import axios from 'axios';

const McAdd = () => {
  const [mcName, setMcName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!mcName || !email || !title || !phone || !address || !description || !image) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const formData = new FormData();
    formData.append('mcName', mcName);
    formData.append('email', email);
    formData.append('title', title);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('imageMc', image);
    formData.append('image', imageName);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/man/mc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
        },
      });
      console.log('API Response:', response);
      alert('Thêm MC thành công!');
      setMcName('');
      setEmail('');
      setTitle('');
      setPhone('');
      setAddress('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Lỗi khi thêm MC:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại.');
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên MC"
                variant="outlined"
                fullWidth
                value={mcName}
                onChange={(e) => setMcName(e.target.value)}
              />
            </Grid>
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Chức Danh"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số Điện Thoại"
                variant="outlined"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Địa Chỉ"
                variant="outlined"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mô Tả"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
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
                  Chọn Ảnh
                </Button>
              </label>
              {imagePreview && (
                <>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imagePreview}
                    alt="MC Image Preview"
                  />
                  <Typography variant="body2" align="center">
                    {imageName}
                  </Typography>
                </>
              )}
            </Grid>
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

export default McAdd;
