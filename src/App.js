import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import Sidebar from './pages/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import CalendarList from './pages/calendar/CalendarList';
import CalendarAdd from './pages/calendar/CalendarAdd';
import KanbanBoard from "./pages/tasks/Kanban";

import EventList from './pages/events/EventList';
import EventAdd from './pages/events/EventAdd';
import EventDetail from "./pages/events/EventDetail";
import SponsorForEvent from "./pages/events/AddSponsorForEvent";
import AddProviderForEvent from "./pages/events/AddProviderForEvent";

import SponsorList from './pages/sponsors/SponsorList';
import SponsorAdd from './pages/sponsors/SponsorAdd';

import SponsorDetail from './pages/sponsors/SponsorDetail';

import SponsorshipList from './pages/sponsorships/SponsorshipList';
import SponsorshipAdd from './pages/sponsorships/SponsorshipAdd';

import ProviderList from './pages/providers/ProviderList';
import ProviderAdd from './pages/providers/ProviderAdd';
import ProviderEdit from './pages/providers/ProviderEdit'
import ProviderDetail from './pages/providers/ProviderDetail';

import ProviderServiceAdd from './pages/provider-services/ProviderServiceAdd';
import ProviderServiceDetail from './pages/provider-services/ProviderServiceDetail'

import SpeakerList from './pages/speakers/SpeakerList';
import SpeakerAdd from './pages/speakers/SpeakerAdd';
import SpeakerDetail from './pages/speakers/SpeakerDetail';

import MCList from './pages/mcs/MCList';
import MCAdd from './pages/mcs/MCAdd'

import TeamList from './pages/teams/TeamList';
import TeamAdd from './pages/teams/TeamAdd';
import AddTeamForEvent from "./pages/events/AddTeamForEvent";

import TaskList from './pages/tasks/TaskList';
import TaskAdd from './pages/tasks/TaskAdd';
import Topbar from './pages/Topbar';
import Login from "./pages/Auth/login";
import ForgotPassword from "./pages/Auth/forgot";
import ResetPassword from "./pages/Auth/resetPassword";
import './App.css';


function App() {
  const [theme, colorMode] = useMode();
  const [selectedEvent, setSelectedEvent] = useState(() => {
    // Lấy giá trị từ localStorage nếu tồn tại
    const savedEvent = localStorage.getItem("selectedEvent");
    return savedEvent ? JSON.parse(savedEvent) : null;
  });

  useEffect(() => {
    
    if (selectedEvent) {
      localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));
    } else {
      localStorage.removeItem("selectedEvent");
    }
  }, [selectedEvent]);


  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");  // Giả sử bạn lưu token với khóa "authToken"
    if (token) {
      setIsAuthenticated(true);  // Nếu có token, coi như người dùng đã đăng nhập
    } else {
      setIsAuthenticated(false);  // Nếu không có token, coi như chưa đăng nhập
    }
  }, []);

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);  // Xem giá trị của isAuthenticated
  }, [isAuthenticated]);


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="app">
            {isAuthenticated && <Sidebar />}
            <div className="content-wrapper">
              {isAuthenticated && <Topbar />}
              <main className="main-content">
                <Routes>
                  {!isAuthenticated &&
                    (
                      <>
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/forgot" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                      </>
                    )}
                  {isAuthenticated && (
                    <>
                      <Route path="/dashboard" element={<Dashboard />} />

                      <Route path="/calendar/CalendarList" element={<CalendarList />} />
                      <Route path="/calendar/add" element={<CalendarAdd />} />

                      <Route path="/events" element={<EventList />} />
                      <Route path="/events/add" element={<EventAdd />} />

                      <Route path="/sponsors/SponsorList" element={<SponsorList />} />
                      <Route path="/sponsors/SponsorAdd" element={<SponsorAdd />} />
                      <Route path="/sponsors/:sponsorId" element={<SponsorDetail />} />

                      <Route path="/sponsorships/" element={<SponsorshipList />} />
                      <Route path="/sponsorships/add" element={<SponsorshipAdd />} />

                      <Route path="/providers/:providerId" element={<ProviderDetail />} />
                      <Route path="/providers/:providerId/edit" element={<ProviderEdit />} />
                      <Route path="/providers/ProviderList" element={<ProviderList />} />
                      <Route path="/providers/ProviderAdd" element={<ProviderAdd />} />

                      <Route path="/provider/:providerId/service" element={<ProviderServiceAdd />} />
                      <Route path="/provider/service/:serviceId" element={<ProviderServiceDetail />} />

                      <Route path="/speakers" element={<SpeakerList />} />
                      <Route path="/speakers/add" element={<SpeakerAdd />} />
                      <Route path="/speakers/:speakerId/detail" element={<SpeakerDetail />} />

                      <Route path="/mcs" element={<MCList />} />
                      <Route path="/mcs/addMc" element={<MCAdd />} />

                      <Route path="/teams/TeamList" element={<TeamList />} />
                      <Route path="/teams/TeamAdd" element={<TeamAdd />} />

                      <Route path="/tasks" element={<TaskList />} />
                      <Route path="/tasks/add" element={<TaskAdd />} />
                    </>
                  )}
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

