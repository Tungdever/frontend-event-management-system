import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  TableContainer,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useParams } from "react-router-dom";
import axios from "axios";

const createTask = async (task) => {
  const response = await axios.post(`http://localhost:8080/man/task`, task, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return response.data;
};
const updateTask = async (task) => {
  console.log(task);
  const response = await axios.put(`http://localhost:8080/man/task`, task, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return response.data.data;
};
const getTeamsForTask = async (eventId, taskId) => {
  const response = await axios.get(
    `http://localhost:8080/man/event/${eventId}/teams/${taskId}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  return response.data.data;
};
const assignedTeam = async (taskId, teamId) => {
  const response = await axios.put(
    `http://localhost:8080/man/task/${taskId}/assigned/${teamId}`,
    null,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  console.log("Response from API:", response);
  return response.data.data;
};
const fetchTasks = async (eventId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/man/event/${eventId}/tasks`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

const fetchEmployees = async (teamId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/man/team/${teamId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data.data.listEmployees || [];
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};
const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/man/task/${taskId}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete subtask:", error);
    throw error;
  }
};
const handleDeleteTask = async (taskId, status) => {
  try {
    if (status?.toLowerCase() === "done") {
      alert("Không thể xóa các task đã hoàn thành!");
      return;
    }

    const isConfirmed = window.confirm(
      "Lưu ý: Các subtask của task hiện tại cũng sẽ bị xóa. Bạn muốn thực hiện thao tác này?"
    );
    if (!isConfirmed) return;

    const response = await deleteTask(taskId);

    if (response.statusCode === 0) {
      alert("Xóa task thành công!");
    } else {
      alert(
        `Không thể xóa task. Lỗi: ${response.message || "Không rõ lý do."}`
      );
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Đã xảy ra lỗi khi xóa task. Vui lòng thử lại sau.");
  }
};

const deleteSubTask = async (subtakId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/man/subtask/${subtakId}`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete subtask:", error);
    throw error;
  }
};
const handleDeleteSubtask = async (subtaskId, status) => {
  try {
    if (status?.toLowerCase() === "done") {
      alert("Không thể xóa các subtask đã hoàn thành!");
      return;
    }

    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa subtask này?"
    );
    if (!isConfirmed) return;

    const response = await deleteSubTask(subtaskId);

    if (response.statusCode === 0) {
      alert("Xóa subtask thành công!");
    } else {
      alert(
        `Không thể xóa subtask. Lỗi: ${response.message || "Không rõ lý do"}`
      );
    }
  } catch (error) {
    console.error("Error deleting subtask:", error);
    alert("Đã xảy ra lỗi khi xóa subtask. Vui lòng thử lại sau.");
  }
};

const saveSubtask = async (taskId, formData) => {
  const formattedTaskDl = new Date(formData.subTaskDeadline)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  formData.subTaskDeadline = formattedTaskDl;

  try {
    const response = await axios.post(
      `http://localhost:8080/man/subtask/${taskId}`,
      formData,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log("Subtask saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving subtask:", error);
    throw error;
  }
};

function SubTaskList({ subTasks }) {
  return (
    <TableContainer component={Paper} style={{ backgroundColor: "#f9f9f9" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subtask Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subTasks.map((subTask) => (
            <TableRow key={subTask.subTaskId}>
              <TableCell>{subTask.subTaskName}</TableCell>
              <TableCell>{subTask.subTaskDesc}</TableCell>
              <TableCell>{subTask.subTaskDeadline}</TableCell>
              <TableCell>{subTask.status}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() =>
                    handleDeleteSubtask(subTask.subTaskId, subTask.status)
                  }
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
const AddTaskDialog = ({ onClose, onSave, eventId }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDl, setTaskDl] = useState("2024-12-31T10:00");
  const [taskStatus, setTaskStatus] = useState("to do");
  const [teamId, setTeamId] = useState(0);
  const handleSave = () => {
    const formattedTaskDl = new Date(taskDl)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const newTask = {
      taskName,
      taskDesc,
      taskDl: formattedTaskDl,
      taskStatus,
      eventId: parseInt(eventId),
      teamId,
    };
    onSave(newTask);
    onClose();
  };

  
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      {" "}
      <DialogTitle>Add New Task</DialogTitle>{" "}
      <DialogContent>
        {" "}
        <TextField
          label="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          fullWidth
          margin="normal"
        />{" "}
        <TextField
          label="Task Description"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
          fullWidth
          margin="normal"
        />{" "}
        <TextField
          label="Task Deadline"
          type="datetime-local"
          value={taskDl}
          onChange={(e) => setTaskDl(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />{" "}
        <TextField
          label="Task Status"
          select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
          fullWidth
          margin="normal"
        >
          {" "}
          <MenuItem value="to do">To Do</MenuItem>{" "}
          <MenuItem value="doing">Doing</MenuItem>{" "}
          <MenuItem value="done">Done</MenuItem>{" "}
        </TextField>{" "}
      </DialogContent>{" "}
      <DialogActions>
        {" "}
        <Button onClick={onClose} color="secondary">
          {" "}
          Cancel{" "}
        </Button>{" "}
        <Button onClick={handleSave} color="primary">
          {" "}
          Save{" "}
        </Button>{" "}
      </DialogActions>{" "}
    </Dialog>
  );
};
const addButtonStyle = {
  backgroundColor: "#1890ff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "6px 12px",
  cursor: "pointer",
  marginTop: "10px",
};
function TaskList({ tasks, onTaskUpdate, teamId }) {
  const { eventId } = useParams();
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const handleSaveTask = async (newTask) => {
    try {
      console.log("xxx"+ newTask.taskDesc)
      console.log("xxx"+ newTask.taskDl)
      console.log("xxx"+ newTask.taskName)
      console.log("xxx"+ newTask.taskStatus)
      const createdTask = await createTask(newTask); 
      onTaskUpdate((prevTasks) => [...prevTasks, createdTask]); 
      alert("Task saved successfully!");
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task. Please try again.");
    }
  };
  
  const [formData, setFormData] = useState({
    subTaskName: "",
    subTaskDesc: "",
    subTaskDeadline: "",
    status: "",
    employeeId: "",
    taskId: null,
  });
  const handleAddTask = () => {
    setShowDialog(true);
  };

  const handleExpandClick = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleOpenDialog = (taskId) => {
    setFormData((prev) => ({ ...prev, taskId }));
    setOpenDialog(true);
  };
  useEffect(() => {
    if (teamId) {
      const getEmployees = async () => {
        try {
          const data = await fetchEmployees(teamId);
          setEmployees(data);
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      };

      getEmployees();
    }
  }, [teamId]);
  const handleCloseDialog = () => {
    setFormData({
      subTaskName: "",
      subTaskDesc: "",
      subTaskDeadline: "",
      status: "",
      employeeId: "",
      taskId: null,
    });
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await saveSubtask(formData.taskId, formData);
      console.log("Subtask saved successfully:", response);

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving subtask:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
        <button onClick={handleAddTask} style={{ ...addButtonStyle }}>
                  Add Task
                </button>
                {showDialog && (
                  <AddTaskDialog
                    onClose={() => setShowDialog(false)}
                    onSave={handleSaveTask}
                    eventId={eventId}
                  />
                )}{" "}
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <React.Fragment key={task.taskId}>
              <TableRow>
               
                <TableCell>{task.taskName}</TableCell>
                <TableCell>{task.taskDesc}</TableCell>
                <TableCell>{task.taskDl}</TableCell>
                <TableCell>{task.taskStatus}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleExpandClick(task.taskId)}>
                    <ExpandMoreIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handleDeleteTask(task.taskId, task.taskStatus)
                    }
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                  {/* Nút "Add Subtask" trong từng Task */}

                  <Button
                    type="submit"
                    variant="contained"
                    onClick={() => handleOpenDialog(task.taskId)}
                    style={{
                      backgroundColor: "#3f51b5",
                      color: "#ffffff",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      marginLeft: "10px",
                    }}
                  >
                    Add Subtask
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5}>
                  <Collapse
                    in={expandedTaskId === task.taskId}
                    timeout="auto"
                    unmountOnExit
                  >
                    <SubTaskList subTasks={task.listSubTasks || []} />
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for Adding Subtask */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Subtask</DialogTitle>
        <DialogContent>
          <TextField
            label="Subtask Name"
            name="subTaskName"
            value={formData.subTaskName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="subTaskDesc"
            value={formData.subTaskDesc}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Deadline"
            name="subTaskDeadline"
            type="datetime-local"
            value={formData.subTaskDeadline}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
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
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.fullName}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}

export default TaskList;
