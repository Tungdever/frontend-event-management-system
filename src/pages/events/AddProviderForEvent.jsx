import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import {
  MoreVert,
  DeleteOutline,
  EditOutlined,
  EmailOutlined,
  PhoneOutlined,
  LocationOnOutlined,
  LanguageOutlined,
  PersonOutline,
} from "@mui/icons-material";
import axios from "axios";
export const deleteProviderEvent = async (eventId, providerId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/man/event/${eventId}/del-provider/${providerId}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete provider:", error);
    throw error;
  }
};
const AddProviderForEvent = () => {
  const { eventId } = useParams();
  const [providers, setProviders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const fetchProviders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/man/event/${eventId}/providers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setProviders(response.data.data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  const fetchAvailableProviders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/man/event/${eventId}/listprovider`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setAvailableProviders(response.data.data);
    } catch (error) {
      console.error("Error fetching available providers:", error);
    }
  };

  const addProvider = async (providerId) => {
    try {
      console.log(eventId, providerId);
      await axios.post(
        `http://localhost:8080/man/event/${eventId}/providers/${providerId}`,
        null,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      alert("Provider added successfully!");
      fetchAvailableProviders();
      fetchProviders();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding provider:", error);
    }
  };

  const handleMenuOpen = (event, provider) => {
    setAnchorEl(event.currentTarget);
    setSelectedProvider(provider);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const removeProvider = async (providerId) => {
    try {
      await deleteProviderEvent(eventId, providerId);
      alert("Provider deleted successfully!");
      fetchProviders();
    } catch (error) {
      console.error("Error deleting provider:", error);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [eventId]);

  return (
    <Box sx={{ marginLeft: "20px", marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Providers for Event
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setDialogOpen(true);
          fetchAvailableProviders();
        }}
        sx={{ marginBottom: "20px" }}
      >
        Add Provider
      </Button>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {providers.map((provider) => (
          <Card
            key={provider.id}
            sx={{
              width: "350px",
              backgroundColor: "#f9f9f9",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
              >
                {provider.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PersonOutline
                  sx={{
                    marginRight: "8px",
                    fontSize: "16px",
                    color: "#A3B8D0",
                  }}
                />
                Contact: {provider.contact}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <EmailOutlined
                  sx={{
                    marginRight: "8px",
                    fontSize: "16px",
                    color: "#A3B8D0",
                  }}
                />
                Email: {provider.email}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PhoneOutlined
                  sx={{
                    marginRight: "8px",
                    fontSize: "16px",
                    color: "#A3B8D0",
                  }}
                />
                Phone: {provider.phone}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <LocationOnOutlined
                  sx={{
                    marginRight: "8px",
                    fontSize: "16px",
                    color: "#A3B8D0",
                  }}
                />
                Address: {provider.address}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <LanguageOutlined
                  sx={{
                    marginRight: "8px",
                    fontSize: "16px",
                    color: "#A3B8D0",
                  }}
                />
                Website: <a href={provider.website}>{provider.website}</a>
              </Typography>
              <IconButton
                sx={{ float: "right" }}
                onClick={(e) => handleMenuOpen(e, provider)}
              >
                <MoreVert />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            window.location.href = `/providers/${selectedProvider.id}`;
          }}
        >
          <EditOutlined fontSize="small" /> View Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            removeProvider(selectedProvider.id);
          }}
        >
          <DeleteOutline fontSize="small" sx={{ color: "#A3B8D0" }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>Select Provider to Add</DialogTitle>
        <DialogContent dividers={true}>
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              padding: "8px",
              overflowX: "auto",
              maxWidth: "100%", 
            }}
          >
            {availableProviders.map((provider) => (
              <Card
                key={provider.id}
                sx={{
                  minWidth: "300px", 
                  maxWidth: "350px",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  },
                }}
                onClick={() => addProvider(provider.id)}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
                  >
                    {provider.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <PersonOutline
                      sx={{
                        marginRight: "8px",
                        fontSize: "16px",
                        color: "#A3B8D0",
                      }}
                    />
                    Contact: {provider.contact}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <EmailOutlined
                      sx={{
                        marginRight: "8px",
                        fontSize: "16px",
                        color: "#A3B8D0",
                      }}
                    />
                    Email: {provider.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <PhoneOutlined
                      sx={{
                        marginRight: "8px",
                        fontSize: "16px",
                        color: "#A3B8D0",
                      }}
                    />
                    Phone: {provider.phone}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <LocationOnOutlined
                      sx={{
                        marginRight: "8px",
                        fontSize: "16px",
                        color: "#A3B8D0",
                      }}
                    />
                    Address: {provider.address}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <LanguageOutlined
                      sx={{
                        marginRight: "8px",
                        fontSize: "16px",
                        color: "#A3B8D0",
                      }}
                    />
                    Website: <a href={provider.website}>{provider.website}</a>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddProviderForEvent;
