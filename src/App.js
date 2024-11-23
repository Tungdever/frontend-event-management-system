import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import Sidebar from './pages/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import CalendarList from './pages/calendar/CalendarList';
import CalendarAdd from './pages/calendar/CalendarAdd';
import EventList from './pages/events/EventList';
import EventAdd from './pages/events/EventAdd';
import SponsorList from './pages/sponsors/SponsorList';
import SponsorAdd from './pages/sponsors/SponsorAdd';
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
import MCList from './pages/mcs/MCList';
import MCAdd from './pages/mcs/MCAdd';
import TeamList from './pages/teams/TeamList';
import TeamAdd from './pages/teams/TeamAdd';
import TaskList from './pages/tasks/TaskList';
import TaskAdd from './pages/tasks/TaskAdd';
import Topbar from './pages/Topbar';
import './App.css';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="app">
            <Sidebar />
            <div className="content-wrapper">
              <Topbar />
              <main className="main-content">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/calendar/CalendarList" element={<CalendarList />} />
                  <Route path="/calendar/add" element={<CalendarAdd />} />
                  <Route path="/events" element={<EventList />} />
                  <Route path="/events/add" element={<EventAdd />} />
                  <Route path="/sponsors/SponsorList" element={<SponsorList />} />
                  <Route path="/sponsors/add" element={<SponsorAdd />} />
                  <Route path="/sponsorships/" element={<SponsorshipList />} />
                  <Route path="/sponsorships/add" element={<SponsorshipAdd />} />
                  <Route path="/providers/:providerId" element={<ProviderDetail />} />
                  <Route path="/providers/:providerId/edit" element={<ProviderEdit />} />
                  <Route path="/providers/ProviderList" element={<ProviderList />} />
                  <Route path="/providers/ProviderAdd" element={<ProviderAdd />} />
                
                  <Route path="/provider-services/ProviderServiceAdd" element={<ProviderServiceAdd />} />
                  <Route path="/provider/service/:serviceId" element={<ProviderServiceDetail />} />
                  <Route path="/speakers" element={<SpeakerList />} />
                  <Route path="/speakers/SpeakerAdd" element={<SpeakerAdd />} />
                  <Route path="/mcs" element={<MCList />} />
                  <Route path="/mcs/add" element={<MCAdd />} />
                  <Route path="/teams/TeamList" element={<TeamList />} />
                  <Route path="/teams/TeamAdd" element={<TeamAdd />} />
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
