import {
  faCoins,
  faHourglassHalf,
  faIndianRupeeSign,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { App_host } from "../Data";
import axios from "axios";

const MainDashboard = () => {
  const [dashBoardData, setDashboardData] = useState();
  const [gymUsers, setGymUsers] = useState();
  const [monthlyEarning, setMonthlyEarning] = useState("");
  const [pending, setPending] = useState("");
  let token = localStorage.getItem("token");

  const getPackagesList = async () => {
    try {
      const response = await axios.get(
        `${App_host}/earning/getDashboardDetails`,
        {
          headers: {
            token,
          },
        }
      );

      console.log("getDashboardDetails", response.data.data);

      const responseGymUsers = await axios.get(
        `${App_host}/earning/GymwithLeastandMostUsers`,
        {
          headers: {
            token,
          },
        }
      );

      const getGyms = await axios.get(
        `${App_host}/Jim/getAllBusinessLocation`,
        {
          params: {
            status: "pending",
          },
          headers: {
            token,
          },
        }
      );

      let { businessLocations, ...otherPages } = getGyms.data.data;

      console.log("businessLocations", businessLocations);

      setGymUsers(responseGymUsers?.data);
      setDashboardData({
        ...response.data.data,
        newRequest: businessLocations?.results.length,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const monthlyEarnings = async () => {
    try {
      const response = await axios.get(`${App_host}/earning/monthlyEarning`, {
        headers: {
          token,
        },
      });
      setMonthlyEarning(response?.data["monthlyEarnings"]);
      console.log("moth", monthlyEarning);
    } catch (error) {
      console.error("Error monthly earning:", error);
    }
  };

  const pendingPayment = async () => {
    try {
      const response = await axios.get(
        `${App_host}/gymPayment/pendingPayment`,
        {
          headers: {
            token,
          },
        }
      );
      setPending(response?.data);
    } catch (error) {
      console.error("Error monthly earning:", error);
    }
  };
  useEffect(() => {
    getPackagesList();
    monthlyEarnings();
    pendingPayment();
  }, []);

  return (
    <div>
      <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row">
            <div className="card-body row p-0 pb-3">
              <div className="col-12 col-md-8 card-separator">
                <h3>Welcome back, Admin 👋🏻 </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-4 mb-4 ">
                <div className="card card-border-shadow-primary ">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2 pb-1">
                      <div className="avatar me-2">
                        <span className="avatar-initial rounded bg-label-primary">
                          <FontAwesomeIcon icon={faUserClock} />
                        </span>
                      </div>
                      <h4 className="ms-1 mb-0">{dashBoardData?.newRequest}</h4>
                    </div>
                    <p className="mb-1">New Gym Requests</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 mb-4 ">
                <div className="card card-border-shadow-warning ">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2 pb-1">
                      <div className="avatar me-2">
                        <span className="avatar-initial rounded bg-label-warning">
                          <FontAwesomeIcon icon={faCoins} />
                        </span>
                      </div>
                      <h4 className="ms-1 mb-0">
                        <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                        {monthlyEarning}
                      </h4>
                    </div>
                    <p className="mb-1">Monthly Earnings</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 mb-4 ">
                <div className="card card-border-shadow-danger ">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2 pb-1">
                      <div className="avatar me-2">
                        <span className="avatar-initial rounded bg-label-danger">
                          <FontAwesomeIcon icon={faHourglassHalf} />
                        </span>
                      </div>
                      <h4 className="ms-1 mb-0">
                        <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                        {pending.response}
                      </h4>
                    </div>
                    <p className="mb-1">Pending Payments</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6  mb-4 order-2 order-xxl-2 ">
                <div className="card h-100">
                  <div className="card-header d-flex align-items-center justify-content-between mb-2">
                    <div className="card-title mb-0">
                      <h5 className="m-0 me-2">Most Active Gyms</h5>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="p-0 m-0">
                      {gymUsers?.mostActiveMembers?.length > 0 &&
                        gymUsers?.mostActiveMembers?.map((item, index) => (
                          <li key={index} className="d-flex mb-4 pb-1">
                            <div className="avatar flex-shrink-0 me-3">
                              <span className="avatar-initial rounded bg-label-primary">
                                <i className="ti ti-circle-check"></i>
                              </span>
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <h6 className="mb-0 fw-normal text-capitalize">
                                  {item?.gym?.Gym?.name ||
                                    item?.gym?.Gym?.full_name}
                                </h6>
                                <small className="text-success fw-normal d-block">
                                  <i className="ti ti-chevron-up mb-1"></i>
                                  {item?.activeMemberCount} Active Members
                                </small>
                              </div>
                              <div className="user-progress">
                                <h6 className="mb-0">{item?.count} Members</h6>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-6  mb-4 order-2 order-xxl-2 ">
                <div className="card h-100">
                  <div className="card-header d-flex align-items-center justify-content-between mb-2">
                    <div className="card-title mb-0">
                      <h5 className="m-0 me-2">Most Unactive Gyms</h5>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="p-0 m-0">
                      {gymUsers?.mostInactiveMembers?.length > 0 &&
                        gymUsers?.mostInactiveMembers?.map((item, index) => (
                          <li className="d-flex mb-4 pb-1">
                            <div className="avatar flex-shrink-0 me-3">
                              <span className="avatar-initial rounded bg-label-primary">
                                <i className="ti ti-circle-check"></i>
                              </span>
                            </div>
                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                              <div className="me-2">
                                <h6 className="mb-0 fw-normal text-capitalize">
                                  {item?.gym?.Gym?.name ||
                                    item?.gym?.Gym?.full_name}
                                </h6>
                                <small className="text-danger fw-normal d-block">
                                  <i className="ti ti-chevron-down mb-1"></i>
                                  {item?.inactivMemberCount} Inactive Members
                                </small>
                              </div>
                              <div className="user-progress">
                                <h6 className="mb-0">{item?.count} Members</h6>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-backdrop fade"></div>
      </div>
    </div>
  );
};

export default MainDashboard;
