import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebaseConfig";
import "./App.css";

// Components & Pages
import Home from "./components/pages/home";
import Sales from "./components/Sales/Page/sales";
import Placement from "./components/Placement/Page/placement";
import Navbar from './components/navbar';
import Landing from './components/pages/landing';
import Login from "./components/Auth/login";
import Forgetpassword from "./components/Auth/forgetpassword";
import AdminLogin from './components/Auth/AdminLogin';
import Media from "./components/pages/media";
import Spent from "./components/pages/SalesDashboard";
import UnderConstruction from "./components/pages/underCont";
import PlacementDocs from "./components/pages/PlacementDocs";
import CollegeData from "./components/pages/CollegeData";
import PlacDashboard from "./components/pages/PlacementDashboard";
import SaleDashboard from "./components/pages/SalesDashboard";
import DashLogin from "./components/Auth/DashboardLogin";
import CompanyData from "./components/pages/CompanyData";
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ForgetPassDash from './components/Auth/ForgetPassDash';
import SalesVisitDashboard from './components/pages/SalesVisitDashboard'; // Add this import

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email);
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    });

    return () => unsubscribe(); // Clean up
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/dashlogin" element={<DashLogin />} />
          <Route path="/media" element={<Media />} />
          <Route path="/spent" element={<Spent />} />
          <Route path="/clddata" element={<CollegeData />} />
          <Route path="/companydata" element={<CompanyData />} />
          <Route path="/underconstruction" element={<UnderConstruction />} />
          <Route path="/salesvisitdash" element={<SalesVisitDashboard />} />
          <Route path="/docs" element={<PlacementDocs />} />
          <Route path="/placdash" element={<PlacDashboard />} />
          <Route path="/saledash" element={<SaleDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<Forgetpassword />} />
          <Route path="/forgetpassdash" element={<ForgetPassDash />} />

          {/* Protected Sales Route */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
                allowedEmails={[
                  "ajay@gryphonacademy.co.in",
                  "nishad@gryphonacademy.co.in",
                  "dheeraj@gryphonacademy.co.in",
                ]}
              >
                <Sales />
              </ProtectedRoute>
            }
          />

          {/* Protected Placement Route */}
          <Route
            path="/placement"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
                allowedEmails={[
                  "ajaypawargryphon@gmail.com",
                  "shashikant@gryphonacademy.co.in",
                ]}
              >
                <Placement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
