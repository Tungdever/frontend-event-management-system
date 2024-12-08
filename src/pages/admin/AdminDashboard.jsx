import React from "react";
import { Box, Typography } from "@mui/material";

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: "250px" }}>
        {/* Header */}
        

        {/* Nội dung */}
        <Box sx={{ p: 3, mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Admin Dashboard
          </Typography>
          <Typography variant="body1">
            Đây là nơi quản lý các chức năng dành cho Admin.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
