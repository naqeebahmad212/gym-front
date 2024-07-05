import axios from "axios";
import React from "react";
import { App_host } from "../Data";

const GymUserPayments = ({ users, role, activeGym, setUserMethod }) => {
  const updateUserPaymentMethod = async (user, pkgId) => {
    const response = await axios.put(
      `${App_host}/user/updateUserPaymentMethod`,
      {},
      {
        params: {
          userId: user._id,
          pkgId,
        },
      }
    );
    setUserMethod(true);
  };
  return (
    <div
      className="container mt-5"
      style={{
        overflowY: "auto",
        whiteSpace: "nowrap",
      }}
    >
      <h2>Users and Business Locations</h2>
      <table
        className="table table-striped"
        style={{
          width: "1500px",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Business Locations</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => {
            const isCurrentGymPayment = user.BusinessLocation.find(
              (location, index) => location.Gym._id === activeGym
            );
            if (role === "jimAdmin" && !isCurrentGymPayment) return;
            return (
              <tr key={user._id}>
                <td className="">{user.full_name}</td>
                <td>
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th className="truncate-single-line mb-2">Gym</th>
                        <th className="truncate-single-line">Package</th>
                        <th className="truncate-single-line">Price</th>
                        {role === "admin" && (
                          <th className="truncate-single-line">
                            Payment Method
                          </th>
                        )}
                        {role === "jimAdmin" && (
                          <th className="truncate-single-line">Status</th>
                        )}

                        <th className="truncate-single-line">
                          Activation Date
                        </th>

                        {role === "admin" && (
                          <th className="truncate-single-line">Action</th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {user.BusinessLocation.map((location, index) => {
                        if (location.paymentMethod !== "online") return;

                        if (
                          role === "jimAdmin" &&
                          location.Gym._id !== activeGym
                        )
                          return;
                        return (
                          <tr
                            key={index}
                            style={{
                              cursor: "pointer",

                              padding: "5px",
                            }}
                          >
                            <td className="truncate-single-line">
                              {location.Gym?.name}
                            </td>
                            <td className="truncate-single-line">
                              {location.package?.name}
                            </td>
                            <td className="truncate-single-line">
                              {location.package?.price}
                            </td>
                            {role === "admin" && (
                              <td className="truncate-single-line">
                                {location.paymentMethod}
                              </td>
                            )}
                            {role === "jimAdmin" && (
                              <td className="truncate-single-line">
                                {location.paymentMethod === "online"
                                  ? "pending"
                                  : "paid"}
                              </td>
                            )}

                            <td className="truncate-single-line">
                              {location.active_date
                                ? new Date(
                                    location.active_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            {role === "admin" && (
                              <td className="truncate-single-line">
                                <button
                                  onClick={() => {
                                    updateUserPaymentMethod(
                                      user,
                                      location.package._id
                                    );
                                  }}
                                  type="button"
                                  className="btn btn-primary"
                                  style={{ marginTop: "20px" }}
                                >
                                  Pay
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GymUserPayments;
