import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import axios from "axios";
import { App_host } from "../Data";

const NewRequest = () => {
  const [userData, setUserData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const activegym = localStorage.getItem("activegym");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${App_host}/user/getAllBusinessUser`, {
        params: {
          page,
          limit,
          search: search.trim(),
          status: "pending",
          BusinessLocation: activegym,
        },
        headers: {
          token,
        },
      });

      let { results, ...otherPages } = response.data.data;
      const pendingUsersLength = results.filter((user) =>
        user.BusinessLocation.some(
          (gym) => gym.Gym === activegym && gym.status === "pending"
        )
      );
      setUserData(pendingUsersLength);
      console.log("pendingUsersLength", pendingUsersLength);
      setPagination(otherPages);
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

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search]);
  console.log("userData from new req", userData);

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <h5 className="card-header">
          All {user?.BusinessLocation[0]?.Gym?.name} Member
        </h5>
        <div className="card-datatable table-responsive">
          <div className="row">
            <div className="col-6 col-sm-6 col-md-6">
              <div className="dataTables_length" id="DataTables_Table_3_length">
                <label className="d-flex align-items-center flex-row mw-100">
                  <div className="text-nowrap pr-2 mx-3">Show Results</div>
                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                    className="form-select form-select-sm w-25"
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
          <div className="overflow-auto">
            <Table
              data={userData}
              pagination={pagination}
              onPageChange={handlePageChange}
              reloadUsers={fetchUsers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;
