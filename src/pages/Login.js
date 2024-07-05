import React from "react";
import logo from "../assets/log-Img.jpg";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { App_host } from "../Data";

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${App_host}/user/loginUser`, values);
      const { data } = response;

      console.log("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.info));
      if (!data.data.info.isAdmin) {
        let Gym = data.data.info?.BusinessLocation[0]?.Gym;
        localStorage.setItem(
          "activegym",
          data.data.info?.BusinessLocation[0]?.Gym?._id.toString()
        );
        localStorage.setItem("gymDetail", JSON.stringify(Gym));
      }
      localStorage.setItem("token", data.data.token);

      const { isAdmin, isJimAdmin } = data.data.info;
      if (isAdmin) {
        localStorage.setItem("role", "admin");
      } else if (isJimAdmin) {
        localStorage.setItem("role", "jimAdmin");
      } else {
        localStorage.setItem("role", "user");
      }

      // if (data?.success) {
      toast.success("Login Successfully", {
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
      // }
      // navigate("/")
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      console.log("error.response.data.message", error);
      toast.error(
        error?.response?.data?.message
          ? "Invalid credential"
          : "Login failed. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="login-container relative">
        <div className="left-content d-sm-flex justify-content-center ">
          {/* <div className="left-content-inner">
            <h3 className="flexFlow">
              Flex flow:
              <span className="flexText">
                Discover, Connect, and Achieve Your Fitness Goals with Ease Through
                Our Comprehensive Gym Network and User-Friendly Platform
              </span>
            </h3>
          </div> */}
        </div>

        <div className="right-content row">
          <div className="right-content-inner row">
            <div className="logimg">
              {/* <img src={logo} alt="Logo" /> */}
              {/* <div id="logtext" >
                Securely log in to your account for personalized access and
                services.
              </div> */}
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              <Form className="form-group">
                <label htmlFor="email">E-Mail Address</label>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                />

                <label htmlFor="password">Password</label>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                />

                <button type="submit" className="btn1">
                  Login
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
