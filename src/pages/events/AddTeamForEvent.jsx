import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tab,
  Tabs,
  TextField,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Link, useParams } from "react-router-dom";

const Contacts = () => {
  const { eventId } = useParams();
  const colors = tokens("light");
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/man/event/${eventId}/team-member`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
          },
        });
        const result = await response.json();

        if (result.statusCode === 0 && result.data) {
          setTeams(result.data);
        } else {
          setError("Failed to fetch data.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [eventId]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:8080/man/employee",{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
        },
      });
      const result = await response.json();
      if (result.statusCode === 0 && result.data) {
        setEmployees(result.data);
      } else {
        console.error("Failed to fetch employees.");
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSearchTerm(""); // Reset search khi chuyển tab
  };

  const handleOpenDialog = () => {
    fetchEmployees();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddMember = async (teamId, employeeId) => {
    try {
      const response = await fetch(`http://localhost:8080/man/team/${teamId}/add/${employeeId}`, {
        method: "POST",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
        }
      });
      if (response.ok) {
        alert("Member added successfully!");
        setOpenDialog(false); // Close dialog
        // Fetch lại dữ liệu team
        const updatedTeams = await fetch(`http://localhost:8080/man/event/${eventId}/team-member`, {
          method: "GET",
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
          }
        });
        const result = await updatedTeams.json();
        if (result.statusCode === 0 && result.data) {
          setTeams(result.data);
        }
      } else {
        alert("Failed to add member!");
      }
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };

  if (loading) {
    return (
      <Box m="20px" textAlign="center">
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px" textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="TEAMS" subtitle="List of Teams and Employees" />
      
      {teams.length === 0 ? (
        <Box textAlign="center" m="20px">
          <Typography>No teams available.</Typography>
        </Box>
      ) : (
        <>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {teams.map((team, index) => (
              <Tab key={team.teamId} label={team.teamName} />
            ))}
          </Tabs>
  
          {teams.map((team, index) =>
            index === selectedTab ? (
              <Box key={team.teamId} mt="20px">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenDialog}
                  sx={{ mb: 2 }}
                >
                  Add Member
                </Button>
                <TextField
                  label="Search Employees"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Box
                  height="400px"
                  sx={{
                    "& .MuiDataGrid-root": {
                      border: "none",
                      color:colors.primary[100],
                    },
                    "& .MuiDataGrid-cell": {
                      borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: colors.blueAccent[700],
                      borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                      backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                      borderTop: "none",
                      backgroundColor: colors.blueAccent[700],
                    },
                  }}
                >
                  <DataGrid
                    rows={team.listEmployees.map((employee) => ({
                      id: employee.id,
                      fullName: employee.fullName,
                      email: employee.email,
                      phone: employee.phone,
                      address: employee.address,
                    }))}
                    columns={[
                      { field: "id", headerName: "ID", flex: 0.5 },
                      { field: "fullName", headerName: "Name", flex: 1 },
                      { field: "email", headerName: "Email", flex: 1 },
                      { field: "phone", headerName: "Phone", flex: 1 },
                      { field: "address", headerName: "Address", flex: 1 },
                    ]}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                  />
                </Box>
              </Box>
            ) : null
          )}
        </>
      )}
  
      {/* Dialog thêm thành viên */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add Member to Team</DialogTitle>
        <DialogContent>
          <Typography>Team ID: {teams[selectedTab]?.teamId}</Typography>
          <Box mt={2}>
            {employees.map((employee) => (
              <Box
                key={employee.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography>{employee.fullName}</Typography>
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleAddMember(teams[selectedTab]?.teamId, employee.id)
                  }
                >
                  <AddOutlinedIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  
};

export default Contacts;
