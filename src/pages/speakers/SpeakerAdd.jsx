import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardMedia,
  CircularProgress,
  IconButton,
} from "@mui/material";
import axios from "axios";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";

const SpeakerAdd = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

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
    if (
      !name ||
      !email ||
      !title ||
      !phone ||
      !address ||
      !description ||
      !image
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("title", title);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("description", description);
    formData.append("imageSpeaker", image);
    formData.append("image", imageName);

    setLoading(true);
    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:8080/man/speaker",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("API Response:", response);
      alert("Thêm diễn giả thành công!");
      setName("");
      setEmail("");
      setTitle("");
      setPhone("");
      setAddress("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Lỗi khi thêm diễn giả:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  const onBack = async () => {
    navigate(`/speakers`);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={onBack}>
          <ArrowBackOutlinedIcon style={{ color: "#3f51b5" }} />
        </IconButton>
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "#3f51b5", fontWeight: "bold", marginLeft: "10px" }}
        >
          Thêm Diễn Giả Mới
        </Typography>
      </div>
      <Card
        style={{
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <form onSubmit={handleSubmit}>
          {imagePreview ? (
            <div style={{ textAlign: "left", marginBottom: "20px" }}>
              <CardMedia
                component="img"
                image={imagePreview}
                alt="Diễn Giả Image Preview"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  margin: "0",
                }}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<PersonAddOutlinedIcon />}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#3f51b5",
                    color: "#ffffff",
                  }}
                >
                  Chọn Ảnh
                </Button>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="image-upload"
              />
              <Typography
                variant="body2"
                align="left"
                style={{ marginTop: "10px" }}
              >
                {imageName}
              </Typography>
            </div>
          ) : (
            <div style={{ textAlign: "left", marginBottom: "20px" }}>
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<PersonAddOutlinedIcon />}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#3f51b5",
                    color: "#ffffff",
                  }}
                >
                  Chọn Ảnh
                </Button>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="image-upload"
              />
            </div>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên Diễn Giả"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
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
                style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Chức Danh"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số Điện Thoại"
                variant="outlined"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Địa Chỉ"
                variant="outlined"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
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
                style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                style={{
                  backgroundColor: "#3f51b5",
                  color: "#ffffff",
                  borderRadius: "20px",
                  padding: "8px 16px",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} style={{ color: "#ffffff" }} />
                ) : (
                  "Thêm Diễn Giả"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </div>
  );
};

export default SpeakerAdd;
