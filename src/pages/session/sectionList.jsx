import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem, CircularProgress, TextField, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import AddSectionForm from "./AddSectionForm";
import { useParams } from "react-router-dom";

const SectionList = () => {
    const { eventId } = useParams();
    const [sections, setSection] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSections, setFilteredSections] = useState([]);
    const [loading, setLoading] = useState(true);

    const convertTo12HourFormat = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const amPm = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12;
        return `${String(adjustedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${amPm}`;
    };

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/man/event/${eventId}/section`, {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                const processedData = response.data.data.map((section) => ({
                    ...section,
                    time: `${convertTo12HourFormat(section.startTime)} - ${convertTo12HourFormat(section.endTime)}`,
                }));

                setSection(processedData || []);
                setFilteredSections(processedData || []);
            } catch (error) {
                console.error("Error fetching sections:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, [eventId]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = sections.filter((section) =>
            section.sectionTitle.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSections(filtered);
    };

    const handleMenuOpen = (event, section) => {
        setAnchorEl(event.currentTarget);
        setSelectedSection(section);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedSection(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/man/section/${selectedSection.id}`, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            alert("Section deleted successfully");
            setSection((prev) => prev.filter((s) => s.id !== selectedSection.id));
            setFilteredSections((prev) => prev.filter((s) => s.id !== selectedSection.id));
        } catch (error) {
            console.error("Error deleting section:", error);
            alert("Failed to delete section.");
        }
        handleMenuClose();
    };

    const columns = [
        { field: "time", headerName: "Time", width: 180 },
        { field: "speakerId", headerName: "Speaker/Presenter(s)", width: 200 },
        { field: "sectionTitle", headerName: "Title", width: 250 },
        { field: "sectionDescription", headerName: "Description", width: 200 },
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
        <div style={{ height: 600, width: "100%", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
            <Typography
                variant="h4"
                style={{
                    fontWeight: "bold",
                    color: "#1e88e5",
                    marginBottom: "20px",
                    fontFamily: "Poppins, sans-serif",
                }}
            >
                List of Sections
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
                <TextField
                    label="Search Section"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ width: "300px" }}
                />
                <AddSectionForm
                    onAdd={(newSection) => {
                        const processedNewSection = {
                            ...newSection,
                            time: `${newSection.startTime} - ${newSection.endTime}`
                        };
                        setSection((prev) => [...prev, processedNewSection]);
                        setFilteredSections((prev) => [...prev, processedNewSection]);
                    }}
                />
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : (
                <Box style={{ height: "400px" }}>
                    <DataGrid
                        rows={filteredSections}
                        columns={columns}
                        getRowId={(row) => row.sectionId}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        style={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
                        }}
                        getRowClassName={(params) => {
                            const isEven = params.indexRelativeToCurrentPage % 2 === 0;
                            return `data-grid-row-${isEven ? "even" : "odd"}`;
                        }}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 2,
                            boxShadow: 1,
                            '& .MuiDataGrid-row': {
                                fontSize: 14,
                                fontFamily: "Roboto, sans-serif",
                                '&:nth-of-type(even)': {
                                    backgroundColor: "#d0d0d0",
                                },
                                '&:hover': {
                                    backgroundColor: "#e3f2fd",
                                },
                            },
                        }}
                    />
                </Box>
            )}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </div>
    );
};

export default SectionList;
