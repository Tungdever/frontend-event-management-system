import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Import các icon từ MUI
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import HomeRepairServiceOutlinedIcon from '@mui/icons-material/HomeRepairServiceOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

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
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Event Management</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item">
            {!item.submenu ? (
              <Link 
                to={item.path} 
                className={`menu-title ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="menu-icon">{item.icon}</span>
                {item.title}
              </Link>
            ) : (
              <>
                <div 
                  className="menu-title"
                  onClick={() => toggleMenu(item.title)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {item.title}
                  <KeyboardArrowDownIcon 
                    className={`arrow ${openMenus[item.title] ? 'open' : ''}`}
                  />
                </div>
                <div className={`submenu ${openMenus[item.title] ? 'open' : ''}`}>
                  {item.submenu.map((subItem, subIndex) => (
                    <Link 
                      key={subIndex}
                      to={subItem.path}
                      className={`submenu-item ${location.pathname === subItem.path ? 'active' : ''}`}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
