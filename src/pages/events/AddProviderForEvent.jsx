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
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import axios from "axios";

const AddProviderForEvent = () => {
    const { eventId } = useParams();
  const [providers, setProviders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Fetch providers for the event
  const fetchProviders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/man/event/${eventId}/providers`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token")
            },
          });
      setProviders(response.data.data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  // Fetch available providers to add
  const fetchAvailableProviders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/man/event/${eventId}/listprovider`,
        {
          headers: {
            Authorization: localStorage.getItem("token")
          },
        }
      );
      setAvailableProviders(response.data.data);
    } catch (error) {
      console.error("Error fetching available providers:", error);
    }
  };

  // Add provider to the event
  const addProvider = async (providerId) => {
    try {
    console.log(eventId, providerId)
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

  // Open menu for options
  const handleMenuOpen = (event, provider) => {
    setAnchorEl(event.currentTarget);
    setSelectedProvider(provider);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Initial fetch
  useEffect(() => {
    fetchProviders();
  }, [eventId]);

  return (
    <div style={{marginLeft:'20px'}}>
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
      >
        Add Provider
      </Button>

      {/* Providers List */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
        {providers.map((provider) => (
          <Card key={provider.id} style={{ width: "300px" }}>
            <CardContent>
              <Typography variant="h6">{provider.name}</Typography>
              <Typography variant="body2">Contact: {provider.contact}</Typography>
              <Typography variant="body2">Email: {provider.email}</Typography>
              <Typography variant="body2">Phone: {provider.phone}</Typography>
              <Typography variant="body2">Address: {provider.address}</Typography>
              <Typography variant="body2">
                Website: <a href={provider.website}>{provider.website}</a>
              </Typography>
              <IconButton
                style={{ float: "right" }}
                onClick={(e) => handleMenuOpen(e, provider)}
              >
                <MoreVert />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Menu for Provider Options */}
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
          View Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            console.log("Delete logic here");
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* Dialog to Add Provider */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Select Provider to Add</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {availableProviders.map((provider) => (
              <Card
                key={provider.id}
                style={{
                  width: "300px",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                }}
                onClick={() => addProvider(provider.id)}
              >
                <CardContent>
                  <Typography variant="h6">{provider.name}</Typography>
                  <Typography variant="body2">Contact: {provider.contact}</Typography>
                  <Typography variant="body2">Email: {provider.email}</Typography>
                  <Typography variant="body2">Phone: {provider.phone}</Typography>
                  <Typography variant="body2">Address: {provider.address}</Typography>
                  <Typography variant="body2">
                    Website: <a href={provider.website}>{provider.website}</a>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddProviderForEvent;
