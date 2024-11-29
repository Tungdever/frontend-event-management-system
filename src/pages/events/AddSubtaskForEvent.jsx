import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme"; // Custom theme tokens
import Header from "../../components/Header"; // Custom Header component
import axios from "axios";
import { Link, useParams } from "react-router-dom";


const TaskSubTasks = () => {
    const { eventId } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    // State quản lý dialog
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        subTaskName: "",
        subTaskDesc: "",
        subTaskDeadline: "",
        status: "",
        employeeId: "",
        taskId: null,
    });

    // Mở dialog và thiết lập taskId
    const handleOpenDialog = (taskId) => {
        setFormData((prev) => ({ ...prev, taskId }));
        setOpen(true);
    };

    // Đóng dialog
    const handleCloseDialog = () => {
        setOpen(false);
        setFormData({
            subTaskName: "",
            subTaskDesc: "",
            subTaskDeadline: "",
            status: "",
            employeeId: "",
            taskId: null,
        });
    };

    // Xử lý thay đổi form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm gửi subtask đến API
    const handleSubmit = async () => {
        setLoading(true);
        try {
            console.log("Task ID:", formData.taskId);
            const response = await axios.post(
                `http://localhost:8080/man/subtask/${formData.taskId}`,
                formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            }
            );
            console.log("Subtask saved successfully:", response.data);

            handleCloseDialog();
        } catch (error) {
            console.error("Error saving subtask:", error);

        } finally {
            setLoading(false);
        }
    };
    // Fetch data from the API
    useEffect(() => {
        const fetchSubTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/man/event/${eventId}/subtasks`, {
                    headers: {
                        Authorization: localStorage.getItem("token"), // Token JWT
                    },
                });
                if (response.data && response.data.statusCode === 0) {
                    const groupedTasks = groupByTask(response.data.data);
                    setTasks(groupedTasks);
                }
            } catch (error) {
                console.error("Error fetching subtasks:", error);
            }
        };

        fetchSubTasks();
    }, [eventId]);

    // Helper function to group subtasks by taskId
    const groupByTask = (subtasks) => {
        const grouped = subtasks.reduce((acc, subtask) => {
            const { taskId } = subtask;
            if (!acc[taskId]) acc[taskId] = [];
            acc[taskId].push(subtask);
            return acc;
        }, {});
        return Object.entries(grouped).map(([taskId, subtasks]) => ({
            taskId,
            subtasks,
        }));
    };


    // Columns definition for DataGrid
    const columns = [
        { field: "subTaskName", headerName: "Subtask Name", flex: 1, minWidth: 150 },
        { field: "subTaskDesc", headerName: "Description", flex: 1.5, minWidth: 200 },
        { field: "subTaskStart", headerName: "Start Date", flex: 1, minWidth: 150 },
        { field: "subTaskDeadline", headerName: "Deadline", flex: 1, minWidth: 150 },
        { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
        { field: "employeeId", headerName: "Employee ID", flex: 0.5, minWidth: 100 },
    ];


    return (
        <Box m="20px">
            <Header title="SUBTASKS" subtitle="View and manage subtasks by task" />
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <Box key={task.taskId} mb="30px">
                        <Typography variant="h6" gutterBottom>
                            Task ID: {task.taskId}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenDialog(task.taskId)}
                            sx={{ mb: 2 }}
                        >
                            Add Subtask
                        </Button>
                        <Box
                            height="400px"
                            sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
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
                                autoHeight
                                rows={task.subtasks.map((subtask) => ({
                                    id: subtask.subTaskId,
                                    ...subtask,
                                }))}
                                columns={columns}
                                components={{ Toolbar: GridToolbar }}
                                sx={{
                                    "& .MuiDataGrid-root": {
                                        border: "none",
                                    },
                                    "& .MuiDataGrid-cell": {
                                        borderBottom: "none",
                                    },
                                    "& .MuiDataGrid-columnHeaders": {
                                        backgroundColor: colors.tmp[100],
                                        borderBottom: "none",
                                    },
                                    "& .MuiDataGrid-virtualScroller": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiDataGrid-footerContainer": {
                                        borderTop: "none",
                                        backgroundColor: colors.tmp[100],
                                    },
                                }}
                            />

                        </Box>
                    </Box>
                ))
            ) : (
                <Typography>No tasks available</Typography>
            )}
            {/* Dialog thêm subtask */}
            <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Add Subtask</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Subtask Name"
                        name="subTaskName"
                        value={formData.subTaskName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Description"
                        name="subTaskDesc"
                        value={formData.subTaskDesc}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Deadline"
                        name="subTaskDeadline"
                        type="datetime-local"
                        value={formData.subTaskDeadline}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Status"
                        name="status"
                        select
                        value={formData.status}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="To do">To do</MenuItem>
                        <MenuItem value="Doing">Doing</MenuItem>
                        <MenuItem value="Done">Done</MenuItem>
                    </TextField>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Assigned Employee"
                        name="employeeId"
                        select
                        value={formData.employeeId}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="1">Employee 1</MenuItem>
                        <MenuItem value="2">Employee 2</MenuItem>
                        <MenuItem value="3">Employee 3</MenuItem>

                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: "white" }} />
                        ) : (
                            "Save"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TaskSubTasks;
