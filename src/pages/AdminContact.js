
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { App_host } from '../Data';

const AdminContact = () => {
    const [pagination, setPagination] = useState()
    const [limit, setLimit] = useState()
    const [page, setPage] = useState()
    let token = localStorage.getItem("token")
    const [contact, setContact] = useState([])
    const [totalPages, setTotalpages] = useState();

    let getcontactDetails = async () => {
        try {
            const response = await axios.get(`${App_host}/contact/getcontact`, {
                params: {
                    page: page,
                    limit: limit,
                    search: "",
                },
                headers: {
                    token,
                },
            });
            console.log("================", response)
            let { results, ...otherPages } = response.data.data
            setContact(results);
            setLimit(otherPages.limit)
            setTotalpages(otherPages.totalPages)
            setPage(otherPages.page)
            setPagination(otherPages);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    useEffect(() => {
        getcontactDetails()
    }, [])
    let Handledetecontact = async (id) => {
        try {
            const response = await axios.delete(`${App_host}/contact/deletecontact?id=${id}`,
                {
                    headers: {
                        token,
                    },
                });
            console.log("also got the response ", response)

            if (response?.data?.success) {
                toast.success('User registered successfully!', {
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
                getcontactDetails()
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
            console.log("error.response.data.message", error)
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
    }
    const onPageChange = (page) => {
        setPage(page)
    }

    const pageNumbers = Array.from({ length: totalPages ? totalPages : 1 }, (_, index) => index + 1);

    return (
        <>
            <div className="overflow-auto">
                <table className="dt-multilingual table dataTable no-footer dtr-column"
                    id="DataTables_Table_3" aria-describedby="DataTables_Table_3_info"
                    style={{ width: "1045px" }}>
                    <thead>
                        <tr>
                            <th className="control sorting_disabled sorting_asc dtr-hidden" rowSpan="1"
                                colSpan="1" style={{ width: "0px", display: "none" }} aria-label=""></th>

                            <th className="sorting" tabIndex="0" aria-controls="DataTables_Table_3"
                                rowSpan="1" colSpan="1" style={{ width: "122px" }}
                                aria-label="Contact: aktivieren, um Spalte aufsteigend zu sortieren">
                                Name</th>
                            <th className="sorting" tabIndex="0" aria-controls="DataTables_Table_3"
                                rowSpan="1" colSpan="1" style={{ width: "75px" }}
                                aria-label="Date: aktivieren, um Spalte aufsteigend zu sortieren">
                                Email</th>

                            <th className="sorting" tabIndex="0" aria-controls="DataTables_Table_3"
                                rowSpan="1" colSpan="1" style={{ width: "90px" }}
                                aria-label="Status: aktivieren, um Spalte aufsteigend zu sortieren">
                                Subject</th>
                            <th className="sorting" tabIndex="0" aria-controls="DataTables_Table_3"
                                rowSpan="1" colSpan="1" style={{ width: "90px" }}
                                aria-label="Status: aktivieren, um Spalte aufsteigend zu sortieren">
                                Message</th>

                            <th className="sorting_disabled" rowSpan="1" colSpan="1"
                                style={{ width: "65px" }} aria-label="Actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contact.length > 0 ? (
                            <>
                                {contact.map((item) => {

                                    return (
                                        <tr className="odd">
                                            <td className="control sorting_1 dtr-hidden" tabIndex="0"
                                                style={{ display: "none" }}></td>
                                            <td>{item.name}</td>

                                            <td className="" style={{}}>{item.email}</td>
                                            <td className="" style={{}}>{item.subject}</td>
                                            <td className="" style={{}}>{item.message}</td>


                                            <td className="" style={{}}>

                                                <div className="d-inline-block">
                                                    <a href="javascript:;"
                                                        className="btn btn-sm btn-icon dropdown-toggle hide-arrow"
                                                        data-bs-toggle="dropdown">
                                                        <i className="text-primary ti ti-dots-vertical"></i>
                                                    </a>
                                                    <div className="dropdown-menu dropdown-menu-end m-0">
                                                        <div className="dropdown-divider"></div>
                                                        <a className="dropdown-item text-danger delete-record" onClick={() => Handledetecontact(item._id.toString())}>Delete</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>)
                                })}

                            </>) : (<><div className="odd d-flex justify-cntent-center">

                                No data Found

                            </div>
                            </>
                        )}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(page - 1)}>
                                Previous
                            </button>
                        </li>
                        {pageNumbers.map((number) => (
                            <li key={number} className={`page-item ${page === number ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => onPageChange(number)}>
                                    {number}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(page + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <ToastContainer />
        </>
    )
}

export default AdminContact
