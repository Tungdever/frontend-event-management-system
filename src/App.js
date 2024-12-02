import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

import AddTeamForEvent from "./pages/events/AddTeamForEvent";

import TaskList from './pages/tasks/TaskList';
import TaskAdd from './pages/tasks/TaskAdd';
import Topbar from './pages/Topbar';
import Login from "./pages/Auth/login";
import TaskSubTasks from "./pages/events/AddSubtaskForEvent"
import './App.css';

function App() {
  const [theme, colorMode] = useMode();
  const [selectedEvent, setSelectedEvent] = useState(() => {
    // Lấy giá trị từ localStorage nếu tồn tại
    const savedEvent = localStorage.getItem("selectedEvent");
    return savedEvent ? JSON.parse(savedEvent) : null;
  });
  localStorage.setItem("token","Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjk1MjE4MCwiZXhwIjoxNzMzNTU2OTgwLCJyb2xlcyI6WyJST0xFX0FETUlOIl19.GzQpz-Qtyy07Ojjww-x6_1LfKjnr-1KCgwQ3vFC14xcgiXzM1TWDSlJkLWzJ6gMUjBqAkwhBwtzW0F13YmZjLg")
  useEffect(() => {

    if (selectedEvent) {
      localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));
    } else {
      localStorage.removeItem("selectedEvent");
    }
  }, [selectedEvent]);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="app">
            <div className="sidebar">
              <Sidebar selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
            </div>
            <div className="content-wrapper">
              <div className="topbar">
                <Topbar />
              </div>
              <main className="main-content">
                <Routes>
                  {/* <Route path="/dashboard" element={<EventList />} /> */}

                  <Route path="/calendar/CalendarList" element={<CalendarList />} />
                  <Route path="/events/:eventId/tasks" element={<KanbanBoard />} />

                  <Route path="/dashboard" element={<EventList setSelectedEvent={setSelectedEvent} />} />
                  <Route path="/events/:eventId" element={<EventDetail />} />
                  <Route path="/events/:eventId/sponsors" element={<SponsorForEvent />} />
                  <Route path="/events/:eventId/providers" element={<AddProviderForEvent />} />
                  <Route path="/events/:eventId/teams" element={<AddTeamForEvent />} />
                  <Route path="/events/:eventId/subtask" element={<TaskSubTasks />} />
                  <Route path="/events/add" element={<EventAdd />} />

                  <Route path="/sponsors" element={<SponsorList />} />
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

                  <Route path="/events/:eventId/team-detail" element={<TeamList />} />




                  <Route path="/tasks" element={<TaskList />} />
                  <Route path="/tasks/add" element={<TaskAdd />} />
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