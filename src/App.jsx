import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Appbar from './components/bars/appBar';
import { HumanPage } from './components/pages/humanPage';
import { LocationPage } from './components/pages/locationPage';
import { VirusPage } from './components/pages/virusPage';

function App() {
  return (
    <Router>
      <div>
        <Appbar />
        <Routes>
          <Route path="/human" element={<HumanPage />} />
          <Route path="/locations" element={<LocationPage />} />
          <Route path="/viruses" element={<VirusPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

