import React from "react";
import { Box, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { Dashboard, Settings, People, Logout } from "@mui/icons-material";
import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <Box
      sx={{
        width: "250px",
        bgcolor: "#3b71ca",
        color: "#fff",
        height: "100vh",
        position: "fixed",
      }}
    >
      <List>
        <ListItem button component={Link} to="/admin/dashboard">
          <ListItemIcon>
            <Dashboard style={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button component={Link} to="/admin/users">
          <ListItemIcon>
            <People style={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>

        <ListItem button component={Link} to="/admin/settings">
          <ListItemIcon>
            <Settings style={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  );
}

export default AdminSidebar;
