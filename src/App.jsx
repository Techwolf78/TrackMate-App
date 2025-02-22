import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Import Firebase auth
import "./App.css";
import Home from "./components/pages/home";
import Sales from "./components/Sales/Page/sales";
import Placement from "./components/Placement/Page/placement";
import Navbar from './components/navbar';
import Landing from './components/pages/landing';
import Login from "./components/Auth/login";
import Forgetpassword from "./components/forgetpassword";
import AdminLogin from "./components/Auth/adminLogin";
import Media from "./components/pages/media";
import Spent from "./components/pages/SpentDashboard";
import UnderConstruction from "./components/pages/underCont";
import PlacementDocs from "./components/pages/PlacementDocs";
import CollegeData from "./components/pages/CollegeData";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true); // If the user is logged in
        setUserEmail(user.email); // Set user email
      } else {
        setIsAuthenticated(false); // If no user is logged in
        setUserEmail(null); // Clear user email
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />

      <div className="main-content"> {/* Apply bottom padding to ensure content doesn't get covered */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path='/adminlogin' element={<AdminLogin />} />
          <Route path='/media' element={<Media />} />
          <Route path='/spent' element={<Spent />} />
          <Route path="/clddata" element={<CollegeData />} />
          <Route path='/underconstruction' element={<UnderConstruction />} />
          <Route path='/docs' element={<PlacementDocs />} />
          {/* Sales and Placement Routes - Protected */}
          <Route
            path="/sales"
            element={isAuthenticated && userEmail === "ajaypawargryphon@gmail.com" ? <Sales /> : <Login />}
          />
          <Route
            path="/placement"
            element={isAuthenticated && userEmail === "mrajaypawar207@gmail.com" ? <Placement /> : <Login />}
          />
          
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<Forgetpassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
