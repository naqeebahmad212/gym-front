import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { App_host } from "../Data";

const NewGymRequests = ({ isRequests, adminGymUsers }) => {
  const [userData, setUserData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  let location = useLocation();
  let searchStatus = isRequests ? "pending" : "active"; //active or inactive in backend

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${App_host}/Jim/getAllBusinessLocation`,
        {
          params: {
            page,
            limit,
            search: search.trim(),
            status: searchStatus,
            filter: statusFilter === "all" ? null : statusFilter,
          },
          headers: {
            token,
          },
        }
      );

      let { businessLocations, ...otherPages } = response.data.data;
      setUserData(businessLocations?.results);
      setPagination(otherPages);
      console.log("businessLocations", businessLocations);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search, isRequests, statusFilter]);

  console.log("pagination", pagination);

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card p-1">
        <h5 className="card-header w-25 ">
          {" "}
          {adminGymUsers
            ? "ALl Gym Users"
            : isRequests
            ? "Gym Requests"
            : "All Gyms"}{" "}
        </h5>
        <div className="card-datatable">
          <div className="row">
            <div className="col-6 col-sm-6 col-md-6">
              <div className="dataTables_length" id="DataTables_Table_3_length">
                <label className="d-flex align-items-center flex-row mw-100">
                  <div className="text-nowrap mx-3">Show Results</div>
                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                    className="form-select form-select-sm mx-3 w-25"
                  >
                    <option value="7">7</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="col-6 col-sm-6 col-md-6 d-flex justify-content-center justify-content-md-end">
              <div className="dataTables_filter">
                <label>
                  <input
                    type="search"
                    value={search}
                    onChange={handleSearchChange}
                    className="form-control form-control-sm"
                    placeholder="Search"
                  />
                </label>
              </div>
            </div>
          </div>

          {!adminGymUsers && (
            <div className="row mt-3">
              <div className="col">
                <select
                  className="form-select mx-3"
                  style={{ width: "98.5%" }}
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <option value="all">All Statuses</option>
                  {!isRequests && <option value="active">Active</option>}
                  {!isRequests && <option value="inactive">Inactive</option>}
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          )}

          <div className="overflow-auto">
            <Table
              data={userData}
              pagination={pagination}
              onPageChange={handlePageChange}
              reloadUsers={fetchUsers}
              type={"jim"}
              adminGymUsers={adminGymUsers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGymRequests;
