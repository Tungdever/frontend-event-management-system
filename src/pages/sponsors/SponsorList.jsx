import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// Lấy token từ localStorage
const getToken = () => {
  return "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw";
};

// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/man/sponsor', // Base URL của Spring Boot (đổi thành sponsor)
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
  },
});

const SponsorList = () => {
  const [sponsors, setSponsors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSponsors = async () => {
      const token = getToken();
      try {
        const response = await axiosInstance.get();
        console.log("Response Data:", response.data);

        // Giả sử API trả về một đối tượng với mảng nhà tài trợ trong thuộc tính "data"
        if (Array.isArray(response.data.data)) {
          setSponsors(response.data.data); // Gán đúng mảng sponsors
        } else {
          console.error("Dữ liệu không phải là mảng hoặc cấu trúc không đúng!");
        }
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };

    fetchSponsors();
  }, []);

  const handleMenuOpen = (event, sponsor) => {
    setAnchorEl(event.currentTarget);
    setSelectedSponsor(sponsor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSponsor(null);
  };

  const handleViewDetail = () => {
    console.log("Viewing details for sponsor:", selectedSponsor);
    handleMenuClose();
    navigate(`/sponsors/${selectedSponsor.id}`);
  };

  const handleEdit = async () => {
    console.log("Editing sponsor:", selectedSponsor);
    handleMenuClose();
    navigate(`/sponsors/${selectedSponsor.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/${selectedSponsor.id}`);
      alert("Sponsor deleted successfully");
      setSponsors((prev) => prev.filter((sp) => sp.id !== selectedSponsor.id));
    } catch (error) {
      console.error("Error deleting sponsor:", error);
    }
    handleMenuClose();
  };

  const columns = [
    { field: "name", headerName: "Sponsor Name", width: 200 },
    { field: "contact", headerName: "Contact Person", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
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
        LIST SPONSOR
      </Typography>
      <Box display="flex" justifyContent="end" mt="20px" marginBottom="20px" marginRight="10px">

      <Link to={`/sponsors/SponsorAdd`} style={{ textDecoration: 'none', pointerEvents: 'auto' }}>
          <Button type="submit" color="secondary" variant="contained">
            Add Sponsor
          </Button>
        </Link>

      </Box>
      {/* Đảm bảo rằng sponsors là mảng */}
      <DataGrid rows={sponsors} columns={columns} />
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

export default SponsorList;
