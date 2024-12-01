import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function EmployeeList({ employees }) {
  return (
    <List>
      {employees.map((employee) => (
        <ListItem key={employee.id}>
          <ListItemText
            primary={employee.fullName}
            secondary={
              <>
                Email: {employee.email}
                <br />
                Address: {employee.address}
                <br />
                Phone: {employee.phone}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

function SubTaskList({ subTasks }) {
  return (
    <List>
      {subTasks.map((subTask) => (
        <ListItem key={subTask.subTaskId}>
          <ListItemText
            primary={subTask.subTaskName}
            secondary={
              <>
                Description: {subTask.subTaskDesc}
                <br />
                Deadline: {subTask.subTaskDeadline}
                <br />
                Status: {subTask.status}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

function TaskList({ tasks }) {
  return (
    <List>
      {tasks.map((task) => (
        <ListItem key={task.taskId}>
          <ListItemText
            primary={task.taskName}
            secondary={
              <>
                Description: {task.taskDesc}
                <br />
                Deadline: {task.taskDl}
                <br />
                Status: {task.taskStatus}
              </>
            }
          />
          <SubTaskList subTasks={task.listSubTasks || []} />
        </ListItem>
      ))}
    </List>
  );
}

function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/man/team/1/detail`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("API Response Data:", response.data.data); // Log dữ liệu để kiểm tra
      return response.data.data;
    } catch (err) {
      throw new Error("Failed to fetch team data");
    }
  };

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const detailTeam = await fetchData();
        setTeams(detailTeam);
        console.log("Teams after API call:", detailTeam); // Thêm log để kiểm tra dữ liệu gán vào state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{`Error: ${error}`}</Typography>;
  }

  return (
    <>
      {teams.map((team) => (
        <Accordion key={team.teamId}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`Team: ${team.teamName}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Tabs value={tabValue} onChange={handleChange}>
              <Tab label="Employees" />
              <Tab label="Tasks" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <EmployeeList employees={team.listEmployees || []} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <TaskList tasks={team.listTasks || []} />
            </TabPanel>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export default TeamList;
