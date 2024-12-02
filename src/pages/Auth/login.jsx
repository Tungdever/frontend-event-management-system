import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import axios from "axios";
import { Link } from "react-router-dom";
function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // Xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });
      const token = response.data.data;
      localStorage.setItem("token", "Bearer " + token); // Lưu token vào localStorage
      setIsAuthenticated(true);
      console.log("Đăng nhập thành công:", response.data);

      console.log("Token:", "Bearer " + token);
      window.location.href = "/dashboard"; // Điều hướng tới dashboard
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      setError("Email hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      bgcolor="#f0f0f0"
    >
      <Box
        width="100%"
        maxWidth="400px"
        p={3}
        bgcolor="#f9f8ff"
        borderRadius={2}
        boxShadow={3}
      >
        <Typography variant="h4" color="#000000" textAlign="center" mb={3}>
          Đăng Nhập
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <TextField

            placeholder="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email style={{ color: "#d5cbff" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#171316",
                "& fieldset": {
                  borderColor: "#d5cbff",
                },
                "&:hover fieldset": {
                  borderColor: "#76c7c0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#76c7c0",
                },
                "& input:-webkit-autofill": {
                  backgroundColor: "##ffffff !important", // Màu nền khi autofill
                  WebkitBoxShadow: "0 0 0px 1000px #ffffff inset !important", // Đảm bảo màu nền không bị ghi đè
                },
              },
            }}
          />

          {/* Password Field */}
          <TextField

            placeholder="Mật khẩu"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: "#d5cbff" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#171316",
                "& fieldset": {
                  borderColor: "#d5cbff",
                },
                "&:hover fieldset": {
                  borderColor: "#76c7c0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#76c7c0",
                },
                "& input:-webkit-autofill": {
                  backgroundColor: "#ffffff !important", // Màu nền khi autofill
                  WebkitBoxShadow: "0 0 0px 1000px #ffffff inset !important", // Đảm bảo màu nền không bị ghi đè
                },
              },
            }}
          />

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <Typography color="error" mt={1} textAlign="center">
              {error}
            </Typography>
          )}

          {/* Nút đăng nhập */}
          <Box display="flex" justifyContent="center" mt={3} bgcolor="#3b71cb" color = "#ffffff">
            <Button
              type="submit"
              variant="contained"
              color="#333333;"

              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Đăng Nhập"}
            </Button>
          </Box>
        </form>

        {/* Link quên mật khẩu */}
        <Typography color="#333333" textAlign="center" mt={2}>
          <Box display="flex" justifyContent="flex-end">
            <Link to="/forgot" style={{ color: "#333333", textDecoration: "line" }}>
              Quên mật khẩu
            </Link>
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;