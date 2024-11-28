import React, { useState, useEffect } from "react";
import { fetchTasks, updateTask, deleteTask, createTask } from "../../routes/route";
import { useParams } from "react-router-dom";

// Component Modal Dialog for Add Task
const AddTaskDialog = ({ onClose, onSave, eventId }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDl, setTaskDl] = useState("2024-12-31 10:00:00.0");
  const [taskStatus, setTaskStatus] = useState("to do");
  const [teamId, setTeamId] = useState(0);

  const handleSave = () => {
    const newTask = {
      taskName,
      taskDesc,
      taskDl,
      taskStatus,
      eventId: parseInt(eventId),
      teamId
    };
    onSave(newTask);
    onClose();
  };

  return (
    <div style={dialogOverlayStyle}>
      <div style={dialogContainerStyle}>
        <h3>Add New Task</h3>
        <div>
          <label>Task Name</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Task Description</label>
          <input
            type="text"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Task Deadline</label>
          <input
            type="datetime-local"
            value={taskDl}
            onChange={(e) => setTaskDl(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Task Status</label>
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            style={selectStyle}
          >
            <option value="to do">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label>Team ID</label>
          <input
            type="number"
            value={teamId}
            onChange={(e) => setTeamId(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>
            Cancel
          </button>
          <button onClick={handleSave} style={saveButtonStyle}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    "to do": [],
    doing: [],
    done: []
  });
  const [showDialog, setShowDialog] = useState(false);
  const { eventId } = useParams();

  useEffect(() => {
    // Fetch initial tasks
    const loadTasks = async () => {
      const tasks = await fetchTasks(eventId);
      const groupedTasks = {
        "to do": tasks.filter((task) => task.taskStatus === "to do"),
        doing: tasks.filter((task) => task.taskStatus === "doing"),
        done: tasks.filter((task) => task.taskStatus === "done")
      };
      setColumns(groupedTasks);
    };
    loadTasks();
  }, [eventId]);

  const handleStatusChange = async (taskId, newStatus, columnId) => {
    // Check if the status transition is valid
    const validTransitions = {
      'to do': ['doing', 'done'],
      'doing': ['to do', 'done'],
      'done': ['to do', 'doing']
    };
  
    if (!validTransitions[columns[columnId][0]?.taskStatus].includes(newStatus)) {
      alert('Invalid status transition');
      return;
    }
  
    const updatedTask = columns[columnId].find(task => task.taskId === taskId);
    updatedTask.taskStatus = newStatus;
  
    try {
      // Cập nhật task qua API
      const response = await updateTask(updatedTask);
      if (response.success) {
        // Nếu cập nhật thành công, cập nhật lại giao diện
        const updatedColumns = { ...columns };
        updatedColumns[columnId] = updatedColumns[columnId].filter(task => task.taskId !== taskId);
        updatedColumns[newStatus].push(updatedTask);
  
        setColumns(updatedColumns);
      } else {
        //alert('Task update failed');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('There was an error updating the task');
    }
  };
  




  const handleDelete = async (taskId, columnId) => {
    await deleteTask(taskId);
    setColumns((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((task) => task.taskId !== taskId)
    }));
  };

  const handleAddTask = () => {
    setShowDialog(true);
  };

  const handleSaveTask = async (newTask) => {
    // Add task to the API
    await createTask(newTask, eventId);

    // Fetch all tasks again to get the updated list
    const tasks = await fetchTasks(eventId);
    const groupedTasks = {
      "to do": tasks.filter((task) => task.taskStatus === "to do"),
      doing: tasks.filter((task) => task.taskStatus === "doing"),
      done: tasks.filter((task) => task.taskStatus === "done")
    };

    // Update the state with the new task list
    setColumns(groupedTasks);
  };

  return (
    <div>
      <div style={kanbanContainerStyle}>
        {Object.keys(columns).map((columnId) => (
          <div key={columnId} style={kanbanColumnStyle}>
            <h3>{columnId.toUpperCase()}</h3>
            {columns[columnId].map((task, index) => (
              <div key={task.taskId} style={kanbanTaskStyle}>
                <h4>{task.taskName}</h4>
                <p>{task.taskDesc}</p>
                <p><strong>Deadline:</strong> {task.taskDl}</p>
                <select
                  value={task.taskStatus}
                  onChange={(e) => handleStatusChange(task.taskId, e.target.value, columnId)}
                  style={selectStyle}
                >
                  <option value="to do">To Do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
                <button onClick={() => handleDelete(task.taskId, columnId)} style={deleteButtonStyle}>
                  Delete
                </button>
              </div>
            ))}
            <button onClick={handleAddTask} style={addButtonStyle}>
              Add Task
            </button>
          </div>
        ))}
      </div>

      {showDialog && (
        <AddTaskDialog
          onClose={() => setShowDialog(false)}
          onSave={handleSaveTask}
          eventId={eventId}
        />
      )}
    </div>
  );
};

// Styles
const kanbanContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  width: "100%",
  marginTop: "20px"
};

const kanbanColumnStyle = {
  width: "30%",
  border: "1px solid #ccc",
  padding: "10px",
  borderRadius: "8px",
  background: "#f9f9f9",
  minHeight: "400px"
};

const kanbanTaskStyle = {
  backgroundColor: "#fff",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "4px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
};

const addButtonStyle = {
  width: "100%",
  padding: "8px",
  backgroundColor: "#DDDDDD",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px"
};

const deleteButtonStyle = {
  backgroundColor: "#2F4157",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer"
};

const selectStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px"
};

// Dialog styles
const dialogOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1000
};

const dialogContainerStyle = {
  backgroundColor: "#fff",
  width: "400px",
  margin: "100px auto",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px"
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between"
};

const cancelButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const saveButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

export default KanbanBoard;
