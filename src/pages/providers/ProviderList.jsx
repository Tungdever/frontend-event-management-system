import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

// Lấy token từ localStorage
const getToken = () => {
  //return localStorage.getItem('token');
  return "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw"; // Lấy token JWT từ localStorage
};
// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/man/provider', // Base URL của Spring Boot
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});

const ProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      const token = getToken(); //
      try {
        //console.log("Sending request with token:", `Bearer ${token}`);

        const response = await axiosInstance.get()

        console.log("Response Data:", response.data);
        setProviders(response.data);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }

    };

    fetchProviders();
  }, []);

  const handleMenuOpen = (event, provider) => {
    setAnchorEl(event.currentTarget);
    setSelectedProvider(provider);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProvider(null);
  };

  const handleViewDetail = () => {
    console.log("Viewing details for provider:", selectedProvider);
    handleMenuClose();
    navigate(`/providers/${selectedProvider.id}`);
  };

  const handleEdit = async () => {
    console.log("Editing provider:", selectedProvider);
    handleMenuClose();
    navigate(`/providers/${selectedProvider.id}/edit`);
  };

  const handleDelete = async () => {

    try {
      const response = await axiosInstance.delete(`/${selectedProvider.id}`)
      alert("Provider deleted successfully");
      setProviders((prev) => prev.filter((prov) => prov.id !== selectedProvider.id));
    } catch (error) {
      console.error("Error deleting provider:", error);
    }

    handleMenuClose();
  };

  const columns = [
    { field: "name", headerName: "Provider Name", width: 250 },
    { field: "contact", headerName: "Contact Person", width: 230 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Phone", width: 160 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      headerAlign: "center", // Căn giữa tiêu đề cột
    align: "center",
      renderCell: (params) => (
        <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%", marginLeft: "10px" }}>
      <Typography
        variant="h4"
        style={{
          fontWeight: "bold",
          color: "#333",
          textAlign: "left",
          marginBottom: "20px",
          fontSize: "32px",
          marginRight: "auto"
        }}
      >
        LIST PROVIDER
      </Typography>
      <Box display="flex" justifyContent="end" mt="20px" marginBottom="20px" marginRight="10px">

        <Link to={`/providers/ProviderAdd`} style={{ textDecoration: 'none' }}>
          <Button type="submit" color="secondary" variant="contained">
            Add Provider
          </Button>
        </Link>

      </Box>
      <DataGrid rows={providers} columns={columns} />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetail}>View Detail</MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default ProviderList;
