import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { faCoins, faFaceFrown, faIndianRupeeSign, faLandmark, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { App_host } from '../Data';

const EarningPopup = ({ showDetails, handleShowDeatils, data}) => {
    let [expenseData, setExpenseData] = useState({})

    let token = localStorage.getItem("token")
    let user = JSON.parse(localStorage.getItem("user"))
    const getPackagesList = async () => {
        try {
            const response = await axios.get(`${App_host}/earning/getEarninDetail`, {
                params:{
                    gymId:data
                },
                headers: {
                    token,
                },
            });
            setExpenseData(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    useEffect(() => {
        getPackagesList()
    }, [])
  return (
    <>
      <div className={`modal fade ${showDetails ? "show" : ""}`} id="pricingModal" style={{ display: showDetails ? "block" : "none" }} role="dialog" tabIndex="-1">
                <div className="modal-dialog modal-xl modal-simple modal-pricing">
                    <div className="modal-content">
                        <div className="modal-body">
                            <button type="button" className="btn-close" onClick={handleShowDeatils}></button>
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
                                        <h1 className="mb-0"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData?.totalEarning}</h1>
                                    </div>
                                    <small className="text-muted">this Month compared to last Month</small>
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
                                        <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData?.totalEarning}</h4>
                                        <div className="progress w-75" style={{ height: "4px" }}>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="d-flex gap-2 align-items-center">
                                            <div className="badge rounded bg-label-info p-1">
                                            <FontAwesomeIcon icon={faProductHunt} />
                                                </div>
                                            <h6 className="mb-0">Total Profit</h6>
                                        </div>
                                        <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData?.totalProfit}</h4>
                                        <div className="progress w-75" style={{ height: "4px" }}>
                                        </div>
                                    </div>
                                    {!user.isAdmin && (

                                        <div className="col-12 col-sm-4">
                                            <div className="d-flex gap-2 align-items-center">
                                                <div className="badge rounded bg-label-danger p-1">
                                                <FontAwesomeIcon icon={faLandmark} />
                                                    </div>
                                                <h6 className="mb-0">Total Expense</h6>
                                            </div>
                                            <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData.totalExpense}</h4>
                                            <div className="progress w-75" style={{ height: "4px" }}>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                            <div className="border rounded p-3 mt-2">
                                <div className="row gap-4 gap-sm-0">
                                    <div className="col-12 col-sm-4">
                                        <div className="d-flex gap-2 align-items-center">
                                            <div className="badge rounded bg-label-primary p-1">
                                            <FontAwesomeIcon icon={faCoins} />

                                                </div>
                                            <h6 className="mb-0">Monthly Earnings</h6>
                                        </div>
                                        <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData?.monthlyEarning}</h4>
                                        <div className="progress w-75" style={{ height: "4px" }}>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <div className="d-flex gap-2 align-items-center">
                                            <div className="badge rounded bg-label-info p-1">
                                            <FontAwesomeIcon icon={faProductHunt} />
                                                </div>
                                            <h6 className="mb-0">Monthly Profit</h6>
                                        </div>
                                        <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData?.monthlyProfit}</h4>
                                        <div className="progress w-75" style={{ height: "4px" }}>
                                        </div>
                                    </div>
                                    {!user.isAdmin && (
                                        <div className="col-12 col-sm-4">
                                            <div className="d-flex gap-2 align-items-center">
                                                <div className="badge rounded bg-label-danger p-1">
                                                <FontAwesomeIcon icon={faLandmark} />
                                                    </div>
                                                <h6 className="mb-0">Monthly Expense</h6>
                                            </div>
                                            <h4 className="my-2 pt-1"><FontAwesomeIcon icon={faIndianRupeeSign} />{expenseData?.monthlyExpense}</h4>
                                            <div className="progress w-75" style={{ height: "4px" }}>
                                            </div>
                                        </div>
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
    </>
  )
}

export default EarningPopup
