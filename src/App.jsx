// import { useState } from 'react'
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { RegisterPage } from "./pages/registerPage";
import { LoginPage } from "./pages/LoginPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { Home } from "./pages/Home/Home";
import { Appointments } from "./pages/Client/Appointments";
import { AddReview } from "./pages/Client/AddReview";
import { Profile } from "./pages/Client/Profile";

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          ></Route>
          <Route path="/reset-password" element={<ResetPasswordPage />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/appointments" element={<Appointments />}></Route>
          <Route path="/add-review" element={<AddReview />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          
        </Routes>
      </Router>
    </>
  );
};

export default App;
