import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  Typography,
} from "@mui/material";

function TaskList({ tasks }) {
  return (
    <div>
      {tasks?.map((task) => (
        <div key={task.taskId}>
          <Typography variant="h6">{task.taskName}</Typography>
          <Typography variant="body2">{`Status: ${task.taskStatus}`}</Typography>
          <Collapse in>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SubTask Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Deadline</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {task.listSubTasks?.map((subTask) => (
                  <TableRow key={subTask.subTaskId}>
                    <TableCell>{subTask.subTaskName}</TableCell>
                    <TableCell>{subTask.subTaskDesc}</TableCell>
                    <TableCell>{subTask.status}</TableCell>
                    <TableCell>{subTask.subTaskDeadline}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
