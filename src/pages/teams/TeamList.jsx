import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Dữ liệu giả lập
  const teams = [
    {
      teamId: "1",
      teamName: "Team Alpha",
      employeeList: [
        {
          empId: "101",
          employName: "John Doe",
          email: "john@example.com",
          phone: "123-456-7890",
        },
        {
          empId: "102",
          employName: "Jane Smith",
          email: "jane@example.com",
          phone: "234-567-8901",
        },
        {
          empId: "103",
          employName: "Mark Lee",
          email: "mark@example.com",
          phone: "345-678-9012",
        },
      ],
    },
    {
      teamId: "2",
      teamName: "Team Beta",
      employeeList: [
        {
          empId: "201",
          employName: "Alice Brown",
          email: "alice@example.com",
          phone: "456-789-0123",
        },
        {
          empId: "202",
          employName: "Bob Green",
          email: "bob@example.com",
          phone: "567-890-1234",
        },
        {
          empId: "203",
          employName: "Cathy White",
          email: "cathy@example.com",
          phone: "678-901-2345",
        },
      ],
    },
  ];

  // Định nghĩa cột cho bảng nhân viên
  const columns = [
    { field: "empId", headerName: "Employee ID", flex: 0.5 },
    { field: "employName", headerName: "Employee Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="TEAMS" subtitle="List of Teams and Employees" />
      {teams.length > 0 ? (
        teams.map((team) => (
          <Box key={team.teamId} mb="30px">
            <Typography variant="h6" gutterBottom>
              Team: {team.teamName}
            </Typography>
            <Box
              height="300px"
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
                rows={team.employeeList.map((employee) => ({
                  id: employee.empId,
                  empId: employee.empId,
                  employName: employee.employName,
                  email: employee.email,
                  phone: employee.phone,
                }))}
                columns={columns}
                components={{ Toolbar: GridToolbar }}
              />
            </Box>
          </Box>
        ))
      ) : (
        <Typography>No teams available</Typography>
      )}
    </Box>
  );
};

export default Contacts;
