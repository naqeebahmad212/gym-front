import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faChevronRight,
  faCircle,
  faCloud,
  faCoins,
  faCube,
  faCubes,
  faDumbbell,
  faEnvelope,
  faHome,
  faIndianRupeeSign,
  faPhoneVolume,
  faSquarePlus,
  faUserClock,
  faUserPlus,
  faUsers,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const Sidebar = ({ handleShowNav, setTopHeading }) => {
  const [isActiveGymsOpen, setIsActiveGymsOpen] = useState(false);
  const [isActiveEarningsOpen, setIsActiveEarningsOpen] = useState(false);
  const [changeactiveGym, setChangeactiveGym] = useState(false);
  const role = localStorage.getItem("role");
  const location = useLocation();
  let user = JSON.parse(localStorage.getItem("user"));
  let activegym = localStorage.getItem("activegym");
  let JimsList = [];
  if (!user.isAdmin && !user.isJimAdmin) {
    user.BusinessLocation.forEach((Gym) => {
      if (Gym?.status === "active") {
        JimsList.push({
          label: `${Gym?.Gym?.name}`,
          icon: faCircle,
          itemId: Gym?.Gym?._id.toString(),
          is_Active: activegym == Gym?.Gym?._id.toString() ? true : false,
        });
      }
    });
  }
  // Define menu items based on user roles

  const gymDetail = localStorage.getItem("gymDetail");

  const menuItems = {
    admin: [
      { label: "Dashboard", link: "/", icon: faHome },
      {
        label: "Active Gyms",
        submenu: [
          { label: "Gyms", link: "/gyms" },
          { label: "Gym Users", link: "/gym-users" },
        ],
        icon: faDumbbell,
      },
      { label: "New Gym Request", link: "/new-gym-request", icon: faUserClock },
      { label: "Add New Gym", link: "/add-new-jim", icon: faSquarePlus },
      { label: "Packages", link: "/admin-packages", icon: faCubes },
      { label: "Earnings", link: "/earning", icon: faIndianRupeeSign },
      { label: "Contact Queries", link: "/admin-contact", icon: faPhoneVolume },
    ],
    jimAdmin: [
      { label: "Dashboard", link: "/", icon: faHome },
      { label: "All Members", link: "/all-member", icon: faUsers },
      { label: "New Requests", link: "/new-request", icon: faUserClock },
      { label: "Add new Members", link: "/add-new-member", icon: faUserPlus },
      { label: "Packages", link: "/newpackages", icon: faCubes },
      { label: "Earnings", link: "/earning", icon: faIndianRupeeSign },
      { label: "Contact Support", link: "/contact", icon: faPhoneVolume },
      // { label: "Attendance", link:  "/attendance", icon: faCalendar },
    ],
    user: [
      {
        label: "Switch Gym",
        submenu: JimsList,
        icon: faDumbbell,
      },
      { label: "Dashboard", link: "/", icon: faHome },
      {
        label: "Packages",
        link:
          gymDetail === "undefined" ||
          !user.BusinessLocation.find((item) => item?.Gym?._id === activegym)
            ? "#"
            : "/newpackages",
        icon: faCubes,
      },
      {
        label: "Other Gyms",
        link: gymDetail === "undefined" ? "#" : "/Other-jims",
        icon: faCloud,
      },
      {
        label: "Attendance",
        link:
          gymDetail === "undefined" ||
          !user.BusinessLocation.find((item) => item?.Gym?._id === activegym)
            ? "#"
            : "/attendance",
        icon: faCalendar,
      },
    ],
  };

  const toggleActiveGyms = () => {
    setIsActiveGymsOpen(!isActiveGymsOpen);
    setIsActiveEarningsOpen(!isActiveEarningsOpen);
  };

  let handleActiveGym = (gymId) => {
    const currentGymDetail = user.BusinessLocation.find(
      (item) => item?.Gym?._id === gymId
    )?.Gym;

    console.log("activegym", currentGymDetail);
    localStorage.removeItem("activegym");
    localStorage.setItem("activegym", gymId);

    if (currentGymDetail) {
      localStorage.setItem("gymDetail", JSON.stringify(currentGymDetail));
      setTopHeading(currentGymDetail.name);
    }
    setChangeactiveGym(!changeactiveGym);
  };

  const renderMenuItems = (items) => {
    return items.map((item, index) => {
      const isActive = location.pathname === item.link;

      return (
        <li className={`menu-item ${isActive ? "active" : ""}`} key={index}>
          {item.submenu ? (
            <a
              className="menu-link menu-toggle"
              onClick={() => {
                toggleActiveGyms();
              }}
            >
              <FontAwesomeIcon icon={item.icon} className="menu-icon" />
              <div className="d-flex justify-content-between w-100">
                {item.label}{" "}
                {!isActiveGymsOpen ? (
                  <FontAwesomeIcon icon={faChevronRight} />
                ) : (
                  <FontAwesomeIcon icon={faAngleDown} />
                )}
              </div>
            </a>
          ) : (
            <Link to={item.link} onClick={handleShowNav} className="menu-link">
              <FontAwesomeIcon icon={item.icon} className="menu-icon" />
              <div>{item.label}</div>
            </Link>
          )}
          {isActiveGymsOpen && item.submenu && (
            <ul className="">
              {item.submenu.map((subItem, subIndex) => {
                const isSubActive = location.pathname === subItem.link;
                return (
                  <>
                    {!subItem.link ? (
                      <li
                        className={`menu-item ${
                          subItem.is_Active ? "active" : ""
                        }`}
                        key={subIndex}
                      >
                        <div
                          onClick={() => {
                            handleActiveGym(subItem.itemId);
                          }}
                          className="menu-link "
                        >
                          {" "}
                          {subItem.label}
                        </div>
                      </li>
                    ) : (
                      <>
                        <li
                          className={`menu-item ${isSubActive ? "active" : ""}`}
                          key={subIndex}
                        >
                          <Link
                            to={subItem.link}
                            onClick={handleShowNav}
                            className="menu-link"
                          >
                            {" "}
                            <div>{subItem.label}</div>
                          </Link>
                        </li>
                      </>
                    )}
                  </>
                );
              })}
            </ul>
          )}
          {/* {isActiveEarningsOpen && item.submenu && (
                        <ul className="">
                            {item.submenu.map((subItem, subIndex) => (
                                <li className="menu-item" key={subIndex}>
                                    <div onClick={() => handleActiveGym(subItem.itemId)} className='menu-link'>  {subItem.label}</div>
                                </li>
                            ))}
                        </ul>
                    )} */}
        </li>
      );
    });
  };

  return (
    <aside
      id="layout-menu"
      className={`layout-menu menu-vertical menu bg-menu-theme pt-4 show layout-menu-expanded sidebar`}
    >
      <div className="app-brand demo mb-4">
        <Link to="/" className="app-brand-link">
          <img src={logo} />
        </Link>
        {/* Menu toggle button (responsive) */}
        <a
          href="javascript:void(0);"
          className="layout-menu-toggle menu-link text-large ms-auto"
        >
          <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
          <i
            className="ti ti-x d-block d-xl-none ti-sm align-middle"
            onClick={handleShowNav}
          ></i>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {menuItems[role] && renderMenuItems(menuItems[role])}
      </ul>
    </aside>
  );
};

export default Sidebar;
