import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App bg-[#0A0E15]">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;