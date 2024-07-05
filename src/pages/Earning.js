import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  faCoins,
  faFaceFrown,
  faIndianRupeeSign,
  faLandmark,
  faMapMarker,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { App_host } from "../Data";
import GymsPopup from "../components/GymsPopup";
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import EarningPopup from "../components/EarningPopup";
import GymUserPayments from "../components/GymUserPayments";

const Earning = () => {
  let [expenseData, setExpenseData] = useState({});

  const [jim, setJim] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nearby, setNearby] = useState(false);
  const [gymId, setGymId] = useState("");
  const [singleGymTotalEarnings, setSingleGymTotalEarnings] = useState(0);
  const [updateUserPaymentMethod, setUpdateUserPaymentMethod] = useState(false);
  const [singleGymLastMonthEarnings, setSingleGymLastMonthEarnings] =
    useState(0);
  const [onlinePaidUsers, setOnlinePaidUsers] = useState([]);
  const [currentGymExpenses, setCurrentGymExpenses] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [totalEarnings, setTotalEarning] = useState(0);
  const [monthlyEarnings, setMonthlyEarning] = useState("");
  const [gymMonthlyEarnings, setGymMonthlyEarning] = useState("");
  const [gymTotalEarnings, setGymTotalEarning] = useState("");
  const [gymHistory, setGymHistory] = useState([]);
  const [gymAllHistory, setGymAllHistory] = useState([]);
  const [plan, setPlan] = useState(0);
  const [expense, setExpense] = useState(0);

  const itemsPerPage = 12;

  const [showPackages, setShowPackages] = useState(false);
  let token = localStorage.getItem("token");
  let user = JSON.parse(localStorage.getItem("user"));
  const getPackagesList = async () => {
    try {
      const response = await axios.get(`${App_host}/earning/getEarninDetail`, {
        headers: {
          token,
        },
      });
      setExpenseData(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const totalEarning = async () => {
    try {
      const response = await axios.get(`${App_host}/earning/getEarninDetail`, {
        headers: {
          token,
        },
      });

      setTotalEarning(response?.data["totalEarnings"]);
    } catch (error) {
      console.error("Error total earning:", error);
    }
  };
  const monthlyEarning = async () => {
    try {
      const response = await axios.get(`${App_host}/earning/monthlyEarning`, {
        headers: {
          token,
        },
      });
      setMonthlyEarning(response?.data["monthlyEarnings"]);
    } catch (error) {
      console.error("Error monthly earning:", error);
    }
  };
  useEffect(() => {
    getPackagesList();
    totalEarning();
    monthlyEarning();
  }, []);
  useEffect(() => {
    const fetchJim = async () => {
      try {
        const response = await axios.get(
          `${App_host}/Jim/getAllBusinessLocation?page=${currentPage}&limit=${itemsPerPage}`
        );
        setJim(response.data.data.businessLocations.results);
        setTotalPages(response.data.data.businessLocations.totalPages);
      } catch (error) {
        console.error("Error fetching gym data:", error);
      }
    };

    fetchJim();
  }, [currentPage]); // Reload when currentPage changes

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  let handleShowDeatils = (id) => {
    setShowDetails(!showDetails);
    setGymId(id);
  };
  let getGymId = localStorage.getItem("activegym");
  let role = localStorage.getItem("role");

  const getSingleGymEarnings = async () => {
    const response = await axios.get(`${App_host}/earning/single-gym-earning`, {
      headers: {
        token,
      },
      params: {
        gymId: getGymId,
      },
    });
    setSingleGymTotalEarnings(response.data.totalPackagePrice);
    setSingleGymLastMonthEarnings(response.data.lastMonthEarning);
    setOnlinePaidUsers(response.data.allGymUsersWhoPaidOnline);
    setCurrentGymExpenses(response.data.currentGymExpenses);
  };

  useEffect(() => {
    getSingleGymEarnings();
  }, [updateUserPaymentMethod]);

  const gymPaymentTotal = async () => {
    const params = {
      key1: "value1",
      key2: "value2",
    };

    try {
      let getGymId = JSON.parse(localStorage.getItem("user"))[
        "BusinessLocation"
      ][0]["Gym"]["Owner"];
      let result = await axios.get(`${App_host}/earning/EarningGymTotal`, {
        params: {
          gymId: getGymId,
        },
        headers: {
          token,
        },
      });
      console.log(result, "skdjf");
      if (result) {
        setGymTotalEarning(result.data.response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const gymPaymentMonthly = async () => {
    try {
      let getGymId = JSON.parse(localStorage.getItem("user"))[
        "BusinessLocation"
      ][0]["Gym"]["Owner"];
      let result = await axios.get(
        `${App_host}/earning/gymEarningMonthly/${getGymId}`,
        {
          headers: {
            token,
          },
        }
      );
      if (result) {
        setGymMonthlyEarning(result.data.monthlyEarnings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const gymMonthHistory = async () => {
    try {
      let result = await axios.get(
        `${App_host}/earning/gymMonthlyAllEarningHistory`,
        {
          headers: {
            token,
          },
        }
      );
      setGymAllHistory(result.data.monthlyEarnings);
    } catch (error) {
      console.log(error);
    }
  };

  const gymMonthAllHistory = async () => {
    try {
      let getGymId = localStorage.getItem("activegym");
      let result = await axios.get(
        `${App_host}/earning/gymMonthlyEarningHistory/${getGymId}`,
        {
          headers: {
            token,
          },
        }
      );
      setGymHistory(result.data.monthlyEarnings);
    } catch (error) {
      console.log(error);
    }
  };

  const activePlan = async () => {
    try {
      let id = localStorage.getItem("activegym");
      if (!id) {
        console.error("No activegym ID found in localStorage");
        return;
      }
      let result = await axios.get(
        `${App_host}/gymPayment/gymActivePlan/${id}`
      );
      console.log("Result from API:", result);
      if (result && result.data && result.data.response) {
        let amount = parseFloat(result.data.response.amount);
        if (isNaN(amount)) {
          console.error(
            "Invalid amount received from API:",
            result.data.response.amount
          );
        } else {
          setPlan(amount);
        }
      } else {
        console.error("Unexpected response structure:", result);
      }
    } catch (error) {
      console.error("Error fetching active plan:", error);
    }
  };

  useEffect(() => {
    activePlan();
  }, []);

  // useEffect(() => {
  //   if (!isNaN(totalEarning) && !isNaN(plan)) {
  //     if (totalEarning >= plan) {
  //       let total = totalEarning - plan;
  //       setExpense(total);
  //       console.log("Expense calculated:", total);
  //     }
  //   } else {
  //     console.error(
  //       "Invalid values for totalEarning or plan:",
  //       totalEarning,
  //       plan
  //     );
  //   }
  // }, [totalEarning, plan]);
  // console.log(expense);

  console.log(singleGymTotalEarnings, "skdjf");
  useEffect(() => {
    gymPaymentTotal();
    gymPaymentMonthly();
    gymMonthHistory();
    gymMonthAllHistory();
  }, [gymPaymentTotal, gymMonthHistory, gymMonthAllHistory]);
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="col-lg-12 mb-4 order-md-0 order-lg-0">
          <div className="card h-100">
            <div className="card-header pb-0 d-flex justify-content-between mb-lg-n4">
              <div className="card-title mb-5">
                <h5 className="mb-0">Earning Reports</h5>
                <small className="text-muted">Monthly Earnings Overview</small>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 col-md-4 d-flex flex-column align-self-end">
                  <div className="d-flex gap-2 align-items-center mb-2 pb-1 flex-wrap">
                    <h1 className="mb-0">
                      <FontAwesomeIcon icon={faIndianRupeeSign} />
                      {role === "jimAdmin"
                        ? !singleGymTotalEarnings
                          ? " no earning"
                          : singleGymTotalEarnings
                        : totalEarnings}
                    </h1>
                  </div>
                  <small className="text-muted">
                    this Month compared to last Month
                  </small>
                </div>
              </div>

              <div className="border rounded p-3 mt-2">
                <div className="row gap-4 gap-sm-0">
                  <div className="col-12 col-sm-4">
                    <div className="d-flex gap-2 align-items-center">
                      <div className="badge rounded bg-label-primary p-1">
                        <FontAwesomeIcon icon={faCoins} />
                      </div>
                      <h6 className="mb-0">Total Earnings</h6>
                    </div>
                    <h4 className="my-2 pt-1">
                      <FontAwesomeIcon icon={faIndianRupeeSign} />
                      {role === "jimAdmin"
                        ? !singleGymTotalEarnings
                          ? " no earnings"
                          : singleGymTotalEarnings - currentGymExpenses
                        : totalEarnings}
                    </h4>
                    <div
                      className="progress w-75"
                      style={{ height: "4px" }}
                    ></div>
                  </div>
                  <div className="col-12 col-sm-4">
                    <div className="d-flex gap-2 align-items-center">
                      <div className="badge rounded bg-label-primary p-1">
                        <FontAwesomeIcon icon={faCoins} />
                      </div>
                      <h6 className="mb-0">Monthly Earnings</h6>
                    </div>
                    <h4 className="my-2 pt-1">
                      <FontAwesomeIcon icon={faIndianRupeeSign} />
                      {role === "jimAdmin"
                        ? !singleGymLastMonthEarnings
                          ? " no earning"
                          : singleGymLastMonthEarnings
                        : monthlyEarnings}
                    </h4>
                    <div
                      className="progress w-75"
                      style={{ height: "4px" }}
                    ></div>
                  </div>
                  {!user.isAdmin && (
                    <div className="col-12 col-sm-4">
                      <div className="d-flex gap-2 align-items-center">
                        <div className="badge rounded bg-label-danger p-1">
                          <FontAwesomeIcon icon={faLandmark} />
                        </div>
                        <h6 className="mb-0">Total Expense</h6>
                      </div>
                      <h4 className="my-2 pt-1">
                        <FontAwesomeIcon icon={faIndianRupeeSign} />
                        {currentGymExpenses}
                      </h4>
                      <div
                        className="progress w-75"
                        style={{ height: "4px" }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {role === "admin" && (
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="col-lg-12 mb-4 order-md-0 order-lg-0">
            <div
              className="card h-100"
              style={{
                overflowY: "auto",
                whiteSpace: "nowrap",
              }}
            >
              <div className="card-header pb-0 d-flex justify-content-between mb-lg-n4">
                <div className="card-title mb-5">
                  <h5 className="mb-0">Gyms Payments Report</h5>
                  <small className="text-muted">Payment Overview</small>
                </div>
              </div>
              <div className="card-body">
                <GymUserPayments
                  setUserMethod={setUpdateUserPaymentMethod}
                  users={onlinePaidUsers}
                  role="admin"
                  activeGym={getGymId}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {role === "jimAdmin" && (
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="col-lg-12 mb-4 order-md-0 order-lg-0">
            <div className="card h-100">
              <div className="card-header pb-0 d-flex justify-content-between mb-lg-n4">
                <div className="card-title mb-5">
                  <h5 className="mb-0">Gyms Payments Report</h5>
                  <small className="text-muted">Payment Overview</small>
                </div>
              </div>
              <div className="card-body">
                <GymUserPayments
                  users={onlinePaidUsers}
                  role="jimAdmin"
                  activeGym={getGymId}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Earning;
