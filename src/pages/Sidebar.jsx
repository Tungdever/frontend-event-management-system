import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../theme";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

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

const Sidebar = ({ selectedEvent }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const location = useLocation();  // Lấy URL hiện tại

  // Các menu items mặc định
  const defaultMenuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardOutlinedIcon />
    },
    {
      title: 'Calendar',
      icon: <CalendarMonthOutlinedIcon />,
      submenu: [
        { title: 'Xem lịch', path: '/calendar/CalendarList' },
        
      ]
    },
    {
      title: 'Sponsors',
      icon: <BusinessOutlinedIcon />,
      submenu: [
        { title: 'Danh sách nhà tài trợ', path: '/sponsors/SponsorList' },
      ]
    },
    {
      title: 'Sponsorships',
      icon: <HandshakeOutlinedIcon />,
      submenu: [
        { title: 'Mức độ nhà tài trợ', path: '/sponsorships/' },
      ]
    },
    {
      title: 'Providers',
      icon: <StorefrontOutlinedIcon />,
      submenu: [
        { title: 'Danh sách nhà cung cấp', path: '/providers/ProviderList' },
      ]
    },
    {
      title: 'Speakers',
      icon: <RecordVoiceOverOutlinedIcon />,
      submenu: [
        { title: 'Danh sách diễn giả', path: '/speakers' },
      ]
    },
    {
      title: 'MCs',
      icon: <CampaignOutlinedIcon />,
      submenu: [
        { title: 'Danh sách MC', path: '/mcs' },
      ]
    },
    // {
    //   title: 'Teams',
    //   icon: <GroupsOutlinedIcon />,
    //   submenu: [
    //     { title: 'Danh sách nhóm', path: '/teams/TeamList' },
    //   ]
    // },
    // {
    //   title: 'Tasks',
    //   icon: <AssignmentOutlinedIcon />,
    //   submenu: [
    //     { title: 'Danh sách công việc', path: '/tasks' },
    //   ]
    // },
  ];

  // Menu items dành cho sự kiện
  const eventMenuItems = selectedEvent ? [
    {
      title: "Event Details",
      icon: <CalendarMonthOutlinedIcon />,
      submenu: [
        { title: "View Event", path: `/events/${selectedEvent.eventId}` },
      ],
    },
    
    {
      title: "Manage Invite",
      icon: <GroupsOutlinedIcon />,
      submenu: [
        { title: "Add invite", path: `/events/${selectedEvent.eventId}/participants` },
      ],
    },
    {
      title: "Manage Sponsor",
      icon: <GroupsOutlinedIcon />,
      submenu: [
        { title: "Add sponsor", path: `/events/${selectedEvent.eventId}/sponsors` },
      ],
    },{
      title: "Manage Provider",
      icon: <GroupsOutlinedIcon />,
      submenu: [
        { title: "Add Provider", path: `/events/${selectedEvent.eventId}/providers` },
      ],
    },{
      title: "Manage Task", 
      icon: <GroupsOutlinedIcon />,
      submenu: [
      
        { title: 'Kanban', path: `/events/${selectedEvent.eventId}/tasks` },
      ],
    },{
      title: "Manage SubTask",
      icon: <GroupsOutlinedIcon />,
      submenu: [
        { title: "Add SubTask", path: `/events/${selectedEvent.eventId}/participants` },
      ],
    },{
      title: "Manage Team",
      icon: <GroupsOutlinedIcon />,
      submenu: [
        { title: "Add Team", path: `/events/${selectedEvent.eventId}/teams` },
      ],
    }
  ] : [];

  // Cập nhật lại menuItems dựa trên URL
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  console.log(location.pathname);
  useEffect(() => {
    // Kiểm tra URL hiện tại và quyết định menuItems cần hiển thị
    if (location.pathname.includes('/events/')) {
      setMenuItems(eventMenuItems);  // Nếu là sự kiện, hiển thị menu sự kiện
    } else {
      setMenuItems(defaultMenuItems);  // Nếu không, hiển thị menu mặc định
    }
  }, [location, selectedEvent]);

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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            ml="15px"
          >
            <Typography variant="h3" color={colors.grey[100]}>
              EVENT
            </Typography>
          </Box>

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
