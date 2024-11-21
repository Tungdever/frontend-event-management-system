import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import HomeRepairServiceOutlinedIcon from "@mui/icons-material/HomeRepairServiceOutlined";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardOutlinedIcon />
    },
    {
      title: 'Calendar',
      icon: <CalendarMonthOutlinedIcon />,
      submenu: [
        { title: 'Xem lịch', path: '/calendar' },
        { title: 'Thêm lịch', path: '/calendar/add' },
      ]
    },
    {
      title: 'Events',
      icon: <CelebrationOutlinedIcon />,
      submenu: [
        { title: 'Danh sách sự kiện', path: '/events' },
        { title: 'Thêm sự kiện', path: '/events/add' },
      ]
    },
    {
      title: 'Sponsors',
      icon: <BusinessOutlinedIcon />,
      submenu: [
        { title: 'Danh sách nhà tài trợ', path: '/sponsors' },
        { title: 'Thêm nhà tài trợ', path: '/sponsors/add' },
      ]
    },
    {
      title: 'Sponsorships',
      icon: <HandshakeOutlinedIcon />,
      submenu: [
        { title: 'Danh sách tài trợ', path: '/sponsorships' },
        { title: 'Thêm tài trợ', path: '/sponsorships/add' },
      ]
    },
    {
      title: 'Providers',
      icon: <StorefrontOutlinedIcon />,
      submenu: [
        { title: 'Danh sách nhà cung cấp', path: '/providers' },
        { title: 'Thêm nhà cung cấp', path: '/providers/add' },
      ]
    },
    {
      title: 'Provider Services',
      icon: <HomeRepairServiceOutlinedIcon />,
      submenu: [
        { title: 'Danh sách dịch vụ', path: '/provider-services' },
        { title: 'Thêm dịch vụ', path: '/provider-services/add' },
      ]
    },
    {
      title: 'Speakers',
      icon: <RecordVoiceOverOutlinedIcon />,
      submenu: [
        { title: 'Danh sách diễn giả', path: '/speakers' },
        { title: 'Thêm diễn giả', path: '/speakers/add' },
      ]
    },
    {
      title: 'MCs',
      icon: <CampaignOutlinedIcon />,
      submenu: [
        { title: 'Danh sách MC', path: '/mcs' },
        { title: 'Thêm MC', path: '/mcs/add' },
      ]
    },
    {
      title: 'Teams',
      icon: <GroupsOutlinedIcon />,
      submenu: [
        { title: 'Danh sách nhóm', path: '/teams' },
        { title: 'Thêm nhóm', path: '/teams/add' },
      ]
    },
    {
      title: 'Tasks',
      icon: <AssignmentOutlinedIcon />,
      submenu: [
        { title: 'Danh sách công việc', path: '/tasks' },
        { title: 'Thêm công việc', path: '/tasks/add' },
      ]
    },
  ];

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  EVENT 
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {menuItems.map((item, index) => (
              <div key={index}>
                {!item.submenu ? (
                  <Item
                    title={item.title}
                    to={item.path}
                    icon={item.icon}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ) : (
                  <Box>
                    <Typography
                      variant="h6"
                      color={colors.grey[300]}
                      sx={{ m: "15px 0 5px 20px" }}
                    >
                      {item.title}
                    </Typography>
                    {item.submenu.map((subItem, subIndex) => (
                      <Item
                        key={subIndex}
                        title={subItem.title}
                        to={subItem.path}
                        icon={item.icon}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    ))}
                  </Box>
                )}
              </div>
            ))}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
