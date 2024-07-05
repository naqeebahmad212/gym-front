import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  faExclamationTriangle,
  faFaceFrown,
  faIndianRupeeSign,
  faMapMarker,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { App_host } from "../Data";
import GymsPopup from "../components/GymsPopup";
import PackagesModel from "../components/PackagesModel";
const AdminPackages = () => {
  const [jim, setJim] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpdatePackage, showUpdatePackages] = useState(false);
  const [activePackage, setActivePackage] = useState({});
  const [gymPackages, setGymPackages] = useState([]);
  const [gymId, setGymId] = useState("");
  const [packages, setPackages] = useState([]);
  const itemsPerPage = 12;

  const [showPackages, setShowPackages] = useState(false);

  let handleShowpackageModel = (id) => {
    setGymId(id);
    setShowPackages(!showPackages);
  };
  useEffect(() => {
    const fetchJim = async () => {
      try {
        const response = await axios.get(
          `${App_host}/Jim/getAllBusinessLocation?page=${currentPage}&limit=${itemsPerPage}`
        );

        console.log("gymee", response.data);
        setGymPackages(response.data.packages);
        let tempGym = response.data.data?.businessLocations?.results.filter(
          (item) =>
            response.data.data?.packages.some((v) => v?._id === item._id)
        );

        setJim(tempGym);
        setPackages(response.data.data?.packages);
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

  let user = JSON.parse(localStorage.getItem("user"));
  let token = localStorage.getItem("token");
  let activegym = localStorage.getItem("activegym");

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
      console.log("Active vvvvvvvvvvvvvvvvvvvvvvvv", response);
      setActivePackage(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    getActivePackage();
  }, []);

  const HandleSHowUpdatePackageModel = () => {
    showUpdatePackages(!showUpdatePackage);
  };
  return (
    <>
      <div>
        <PackagesModel
          HandleSHowUpdatePackageModel={HandleSHowUpdatePackageModel}
          showUpdatePackage={showUpdatePackage}
          previousData={activePackage}
        />
        <section className="choseus-section spad mt-3">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title">
                  <h4>
                    <strong>All Gyms Packages</strong>{" "}
                  </h4>
                </div>
              </div>
            </div>
            <div className="row">
              {gymPackages.map((data, index) => (
                <>
                  <div
                    key={index}
                    className="col-lg-6 col-md-12 col-sm-12 mb-4"
                  >
                    <div className="card h-100">
                      {/* {data.images.length > 0 ? (
                        <img
                          src={data.images[0]}
                          className="card-img-top"
                          alt="Gym"
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src="https://www.staticwhich.co.uk/static/images/products/no-image/no-image-available.png"
                          className="card-img-top"
                          alt="Gym"
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                      )} */}
                      <div className="card-body">
                        <h5 className="card-title">Package: {data.name}</h5>
                        <p className="card-text">
                          <i>{/* <FontAwesomeIcon icon={faMapMarker} /> */}</i>{" "}
                          description: {data.description}
                        </p>

                        <p className="card-text">
                          <i>{/* <FontAwesomeIcon icon={faMapMarker} /> */}</i>{" "}
                          {/* Price : {data.price} */}
                        </p>
                        <p className="card-text">
                          <i>{/* <FontAwesomeIcon icon={faMapMarker} /> */}</i>{" "}
                          Gym: {data.BusinessLocation.name}
                        </p>
                        <button
                          className="btn btn-primary"
                          //   onClick={() =>
                          //     handleShowpackageModel(data._id.toString())
                          //   }
                        >
                          Price : {data.price}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ))}
              {gymPackages.length === 0 && (
                <div className="col-12 d-flex justify-content-center">
                  <div className="card text-center">
                    <div className="card-body">
                      <FontAwesomeIcon
                        icon={faFaceFrown}
                        style={{ color: "white", fontSize: "50px" }}
                      />
                      <h5 className="card-title">No available Gyms to Show</h5>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {showPackages && (
              <GymsPopup
                showPackages={showPackages}
                handleShowpackage={handleShowpackageModel}
                gymid={gymId}
              />
            )}
            {totalPages > 1 && (
              <div className="row mt-4">
                <div className="col-lg-12 d-flex justify-content-center">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <li
                            key={page}
                            className={`page-item ${
                              currentPage === page ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
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
        </section>
      </div>
    </>
  );
};

export default AdminPackages;

{
  /* <div className="container-xxl flex-grow-1 container-p-y p-0">
<div className="container">
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
           
              <div className="mb-3">
                <h6 className="mb-1">
                  <span className="me-2">
                    <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                    {activePackage?.price} Per Month
                  </span>
                </h6>
                <p>Standard plan for Gyms</p>
              </div>
            </div>

            <div className="col-12">
              <button
                className="btn btn-primary me-2 mt-2 pointer"
                onClick={HandleSHowUpdatePackageModel}
              >
                Update Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div> */
}
