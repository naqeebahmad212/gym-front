import React, { useEffect, useState } from "react";
import Layout from "../components/shared/Layout";
import MainDashboard from "../components/MainDashboard";
import JimAdminDashboard from "../components/JimAdminDashboard";
import UserDashBoard from "../components/UserDashBoard";
import Otherjims from "./Otherjims";
const Dashboard = () => {
  const [role, setRole] = useState("");
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);
  console.log("rolerolerolerolerolerole", role);

  const renderDashboard = () => {
    switch (role) {
      case "admin":
        return <MainDashboard />;
      case "jimAdmin":
        return <JimAdminDashboard />;
      case "user":
        const gymDetail = localStorage.getItem("gymDetail");
        let user = JSON.parse(localStorage.getItem("user"));
        let activegym = localStorage.getItem("activegym");

        if (gymDetail === "undefined") return <Otherjims />;
        const gym = user.BusinessLocation.find(
          (item) => item?.Gym?._id === activegym
        );

        console.log("gym", user);
        if (gym?.status == "active") return <UserDashBoard />;

        return (
          <div
            className="container w-full  d-flex justify-content-center align-items-center"
            style={{ height: "100%" }}
          >
            <h1>Your request is under review </h1>
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <>
      {role ? renderDashboard() : <div>Please log in to view this page.</div>}
    </>
  );
};

export default Dashboard;
