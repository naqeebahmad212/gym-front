import axios from "axios";
import React, { useEffect, useState } from "react";
import { App_host } from "../Data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faCoins,
  faCubes,
  faHourglassHalf,
  faIndianRupeeSign,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import PeakHoursChart from "./shared/PeakHoursChart";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const JimAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useState(0);
  const [pendingUser, setPendinguser] = useState(0);
  const [totalUser, settotalUser] = useState(0);
  const [dashBoardData, setDashboardData] = useState();
  const [payment, setPayment] = useState("");
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [singleGymTotalEarnings, setSingleGymTotalEarnings] = useState(0);
  const [singleGymLastMonthEarnings, setSingleGymLastMonthEarnings] =
    useState(0);
  const [currentGymExpenses, setCurrentGymExpenses] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [totalEarnings, setTotalEarning] = useState(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);

  const token = localStorage.getItem("token");
  const activegym = localStorage.getItem("activegym");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let user = JSON.parse(localStorage.getItem("user"));
  let getActiveUser = async () => {
    const response = await axios.get(`${App_host}/user/getAllBusinessUser`, {
      params: {
        BusinessLocation: activegym,
      },
      headers: {
        token,
      },
    });

    console.log(" getAllBusinessUser ", response.data?.data);

    const activeuser = await axios.get(`${App_host}/attendence/getActiveUser`, {
      params: {
        jimId: activegym,
      },
      headers: {
        token: token,
      },
    });
    if (activeuser) {
      const users = response.data?.data.results;

      console.log("users", users);
      settotalUser(users.length);

      // Filter for active users based on BusinessLocation status

      // Filter for active users based on BusinessLocation status
      const activeUsersLength = users.filter((user) =>
        user.BusinessLocation.some(
          (gym) => gym.Gym === activegym && gym.status === "active"
        )
      ).length;

      // Filter for pending users based on BusinessLocation status
      const pendingUsersLength = users.filter((user) =>
        user.BusinessLocation.some(
          (gym) => gym.Gym === activegym && gym.status === "pending"
        )
      ).length;
      setActiveUser(activeUsersLength);
      setPendinguser(pendingUsersLength);

      console.log("pendingUsersLength", pendingUsersLength);
    }
  };

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
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getPaymentNotPay = async () => {
    try {
      let activeGymItem = localStorage.getItem("activegym");
      let result = await axios.get(
        `http://localhost:8000/v1/gymPayment/getPaymentGym/${activeGymItem}`
      );
      setPayment(result.data.response["amount"]);
      if (result.data.response["payment_status"] === "unpaid") {
        setShow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getSingleGymEarnings = async () => {
    const response = await axios.get(`${App_host}/earning/single-gym-earning`, {
      headers: {
        token,
      },
      params: {
        gymId: activegym,
      },
    });
    setSingleGymTotalEarnings(response.data.totalPackagePrice);
    setSingleGymLastMonthEarnings(response.data.lastMonthEarning);
    setCurrentGymExpenses(response.data.currentGymExpenses);
    setTotalPendingAmount(response.data.totalPendingAmount);
  };

  useEffect(() => {
    getActiveUser();
    getPackagesList();
    getPaymentNotPay();
  }, [getActiveUser, paymentSuccessful]);

  useEffect(() => {
    getSingleGymEarnings();
  }, []);

  const paymentNow = async () => {
    try {
      let activeGymItem = localStorage.getItem("activegym");
      let result = await axios.put(
        `http://localhost:8000/v1/gymPayment/gymPaymentUpdate/${activeGymItem}`
      );
      if (result.data.success) {
        setShow(false);
        toast.success(` payment successfully!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        navigate("/payment");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async () => {
    const orderUrl = App_host + "/gymPayment/create-order";
    const { data } = await axios.post(orderUrl, { amount: payment }); // Amount in INR

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Flex Flow",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: data.id,
      handler: async function (response) {
        const verifyUrl = App_host + "/gymPayment/verify-payment";
        const { data } = await axios.post(verifyUrl, {
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
        if (data.success) {
          paymentNow();
          setPaymentSuccessful(true);
        } else {
          toast.error(` payment verification failed!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      },
      prefill: {
        // name: activeUser.name,
        // email: "john.doe@example.com",
        // contact: "9999999999",
      },
      notes: {
        address: "Corporate Office",
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row">
            <div className="col-xl-6 mb-4 col-lg-6 col-12">
              <div className="card">
                <div className="d-flex align-items-end row">
                  <div className="col-7">
                    <div className="card-body text-nowrap">
                      <h5 className="card-title mb-0 px-3">
                        Welcome {user.full_name}! 💪
                      </h5>
                      <p>{user?.BusinessLocation[0]?.name} </p>
                    </div>
                  </div>
                  <div className="col-5 text-center text-sm-left">
                    <div className="card-body pb-0 px-0 px-md-4">
                      <img
                        src="../assets/img/illustrations/card-advance-sale.png"
                        height="140"
                        alt="view sales"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {show && (
              <Modal
                backdrop="static"
                show={show}
                onHide={handleClose}
                animation={false}
              >
                <Modal.Header>
                  <Modal.Title>Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <h2>payment now</h2>
                  <h3>
                    <FontAwesomeIcon icon={faIndianRupeeSign} />
                    {payment}
                  </h3>
                  <Button variant="primary" onClick={handlePayment}>
                    Pay now
                  </Button>
                </Modal.Body>
              </Modal>
            )}

            <div className="col-xl-6 mb-4 col-lg-6 col-12">
              <div className="card h-100">
                <div className="card-header">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="card-title mb-0">Statistics</h5>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row gy-3">
                    <div className="col-md-6 col-6">
                      <div className="d-flex align-items-center">
                        <div className="badge rounded-pill bg-label-primary me-3 p-2">
                          <FontAwesomeIcon icon={faClockRotateLeft} />
                        </div>
                        <div className="card-info">
                          <h5 className="mb-0">{activeUser}</h5>
                          <small>Active Users</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-6">
                      <div className="d-flex align-items-center">
                        <div className="badge rounded-pill bg-label-info me-3 p-2">
                          <i className="ti ti-users ti-sm"></i>
                        </div>
                        <div className="card-info">
                          <h5 className="mb-0">{totalUser}</h5>
                          <small>Total Users</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-3 mb-4">
                <div className="card card-border-shadow-primary">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2 pb-1">
                      <div className="avatar me-2">
                        <span className="avatar-initial rounded bg-label-primary">
                          <FontAwesomeIcon icon={faUserClock} />{" "}
                        </span>
                      </div>
                      <h4 className="ms-1 mb-0">{pendingUser}</h4>
                    </div>
                    <p className="mb-1">New Requests</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3 mb-4">
                <div className="card card-border-shadow-warning">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2 pb-1">
                      <div className="avatar me-2">
                        <span className="avatar-initial rounded bg-label-warning">
                          <FontAwesomeIcon icon={faCoins} />
                        </span>
                      </div>
                      <h4 className="ms-1 mb-0">
                        {" "}
                        <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                        {singleGymLastMonthEarnings}
                      </h4>
                    </div>
                    <p className="mb-1">Monthly Earnings</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3 mb-4">
                <div className="card card-border-shadow-danger">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2 pb-1">
                      <div className="avatar me-2">
                        <span className="avatar-initial rounded bg-label-danger">
                          <FontAwesomeIcon icon={faHourglassHalf} />
                        </span>
                      </div>
                      <h4 className="ms-1 mb-0">
                        <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                        {totalPendingAmount}
                      </h4>
                    </div>
                    <p className="mb-1">Pending Payments</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3 mb-4">
                <div className="card card-border-shadow-info">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2 pb-1">
                      <div className="avatar me-2">
                        <span className="avatar-initial rounded bg-label-info">
                          <FontAwesomeIcon icon={faCubes} />
                        </span>
                      </div>

                      <h4 className="ms-1 mb-0">
                        {dashBoardData?.TotalPackages}
                      </h4>
                    </div>
                    <p className="mb-1">Total Packages</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-xl-12 mb-4">
              <div className="row">
                {/* <div className="card-body p-0">
                                    <div className="row row-bordered g-0">
                                        <div className="col-md-12 position-relative p-4"> */}
                <div className="col-12 ">
                  <h5 className="m-0 card-title">Peak Hours</h5>
                </div>
                <div className="col-12 col-xl-12 mb-4">
                  <div className="row">
                    <div className="col-12 col-md-12 mx-auto">
                      <PeakHoursChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        <div className="content-backdrop fade"></div>
      </div>
    </>
  );
};

export default JimAdminDashboard;
