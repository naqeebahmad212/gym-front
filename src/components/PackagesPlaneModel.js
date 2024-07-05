import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faIndianRupeeSign, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { App_host } from '../Data';
import { Link } from 'react-router-dom';

const PackagesPlaneModel = ({ showPackages, handleShowpackage, activePackage, handleShowUpdatePackageModelEdit, packagesData, SetPackagesData }) => {
    const [showModal, setShowModal] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');

    const activegym = localStorage.getItem("activegym")

    let user = JSON.parse(localStorage.getItem('user'))
    let token = localStorage.getItem('token')

    const [filterPackages, setFilterPackages] = useState(user.isJimAdmin ? "mypackages" : null);

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
    }
    if (user.isAdmin) {
        params['is_admin_package'] = true
    } else if (user.isJimAdmin || !user.isJimAdmin) {
        params['is_jim_package'] = true
        params['BusinessLocation'] = activegym
        params['is_admin_package'] = false
        if (filterPackages == "adminpackages") {
            params['is_admin_package'] = true
            params['is_jim_package'] = false
            params['BusinessLocation'] = null
        }
    }


    const getPackagesList = async () => {
        let user = JSON.parse(localStorage.getItem("user"))

        try {
            const response = await axios.get(`${App_host}/packages/getPackages`, {
                params: params,
                headers: {
                    token,
                },
            });




            let { results, ...otherPages } = response.data.data

            // customPackageUsers[string] in the results user id


            console.log("rrrrrrrrrrrrrrrr", { results, user: user?._id })

            if (!user?.isJimAdmin) {

                let filterPackagesMineCustom = results.filter((item) => item?.type === 'custom' && item?.customPackageUsers.includes(user?._id)) // only show mine and public packages
                let filterPackagesNotMineOther = results.filter((item) => item?.type !== 'custom') // only show mine and public packages

                SetPackagesData([...filterPackagesMineCustom, ...filterPackagesNotMineOther]);
            }
            else {
                SetPackagesData(results);
            }

            setTotalPages(otherPages.totalPages);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    useEffect(() => {
        getPackagesList()
    }, [page, filterPackages])

    const handleEditPackage = (packageId) => {
        // Set the currently edited package
        const packageToEdit = packagesData.find(packg => packg._id === packageId);


        handleShowUpdatePackageModelEdit(packageToEdit)
    };


    console.log("packagesData", packagesData)




    return (
        <>
            {/* Modal for editing package */}


            <div className={`modal fade ${showPackages ? "show" : ""}`} id="pricingModal" style={{ display: showPackages ? "block" : "none" }} role="dialog" tabIndex="-1">
                <div className="modal-dialog modal-xl modal-simple modal-pricing">
                    <div className="modal-content p-2 p-md-5">
                        <div className="modal-body">
                            <button type="button" className="btn-close" onClick={handleShowpackage}></button>
                            {/* Pricing Plans */}
                            <div className="py-0 rounded-top">
                                <h2 className="text-center mb-2">Pricing Plans</h2>
                                {/* Rest of your code... */}
                                <div className="row mx-0 gy-3">
                                    {packagesData.length > 0 ? (
                                        packagesData.map((item) => (
                                            <div className="col-lg-4 col-md-6 mb-md-0 mb-4" key={item._id}>
                                                <div className="card border-primary border shadow-none">
                                                    <div className="card-body position-relative">
                                                        {/* Rest of your card content... */}
                                                        <h3 className="card-title text-center text-capitalize mb-1">{item.name}</h3>
                                                        <p className="text-center">{item?.type === 'custom' ? "For Custom User" : "For Gym users"}</p>
                                                        <div className="text-center h-px-100 mb-2">
                                                            <div className="d-flex justify-content-center">
                                                                <sup className="h6 pricing-currency mt-3 mb-0 me-1 text-primary"><FontAwesomeIcon icon={faIndianRupeeSign} /></sup>
                                                                <h1 className="price-toggle price-yearly display-4 text-primary mb-0">{item.price}</h1>
                                                                <sub className="h6 text-muted pricing-duration mt-auto mb-2 fw-normal">/month</sub>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {item.description}
                                                        </div>
                                                        {!user.isJimAdmin && (
                                                            <Link to={activePackage?._id === item?._id ? "#" : `/checkoutPackage?id=${item._id.toString()}`}>
                                                                <button disabled={activePackage?._id === item?._id} type="button" className="btn btn-primary d-grid w-100 mt-3" data-bs-dismiss="modal">{activePackage?._id === item?._id ? "Current Plan" : "Upgrade"}</button>
                                                            </Link>
                                                        )}
                                                        {/* Edit button */}
                                                        {user.isJimAdmin && <button className="btn btn-sm btn-outline-primary position-absolute top-0 end-0 m-2" onClick={() => handleEditPackage(item._id)}>
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-xl mb-md-0 mb-4">
                                            <div className="card border-primary border shadow-none">
                                                no available Package
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PackagesPlaneModel;


