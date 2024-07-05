import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import UserDetails from '../UserDetail';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { App_host } from '../../Data';
import {
    faUser
  } from "@fortawesome/free-solid-svg-icons";
const TopNav = ({ handleShowNav ,topHeading,setTopHeading}) => {


















    const [showDetails, setShowDetails] = useState(false)
    const [detailsData, setDetailsData] = useState(null)
    const [notification, setNotification] = useState([])
    const [count, setcount] = useState([])


    const user = JSON.parse(localStorage.getItem('user'));
    // console.log("const user = JSON.parse(localStorage.getItem('user'))", user)
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {

        if(topHeading) return
    const gymDetailLocal = localStorage.getItem('gymDetail')
    if(gymDetailLocal==='undefined') return
    const gymDetail =gymDetailLocal? JSON.parse(gymDetailLocal):null;
        getnotifications()
        if (user) {
            if (user?.isAdmin) {
                setTopHeading('Admin');
            } else if (user.isJimAdmin) {
                setTopHeading(gymDetail?.name);
            } else {
                setTopHeading(gymDetail?.name);
            }
        }
    }, [user]);

    const getnotifications = async () => {
        try {
            const response = await axios.get(`${App_host}/notifications/getNotifications`, {
                headers: {
                    token,
                },
            });
            // console.log("drdrdrdrdrdrdrdrdrdrdrdrds", response)
            // return
            setNotification(response.data.data.notifications);
            setcount(response.data.data.notificationCount);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    let markasRead = async () => {
        try {
            const response = await axios.get(`${App_host}/notifications/markread`, {
                headers: {
                    token,
                },
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    const deleteNotification = async (id) => {
        try {
            const response = await axios.get(`${App_host}/notifications/delete?id=${id}`, {
                headers: {
                    token,
                },
            });
            getnotifications()
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // const Shownootifications=
    const handleLogout = () => {
        console.log("Logout...");
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('activegym');
        localStorage.removeItem('gymDetail');
        window.location.reload();
    };
    let handleShowDeatils = (data = null) => {
        setShowDetails(!showDetails)
       
    }

    return (
        <>
            <nav
                className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
                id="layout-navbar"
            >
                <div
                    className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none"
                    onClick={handleShowNav}
                >
                    <a
                        className="nav-item nav-link px-0 me-xl-4"
                        href="javascript:void(0)"
                    >
                        <i className="ti ti-menu-2 ti-sm"></i>
                    </a>
                </div>
                <span className="app-brand-text demo menu-text fw-bold">
                    {topHeading}
                </span>
                <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                    <ul className="navbar-nav flex-row align-items-center ms-auto">
                        {/* Notification */}
                        <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-1">
                            {(user?.isAdmin || user?.isJimAdmin) &&
                                (<a className="nav-link dropdown-toggle hide-arrow" onClick={markasRead} href="javascript:void(0);" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                    <i className="ti ti-bell ti-md"></i>
                                    {count>0&& <span className="badge bg-danger rounded-pill badge-notifications">{count}</span>}
                                    
                                </a>)}
                            <ul className="dropdown-menu dropdown-menu-end py-0">
                                <li className="dropdown-menu-header border-bottom">
                                    <div className="dropdown-header d-flex align-items-center py-3">
                                        <h5 className="text-body mb-0 me-auto">Notification</h5>
                                        <a href="javascript:void(0)" className="dropdown-notifications-all text-body" data-bs-toggle="tooltip" data-bs-placement="top" title="Mark all as read">
                                            <i className="ti ti-mail-opened fs-4"></i>
                                        </a>
                                    </div>
                                </li>
                                <li className="dropdown-notifications-list scrollable-container">
                                    <ul class="list-group list-group-flush">
                                        {notification.length > 0 ? (
                                            notification.map((noti) => {
                                                return (<li class="list-group-item list-group-item-action dropdown-notifications-item">
                                                    <div class="d-flex">
                                                        <div class="flex-grow-1">
                                                            {/* <h6 class="mb-1">Congratulation Lettie 🎉</h6> */}
                                                            <p class="mb-0">{noti.message}</p>
                                                            {/* <small class="text-muted">1h ago</small> */}
                                                        </div>
                                                        <div class="flex-shrink-0 dropdown-notifications-actions">
                                                            {!noti.isRead &&
                                                                (<a href="javascript:void(0)" class="dropdown-notifications-read">
                                                                    <span class="badge badge-dot"></span>
                                                                </a>)
                                                            }
                                                            <a href="javascript:void(0)" class="dropdown-notifications-archive" onClick={() => deleteNotification(noti._id.toString())}><span
                                                                class="ti ti-x"></span></a>
                                                        </div>
                                                    </div>
                                                </li>)
                                            })

                                        ) : (
                                            <li class="list-group-item list-group-item-action dropdown-notifications-item">
                                                <div class="d-flex">
                                                   no available notifications
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        {/* User */}
                        <li className="nav-item navbar-dropdown dropdown-user dropdown">
                            <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                                <div className="d-flex justify-content-center align-items-center avatar-online">
                                    {user?.isAdmin ?  <FontAwesomeIcon icon={faUser} className="h-90 rounded-circle" /> :  <img width={50} height={50} src={user?.images} alt className="h-70 rounded-circle" /> }
                                  
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <a class="dropdown-item" href="pages-account-settings-account.html">
                                        <div class="d-flex">
                                            <div class="flex-shrink-0 me-3">
                                                <div class="d-flex justify-content-center align-items-center  avatar-online">
                                                {user?.isAdmin ?  <FontAwesomeIcon icon={faUser} className="h-90 rounded-circle" /> :  <img height={50} width={50} src={user?.images} alt className="h-70 rounded-circle" /> }
                                                </div>
                                            </div>
                                            <div class="flex-grow-1">
                                                <span class="fw-medium d-block">{user?.full_name}</span>
                                                <small class="text-muted">{role == "jimAdmin" ? "Gym Admin" : role}</small>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <div class="dropdown-divider"></div>
                                </li>
                                <li>
                                    <a class="dropdown-item" onClick={handleShowDeatils}>
                                        <i class="ti ti-user-check me-2 ti-sm"></i>
                                        <span class="align-middle">My Profile</span>
                                    </a>
                                </li>

                                <li>
                                    <div class="dropdown-divider"></div>
                                </li>

                                <li>
                                    <p class="dropdown-item" onClick={handleLogout}>
                                        <i class="ti ti-logout me-2 ti-sm"></i>
                                        <span class="align-middle" >Log Out</span>
                                    </p>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="navbar-search-wrapper search-input-wrapper d-none">
                    <input type="text" className="form-control search-input container-xxl border-0" placeholder="Search..." aria-label="Search..." />
                    <i className="ti ti-x ti-sm search-toggler cursor-pointer"></i>
                </div>
            </nav>
            {user &&
                <UserDetails showDetails={showDetails} handleShowDeatils={handleShowDeatils} Data={user} type={"user"} />
            }
        </>
    )
}

export default TopNav;
