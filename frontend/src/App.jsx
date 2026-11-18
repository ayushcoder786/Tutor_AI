import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseManager from "./pages/CourseManager";
import MyProfile from "./pages/MyProfile";
import AITutor from "./pages/AITutor";
import MainLayout from "./pages/MainLayout";

const App = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/courses" element={<CourseManager />} />
                    <Route path="/aitutor" element={<AITutor />} />
                    <Route path="/profile" element={<MyProfile />} />
                  </Route>
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
