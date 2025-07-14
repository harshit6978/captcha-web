import './App.css';
import Login from './Auth/Login';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Page/Dashboard';
import ProjectedRoute from './Auth/ProjectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProjectedRoute>
              <Dashboard />
            </ProjectedRoute>
          }></Route>
    </Routes>
    </div >
  );
}

export default App;
