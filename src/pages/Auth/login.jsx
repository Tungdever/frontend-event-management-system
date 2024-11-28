import React, { useState } from "react";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });
      const token = response.data.data; 
      localStorage.setItem("token", token);
      console.log("Đăng nhập thành công:", response.data);
      console.log("Token:", token);
      //window.location.href = "/dashboard";
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      setError("Email hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="70vh">
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
        <form onSubmit={handleLogin}>
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
              },
            }}
          />
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
                  borderColor: "#ffffff",
                },
                "&:hover fieldset": {
                  borderColor: "#76c7c0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#76c7c0",
                },
              },
            }}
          />
          {error && (
            <Typography color="error" mt={1} textAlign="center">
              {error}
            </Typography>
          )}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Đăng Nhập"}
            </Button>
          </Box>
        </form>
        <Typography color="#aaaaaa" textAlign="center" mt={2}>
          <a href="/forgot" style={{ color: "#76c7c0" }}>
            Quên mật khẩu
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
