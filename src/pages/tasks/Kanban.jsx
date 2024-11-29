import React, { useState, useEffect } from "react";
import { fetchTasks, updateTask, deleteTask, createTask, getTeamsForTask, assignedTeam } from "../../routes/route";
import { useParams } from "react-router-dom";

// Component Modal Dialog for Add Task
const AddTaskDialog = ({ onClose, onSave, eventId }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDl, setTaskDl] = useState("2024-12-31 10:00:00.0");
  const [taskStatus, setTaskStatus] = useState("to do");
  const [teamId, setTeamId] = useState(0);

  const handleSave = () => {
    const formattedTaskDl = new Date(taskDl).toISOString().slice(0, 19).replace('T', ' ');
    const newTask = {
      taskName,
      taskDesc,
      taskDl: formattedTaskDl,  // Sử dụng giá trị đã chuyển đổi
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
          <label>Task Deadline </label>
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
  const [teams, setTeams] = useState([]);

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
  }, [columns]);

  const handleStatusChange = async (taskId, newStatus, columnId) => {
    // Kiểm tra nếu chưa chọn team, thì không cho phép thay đổi trạng thái
    const task = columns[columnId].find(task => task.taskId === taskId);
    if (!task.teamId || task.teamId === 0) {
      alert("Assigned team chưa được chỉ định");
      return;
    }

    // Kiểm tra nếu trạng thái chuyển đổi hợp lệ
    const validTransitions = {
      'to do': ['doing', 'done'],
      'doing': ['to do', 'done'],
      'done': ['to do', 'doing']
    };

    if (!validTransitions[task.taskStatus].includes(newStatus)) {
      alert('Invalid status transition');
      return;
    }

    task.taskStatus = newStatus;

    try {
      // Cập nhật task qua API
      const response = await updateTask(task);
      if (response.success) {
        // Nếu cập nhật thành công, cập nhật lại giao diện
        const updatedColumns = { ...columns };
        updatedColumns[columnId] = updatedColumns[columnId].filter(t => t.taskId !== taskId);
        updatedColumns[newStatus].push(task);

        setColumns(updatedColumns);
      } else {
        //alert('Task update failed');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('There was an error updating the task');
    }
  };






  const fetchTeams = async (eventId, taskId) => {
    try {
      const fetchedTeams = await getTeamsForTask(eventId, taskId);
      setTeams(fetchedTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleDelete = async (taskId, columnId) => {
    await deleteTask(taskId);
    setColumns((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((task) => task.taskId !== taskId)
    }));
  };
  const handleAssignedTeamChange = async (taskId, teamId) => {
    try {
      const responseData = await assignedTeam(taskId, teamId);
      console.log('Response Data:', responseData);
      if (responseData === true) {
        alert("Team assigned successfully!");


      } else {
        alert("Failed to assign team");
      }
    } catch (error) {
      console.error('Error assigning team:', error);
      alert("Error while assigning team");
    }
  };


  const handleAddTask = () => {
    setShowDialog(true);
  };

  const handleSaveTask = async (newTask) => {
    // Thêm task vào API
    await createTask(newTask);

    // Fetch tất cả task lại để lấy danh sách mới nhất
    const tasks = await fetchTasks(eventId);
    const groupedTasks = {
      "to do": tasks.filter((task) => task.taskStatus === "to do"),
      doing: tasks.filter((task) => task.taskStatus === "doing"),
      done: tasks.filter((task) => task.taskStatus === "done")
    };

    // Cập nhật lại state với danh sách task mới
    setColumns(groupedTasks);
  };


  return (
    <div>
      <div style={{ ...kanbanContainerStyle, display: 'flex', overflowX: 'auto' }}>
        {Object.keys(columns).map((columnId) => (
          <div
            key={columnId}
            style={{
              ...kanbanColumnStyle,
              margin: '10px',
              maxHeight: '600px',
              overflowY: 'auto',
              flex: 1,
              padding: '10px',
              boxSizing: 'border-box',
            }}
          >
            <h3>{columnId.toUpperCase()}</h3>
            {columns[columnId].map((task, index) => (
              <div
                key={task.taskId}
                style={{
                  ...kanbanTaskStyle,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  marginBottom: '6px',
                  padding: '4px',
                  fontSize: '13x',
                  height: 'auto',
                  minHeight: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <h4><strong>Name: </strong>{task.taskName}</h4>
                <p><strong>Description: </strong> {task.taskDesc}</p>
                <p>
                  <strong>Deadline: </strong>
                  {new Date(task.taskDl).toLocaleString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </p>

                {/* Status */}
                <div style={{ marginBottom: '6px' }}>
                  <label htmlFor={`status-${task.taskId}`}><strong>Status</strong></label>
                  <select
                    id={`status-${task.taskId}`}
                    value={task.taskStatus}
                    onChange={(e) => handleStatusChange(task.taskId, e.target.value, columnId)}
                    style={{
                      ...selectStyle,
                      fontSize: "12px",
                      width: "auto",
                      textAlign: "center",
                      marginRight: '5px',
                      border: 'none',
                    }}
                  >
                    <option value="to do" style={{ fontWeight: 'bold' }}>To Do</option>
                    <option value="doing" style={{ fontWeight: 'bold' }}>Doing</option>
                    <option value="done" style={{ fontWeight: 'bold' }}>Done</option>
                  </select>
                </div>

                {/* Assigned Team */}
                <div style={{ marginBottom: '6px' }}>
                  <label htmlFor={`team-${task.taskId}`}><strong>Assigned Team</strong></label>
                  <select
                    id={`team-${task.taskId}`}
                    value={task.teamId || ""}
                    onChange={(e) => handleAssignedTeamChange(task.taskId, e.target.value)}
                    onFocus={() => fetchTeams(eventId, task.taskId)}
                    style={{
                      ...selectStyle,
                      fontSize: "12px",
                      width: "auto",
                      textAlign: "center",
                      border: 'none',
                    }}
                    disabled={task.teamName}
                  >
                    {task.teamName ? (
                      <option value={task.teamId} style={{ fontStyle: 'italic' }}>{task.teamName}</option>
                    ) : (
                      <>
                        <option value="">Select a team</option>
                        {teams.map((team) => (
                          <option key={team.teamId} value={team.teamId} style={{ fontStyle: 'italic' }}>
                            {team.teamName}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

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
