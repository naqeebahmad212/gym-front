import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import PackagesModel from "../components/PackagesModel";
import { App_host } from "../Data";

const Packages = () => {
  const [showModal, setShowModal] = useState(false);
  const [packagesData, SetPackagesData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [activePackage, setActivePackage] = useState({});
  const activegym = localStorage.getItem("activegym");
  let user = JSON.parse(localStorage.getItem("user"));
  let token = localStorage.getItem("token");

  const [filterPackages, setFilterPackages] = useState(
    user.isJimAdmin ? "mypackages" : null
  );

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handlePageChange = (page) => {
    setPage(page);
  };
  let params = {
    page,
    limit,
    search: search.trim(),
  };
  if (user.isAdmin) {
    params["is_admin_package"] = true;
  } else if (user.isJimAdmin || !user.isJimAdmin) {
    params["is_jim_package"] = true;
    params["BusinessLocation"] = activegym;
    params["is_admin_package"] = false;
    if (filterPackages == "adminpackages") {
      params["is_admin_package"] = true;
      params["is_jim_package"] = false;
      params["BusinessLocation"] = null;
    }
  }

  const getPackagesList = async () => {
    try {
      const response = await axios.get(`${App_host}/packages/getPackages`, {
        params: params,
        headers: {
          token,
        },
      });
      console.log("rrrrrrrrrrrrrrrr", response);

      let { results, ...otherPages } = response.data.data;
      SetPackagesData(results);
      setTotalPages(otherPages.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const getActivePackage = async () => {
    try {
      const response = await axios.get(
        `${App_host}/packages/getActivePackage`,
        {
          params: params,
          headers: {
            token,
          },
        }
      );
      console.log("Active vvvvvvvvvvvvvvvvvvvvvvvv", response);
      setActivePackage(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    getPackagesList();
    getActivePackage();
  }, [page, filterPackages]);

  let SubscribePackage = async (packageId) => {
    try {
      let Data = {
        id: packageId,
        jimId: user.BusinessLocation[0]._id.toString(),
      };
      const response = await axios.post(
        `${App_host}/packages/subscribePackage`,
        Data,
        {
          headers: {
            token: token,
          },
        }
      );

      if (response?.data?.success) {
        toast.success("Package subscribed successfully!", {
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
        toast.error("An Error Occured ", {
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
    } catch (error) {
      console.log("error.response.data.message", error);
      toast.error(error?.response?.data?.message, {
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
  };
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="container">
          <div className="row d-flex justify-content-end ">
            {(user.isAdmin || user.isJimAdmin) && (
              <div className="col-3 d-flex justify-content-end mb-3">
                <button
                  type="button"
                  className="btn btn-primary "
                  onClick={handleOpenModal}
                >
                  Add Package
                </button>
              </div>
            )}
          </div>
        </div>

        <PackagesModel
          show={showModal}
          handleClose={handleCloseModal}
          getPackagesList={getPackagesList}
        />
        <div class="row">
          <div class="col-xl-9 mb-3 mb-xl-0">
            <h3>All Packages</h3>
            {user.isJimAdmin && (
              <div className="mb-3">
                <select
                  className="form-select"
                  value={filterPackages}
                  onChange={(e) => setFilterPackages(e.target.value)}
                >
                  <option value="mypackages">My Packages</option>
                  <option value="adminpackages">Packages for Gym</option>
                </select>
              </div>
            )}
            <ul class="list-group">
              {packagesData.length > 0 ? (
                packagesData.map((item) => {
                  return (
                    <li class="list-group-item p-4">
                      <div class="d-flex gap-3">
                        <div class="flex-grow-1">
                          <div class="row">
                            <div class="col-md-8">
                              <a href="javascript:void(0)" class="text-body">
                                <p>{item.name}</p>
                              </a>
                              <div class="text-muted mb-1 d-flex flex-wrap">
                                <span class="me-1">Duration</span>{" "}
                                <a href="javascript:void(0)" class="me-3">
                                  Monthly
                                </a>{" "}
                                {user.isAdmin ||
                                filterPackages == "mypackages" ? (
                                  <></>
                                ) : (
                                  <span
                                    class="badge bg-label-success"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      SubscribePackage(item._id.toString())
                                    }
                                  >
                                    Subscribe Package
                                  </span>
                                )}
                              </div>
                              <div class="text-muted mb-1 d-flex flex-wrap">
                                <span class="me-1">
                                  Description: {item.description}
                                </span>{" "}
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="text-md-end">
                                <div class="my-2 my-lg-4">
                                  <span class="text-primary">
                                    ${item.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li class="list-group-item p-4">
                  <div class="d-flex gap-3">
                    <div class="flex-grow-1">
                      <div class="row">
                        <div class="col-md-8">
                          <div class="text-muted mb-1 d-flex flex-wrap">
                            <span class="me-1">
                              No available Package to show
                            </span>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )}
            </ul>
            {totalPages > 1 && (
              <div className="row mt-4">
                <div className="col-lg-12 d-flex justify-content-center">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageno) => (
                          <li
                            key={pageno}
                            className={`page-item ${
                              page === pageno ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pageno)}
                            >
                              {pageno}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
          <div class="col-xl-3">
            <h4>Active Package</h4>
            {activePackage ? (
              <div class="border rounded p-4 pb-3">
                <h6>Price Details</h6>
                <dl class="row mb-0">
                  <dt class="col-6 fw-normal text-heading">Name</dt>
                  <dd class="col-6 text-end">{activePackage.name}</dd>

                  <dt class="col-sm-6 text-heading fw-normal">Duration</dt>
                  <dd class="col-sm-6 text-end">
                    Monthly <span class="badge bg-label-success ms-1"></span>
                  </dd>
                </dl>
                <hr class="mx-n4" />
                <dl class="row mb-0">
                  <dt class="col-6 text-heading">Total</dt>
                  <dd class="col-6 fw-medium text-end text-heading mb-0">
                    ${activePackage.price}
                  </dd>
                </dl>
              </div>
            ) : (
              <div class="border rounded p-4 pb-3">
                <h6>No Active Package To Show</h6>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Packages;
