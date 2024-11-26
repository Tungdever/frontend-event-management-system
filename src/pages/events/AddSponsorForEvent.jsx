import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Link as MuiLink,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const SponsorCard = ({ sponsor, onDelete }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/file/${sponsor.sponsorLogo}`,
          {
            headers: {
              Authorization: "Bearer your-token-here", // Thay thế bằng token thực tế
            },
            responseType: "blob",
          }
        );
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
      } catch (error) {
        console.error("Error loading image:", error);
      } finally {
        setLoadingImage(false);
      }
    };

    fetchImage();
  }, [sponsor.sponsorLogo]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetail = () => {
    alert(`Viewing details for: ${sponsor.name}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(sponsor.id);
    handleMenuClose();
  };

  return (
    <Card>
      {loadingImage ? (
        <CircularProgress />
      ) : (
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={sponsor.name}
        />
      )}
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">{sponsor.name}</Typography>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Contact: {sponsor.contact}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: {sponsor.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Phone: {sponsor.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Address: {sponsor.address}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sponsorship Level: {sponsor.sponsorshipLevel}
        </Typography>
        <MuiLink href={sponsor.website} target="_blank" rel="noopener">
          Visit Website
        </MuiLink>
      </CardContent>

      {/* Dots Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleViewDetail}>View Detail</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Card>
  );
};


const SponsorForEvent = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const eventId = 1; // Lấy từ URL
  const apiUrl = `http://localhost:8080/man/event/${eventId}/sponsors`;
  const authHeader = {
    headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await axios.get(apiUrl, authHeader);
        if (response.data && response.data.statusCode === 0) {
          setSponsors(response.data.data);
        } else {
          setError("Failed to fetch sponsors");
        }
      } catch (err) {
        setError("An error occurred while fetching sponsors");
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, [apiUrl]);

  const handleDeleteSponsor = (id) => {
    setSponsors((prev) => prev.filter((sponsor) => sponsor.id !== id));
  };



  return (
    <Box sx={{ padding: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Sponsors for Event {eventId}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Sponsor
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {sponsors.map((sponsor) => (
            <Grid item xs={12} sm={6} md={4} key={sponsor.id}>
              <SponsorCard sponsor={sponsor} onDelete={handleDeleteSponsor} />
            </Grid>
          ))}
        </Grid>
      )}

     
    </Box>
  );
};

export default SponsorForEvent;
