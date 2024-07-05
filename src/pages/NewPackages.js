import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import PackagesPlaneModel from "../components/PackagesPlaneModel";
import axios from "axios";
import { App_host } from "../Data";
import PackagesModel from "../components/PackagesModel";

const NewPackages = () => {
  const [showPackages, setShowPackages] = useState(false);
  const [currentGymJoinedSate, setCurrentGymJoinedState] = useState({});
  const [endDateState, setEndDateState] = useState({});
  const [packageDays, setPackagesDays] = useState(0);
  const [toDay, setToDays] = useState(0);
  const [remainingDays, SetRemainingDays] = useState(0);
  const [showUpdatePackage, showUpdatePackages] = useState(false);
  const [activePackage, setActivePackage] = useState({});
  const [lastDate, setLastDate] = useState(0);
  const [isCustom, setIscustom] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({});
  const [plan, setPlan] = useState("");
  const [pkgUser, setPkgUser] = useState([]);

  const [packagesData, SetPackagesData] = useState([]);

  let user = JSON.parse(localStorage.getItem("user"));
  let token = localStorage.getItem("token");
  let activegym = localStorage.getItem("activegym");
  let role = localStorage.getItem("role");

  let handleShowpackageModel = () => {
    console.log("here");
    setShowPackages(!showPackages);
  };

  function getDateAfter30Days(inputDate) {
    // Get the current date

    var currentDate = new Date();

    // Add 30 days to the input date
    var dateAfter30Days = new Date(
      inputDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    // Check if the date is valid
    var isValid = dateAfter30Days > currentDate;
    console.log("inputDate", isValid ? dateAfter30Days : inputDate);

    // Return the result
    return {
      dateAfter30Days: isValid ? dateAfter30Days : inputDate,
      daysRemaining: daysRemainingToDate(
        new Date(isValid ? dateAfter30Days : inputDate)
      ),
      valid: isValid,
    };
  }

  function daysRemainingToDate(limitDate) {
    // Get the current date
    var currentDate = new Date();

    // Calculate the difference in milliseconds between the current date and the limit date
    var timeDifference = limitDate.getTime() - currentDate.getTime();

    // Convert the time difference from milliseconds to days
    var daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // Return the number of days remaining
    return daysRemaining;
  }

  function getLastDayOfMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const monthName = lastDay.toLocaleString("default", { month: "short" });
    const dayOfMonth = lastDay.getDate();
    const formattedDate = `${monthName} ${dayOfMonth}, ${year}`; // e.g., "Dec 30, 2024"
    setLastDate(formattedDate);
  }
  let filterDates = () => {
    const today = new Date();
    const currentDayOfMonth = today.getDate();
    setToDays(currentDayOfMonth);
    const totalDaysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    SetRemainingDays(totalDaysInMonth - currentDayOfMonth);
    const percentDaysPassed = (currentDayOfMonth / totalDaysInMonth) * 100;
    setPackagesDays(percentDaysPassed);
  };

  useEffect(() => {
    filterDates();
    getLastDayOfMonth();
  }, []);

  const HandleSHowUpdatePackageModel = () => {
    setIscustom(false);
    showUpdatePackages(!showUpdatePackage);
  };
  const HandleSHowUpdatePackageModelCustom = () => {
    setIscustom(true);
    showUpdatePackages(!showUpdatePackage);
  };

  const getActivePackage = async () => {
    try {
      const response = await axios.get(
        `${App_host}/packages/getActivePackage`,
        {
          params: {
            activegym: activegym,
          },
          headers: {
            token,
          },
        }
      );

      setActivePackage(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    getActivePackage();
  }, []);

  const [previousData, setPreviousData] = useState();
  const handleShowUpdatePackageModelEdit = (data) => {
    console.log("data", data);
    setPreviousData(data);
    showUpdatePackages(!showUpdatePackage);
  };

  console.log("packagesData===", packagesData);

  function addOneMonth(date) {
    let endDate = new Date(date);

    // Get the current day of the month
    let day = endDate.getDate();

    // Add one month to the date
    endDate.setMonth(endDate.getMonth() + 1);

    // If the original day does not exist in the new month, adjust the day
    // e.g., from January 31 to February 28 (or 29 in leap year)
    if (endDate.getDate() < day) {
      endDate.setDate(0);
    }

    return endDate;
  }
  function calculateDaysLeftPercentage(activeDate, endDate, type) {
    // Get the current date
    let currentDate = new Date();

    // Calculate the total number of days in the interval
    let totalDays = Math.floor((endDate - activeDate) / (1000 * 60 * 60 * 24));

    // Calculate the number of days left from current date to end date
    let daysLeft = Math.floor((endDate - currentDate) / (1000 * 60 * 60 * 24));

    // Calculate the percentage of days left
    let percentageLeft = (daysLeft / totalDays) * 100;

    // Ensure the percentage is not negative
    percentageLeft = Math.max(0, percentageLeft);

    if (type === "user") return { daysLeft, percentageLeft };
    if (type === "gym")
      return { gymDaysLeft: daysLeft, gymPercentageLeft: percentageLeft };
  }
  // days calculation
  const currentGymJoined = user?.BusinessLocation.find(
    (item) => item?.Gym?._id === activegym
  );

  const startDate = new Date(currentGymJoined?.active_date);
  const endDate = addOneMonth(startDate);
  let { daysLeft, percentageLeft } = calculateDaysLeftPercentage(
    startDate,
    endDate,
    "user"
  );

  const lastDateMemo = useMemo(() => {
    let inputDate = new Date(currentGymJoined?.active_date);
    return getDateAfter30Days(inputDate);
  }, [user, currentGymJoinedSate]);

  const daysPrgress = () => {
    const currentDAys = 30 - lastDateMemo?.daysRemaining;
    const totalDays = 30;
    const percent = (currentDAys / totalDays) * 100;
    return Math.round(percent);
  };

  let activePlan = async () => {
    try {
      let id = localStorage.getItem("activegym");
      let result = await axios.get(
        `${App_host}/gymPayment/gymActivePlan/${id}`
      );
      if (result) {
        setCurrentPlan(result.data.currentPlan);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { gymDaysLeft, gymPercentageLeft } = calculateDaysLeftPercentage(
    new Date(currentPlan.active_date),
    new Date(currentPlan.end_date),
    "gym"
  );
  console.log(gymDaysLeft, gymPercentageLeft);

  let activePkgUser = async () => {
    try {
      let id = JSON.parse(localStorage.getItem("user"))["_id"];
      let result = await axios.get(`${App_host}/user/activePkgUser/${id}`);
      const currentGymJoined = user?.BusinessLocation.find(
        (item) => item?.Gym?._id === activegym
      );

      let pkgData = result.data.response.filter(
        (pkg) => currentGymJoined?.package === pkg._id
      );
      console.log("data", result);
      setPkgUser(pkgData[0].price);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("act", pkgUser);
  useEffect(() => {
    activePlan();
    activePkgUser();
  }, []);
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y p-0">
        <div className="container">
          {user.isJimAdmin && (
            <>
              <div className="d-flex justify-content-end mb-3">
                <button
                  className="btn btn-primary me-2 mt-2 pointer"
                  onClick={handleShowpackageModel}
                >
                  All Packages
                </button>
                <button
                  className="btn btn-primary me-2 mt-2 pointer"
                  onClick={HandleSHowUpdatePackageModel}
                >
                  Add Package
                </button>
                <button
                  className="btn btn-primary me-2 mt-2 pointer"
                  onClick={HandleSHowUpdatePackageModelCustom}
                >
                  Add Custom Package
                </button>
              </div>
              <PackagesModel
                SetPackagesData={SetPackagesData}
                previousData={previousData}
                HandleSHowUpdatePackageModel={HandleSHowUpdatePackageModel}
                showUpdatePackage={showUpdatePackage}
                type={isCustom ? "custom" : null}
              />
            </>
          )}
          <div class="row">
            <div class="col-md-12">
              <div className="card mb-4">
                <h4 className="card-header">
                  <strong>Current Plan</strong>
                </h4>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-1">
                      <div className="mb-3">
                        <h6 className="mb-1">
                          Your Current Plan is{" "}
                          <strong>{activePackage?.name}</strong>
                        </h6>
                        <p>A simple start for everyone</p>
                      </div>
                      {user?.status === "active" && (
                        <div className="mb-3">
                          <h6 className="mb-1">
                            Active until {endDate.toLocaleDateString()}
                          </h6>
                          <p>
                            We will send you a notification upon Subscription
                            expiration
                          </p>
                        </div>
                      )}

                      <div className="mb-3">
                        <h6 className="mb-1">
                          <span className="me-2">
                            <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                            {role == "jimAdmin"
                              ? !currentPlan.amount
                                ? "no active plan"
                                : currentPlan.amount
                              : pkgUser}{" "}
                            Per Month
                          </span>
                        </h6>
                        <p>Standard plan for Gyms</p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-1">
                      {user?.status === "inactive" ? (
                        <div className="alert alert-warning mb-3" role="alert">
                          <h5 className="alert-heading mb-1">
                            We need your attention!
                          </h5>
                          <span>
                            <FontAwesomeIcon icon={faExclamationTriangle} /> You
                            are inactive since{" "}
                            {new Date(user?.inActive_date).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        lastDateMemo?.daysRemaining <= 5 && (
                          <div
                            className="alert alert-warning mb-3"
                            role="alert"
                          >
                            <h5 className="alert-heading mb-1">
                              We need your attention!
                            </h5>
                            <span>
                              <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
                              Your plan requires update
                            </span>
                          </div>
                        )
                      )}

                      <div className="plan-statistics">
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-2">Days</h6>
                          <h6 className="mb-2">
                            {role == "jimAdmin" && (
                              <>{Number(gymDaysLeft)} of 30 Days</>
                            )}

                            {role !== "jimAdmin" && (
                              <>{Number(daysLeft)} of 30 Days</>
                            )}
                          </h6>
                        </div>
                        <div className="progress">
                          <div
                            className="progress-bar"
                            style={{
                              width: `${
                                role == "jimAdmin"
                                  ? gymPercentageLeft.toFixed()
                                  : percentageLeft.toFixed()
                              }%`,
                            }}
                            role="progressbar"
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <p className="mt-1 mb-0">
                          {Number(role == "jimAdmin" ? gymDaysLeft : daysLeft)}{" "}
                          days remaining until your plan requires update
                        </p>
                      </div>
                    </div>
                    {!user.isJimAdmin && (
                      <div className="col-12">
                        <button
                          className="btn btn-primary me-2 mt-2 pointer"
                          onClick={handleShowpackageModel}
                        >
                          {user.isJimAdmin ? "All Packages " : "Upgrade Plan"}
                        </button>
                        {/* <button className="btn btn-label-danger cancel-subscription mt-2">Cancel Subscription</button> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PackagesPlaneModel
        SetPackagesData={SetPackagesData}
        packagesData={packagesData}
        handleShowUpdatePackageModelEdit={handleShowUpdatePackageModelEdit}
        showPackages={showPackages}
        activePackage={activePackage}
        handleShowpackage={handleShowpackageModel}
      />
    </>
  );
};

export default NewPackages;
