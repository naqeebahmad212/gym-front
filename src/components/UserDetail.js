import React, { useState } from "react";
import { App_host } from "../Data";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
const UserDetails = ({
  showDetails,
  handleShowDeatils,
  Data,
  type = "user",
}) => {

  let user = localStorage.getItem("user");


  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(Data);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  let image;

  if (type === "jim") {
    if (Data?.images && Data?.images?.length) {
      image = Data?.images[0];
    }
  } else {
    image = Data?.images;
  }

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "oldPassword") {
      setOldPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    }
  };

  const handleSubmit = async () => {
    let token = localStorage.getItem("token");

    console.log("editedData", editedData);

    if (user?.isAdmin) {
      const { _id, email } = editedData;

      try {
        const response = await axios.put(
          `${App_host}/user/updateUser`,
          {
            email,
            id: _id,
          },
          {
            headers: {
              token,
            },
          }
        );

        console.log("response", response);
        if (response?.data?.success) {
          let user = JSON.parse(localStorage.getItem("user"));

          user.email = response?.data?.data?.email;


          localStorage.setItem("user", JSON.stringify(user));
          toast.success("User Updated successfully!", {
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
        } else {
          toast.error(response?.data?.message, {
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
      } catch (err) {
        console.log(err);
      } finally {
        setIsEditing(false);
      }
    }

    else {
      const { _id, email, phone, city, full_name } = editedData;

      try {
        const response = await axios.put(
          `${App_host}/user/updateUser`,
          {
            email,
            phone,
            city,
            full_name,
            id: _id,
          },
          {
            headers: {
              token,
            },
          }
        );

        console.log("response", response);
        if (response?.data?.success) {
          let user = JSON.parse(localStorage.getItem("user"));

          user.email = response?.data?.data?.email;
          user.phone = response?.data?.data?.phone;
          user.city = response?.data?.data?.city;
          user.full_name = response?.data?.data?.full_name;

          localStorage.setItem("user", JSON.stringify(user));
          toast.success("User Updated successfully!", {
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
        } else {
          toast.error(response?.data?.message, {
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
      } catch (err) {
        console.log(err);
      } finally {
        setIsEditing(false);
      }
    }

  };
  const handlePasswordSubmit = async (e) => {

    e.preventDefault();

    let user = JSON.parse(localStorage.getItem("user"));

    console.log(user)

    if (!oldPassword) {
      alert("Old password is required")
      return
    }
    if (!newPassword) {
      alert("New password is required")
      return
    }

    try {
      const response = await axios.put(
        `${App_host}/user/updatePassword/${user?._id}`,
        {
          oldPassword,
          newPassword,

        },

      );


      console.log("response", response?.data)

      if (response?.data?.success) {

        toast.success("Password Updated successfully!", {
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
      } else {
        alert(response?.data?.message)
        // toast.error(response?.data?.message, {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        //   transition: Bounce,
        // });
      }
    }

    catch (err) {
      console.log('err', err)
    }
    finally {
      setIsEditing(false);
    }
    // Add password change logic here
    // Use oldPassword and newPassword states to send the request to change password
    // You can use a similar axios request as in handleSubmit for changing password
  };


  return (
    <>
      {Data && (
        <div
          className={`modal fade ${showDetails ? "show" : ""}`}
          id="pricingModal"
          style={{ display: showDetails ? "block" : "none" }}
          role="dialog"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-xl modal-simple modal-pricing">
            <div className="modal-content">
              <div className="modal-body">
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleShowDeatils}
                ></button>
                <div className="row  ">
                  <div className=" mb-3" style={{ borderRadius: ".5rem" }}>
                    <div className="row g-0">
                      <div
                        className="col-md-4 gradient-custom text-center text-white"
                        style={{
                          borderTopLeftRadius: ".5rem",
                          borderBottomLeftRadius: ".5rem",
                        }}
                      >
                        {/* <img
                          src={
                            image
                              ? image
                              : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                          }
                          alt="Avatar"
                          className="img-fluid my-5"
                          style={{ width: "120px", height: "150px" }}
                        /> */}
                        <h5 className="mt-5">{type === "user" ? Data?.full_name : Data?.name}</h5>
                        {isEditing ? (
                          <button className="btn btn-info" onClick={handleSubmit}>Save</button>
                        ) : (
                          <button className="btn btn-info" onClick={handleEdit}>Edit personal info</button>
                        )}
                      </div>
                      <div className="col-md-8">
                        <div className="card-body p-4">
                          {isEditing ? (
                            <form>
                              <h6>Edit personal information</h6>
                              <hr className="mt-0 mb-4" />
                              <div className="row pt-1">
                                {!Data?.isAdmin && <div className="col-md-6 col-sm-12 mb-3">
                                  <h6>Name</h6>
                                  <input
                                    type="text"
                                    name="full_name"
                                    value={editedData?.full_name}
                                    onChange={handleChange}
                                  />
                                </div>}

                                <div className="col-md-6 col-sm-12 mb-3">
                                  <h6>Email</h6>
                                  <input
                                    type="text"
                                    name="email"
                                    value={editedData?.email}
                                    onChange={handleChange}
                                  />
                                </div>
                                {!Data?.isAdmin && <div className="col-md-6 col-sm-12 mb-3">
                                  <h6>Phone</h6>
                                  <input
                                    type="text"
                                    name="phone"
                                    value={editedData?.phone}
                                    onChange={handleChange}
                                  />
                                </div>}

                                {!Data?.isAdmin && <div className="col-md-6 col-sm-12 mb-3">
                                  <h6>City</h6>
                                  <input
                                    type="text"
                                    name="city"
                                    value={editedData?.city}
                                    onChange={handleChange}
                                  />
                                </div>}

                                <div className="col-md-6 col-sm-12 mb-3">
                                  <h6>Old Password</h6>
                                  <input
                                    type="password"
                                    name="oldPassword"
                                    value={oldPassword}
                                    onChange={handlePasswordChange}
                                  />
                                </div>
                                <div className="col-md-6 col-sm-12 mb-3">
                                  <h6>New Password</h6>
                                  <input
                                    type="password"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                  />
                                </div>
                              </div>
                              <button className="btn btn-info" onClick={handlePasswordSubmit}>
                                Update details
                              </button>
                            </form>
                          ) : (
                            <>
                              <h6>Edit personal information</h6>
                              <hr className="mt-0 mb-4" />
                              <div className="row pt-1">
                                {!Data?.isAdmin && <div className="col-md-6 col-sm-12 mb-3">
                                  <h6>Name</h6>
                                  <p className="text-muted">{Data?.full_name}</p>
                                </div>}

                                <div className="col-md-6 col-sm-12 mb-3">
                                  <h6>Email</h6>
                                  <p className="text-muted">{Data?.email}</p>
                                </div>

                                {!Data?.isAdmin && <div className="col-md-6 col-sm-12 mb-3">
                                  <h6>Phone</h6>
                                  <p className="text-muted">{Data?.phone}</p>
                                </div>}


                                {!Data?.isAdmin && <div className="col-md-6 col-sm-12 mb-3">
                                  <h6>City</h6>
                                  <p className="text-muted">{Data?.city}</p>
                                </div>}


                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetails;
