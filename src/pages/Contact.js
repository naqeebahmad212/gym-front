import React, { useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { App_host } from '../Data';
import axios from 'axios';

const Contact = () => {
    let user = JSON.parse(localStorage.getItem('user'))
    let token = localStorage.getItem('token')

    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        image: null
    });

    const handleChange = (e) => {
        const { name, value, } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { subject, message, image } = formData;

        // Prepare form data to send
        const formDataToSend = new FormData();
        formDataToSend.append('subject', subject);
        formDataToSend.append('message', message);
        if (image) {
            formDataToSend.append('image', image);
        }

        // Make API call to submit the form data
        try {
            let Data = {
                ...formData,
                user: user._id.toString()
            }
            const response = await axios.post(`${App_host}/contact/addcontact`, Data, {
                headers: {
                    'token': token
                },
            });

            if (response?.data?.success) {
                toast.success('Submitted successfully!', {
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
            setFormData({
                subject: '',
                message: '',
                image: null
            })
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
    };
    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="col-xxl">
                <div className="card mb-4">
                    <h5 className="card-header">Contact Query</h5>
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <label className="col-sm-3 col-form-label text-sm-end" htmlFor="subjectInput">Subject</label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="subjectInput"
                                    name="subject"
                                    placeholder="Enter Subject Here"
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-3 col-form-label text-sm-end" htmlFor="messageInput">Message</label>
                            <div className="col-sm-9">
                                <textarea
                                    className="form-control message-input"
                                    id="messageInput"
                                    name="message"
                                    placeholder="Enter Message Here"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                        {/* <div className="row mb-3">
                            <label className="col-sm-3 col-form-label text-sm-end" htmlFor="imageInput">Image (optional)</label>
                            <div className="col-sm-9">
                                <input
                                    type="file"
                                    className="form-control"
                                    id="imageInput"
                                    name="image"
                                    onChange={handleChange}
                                />
                            </div>
                </div> */}
                        <div className="pt-4">
                            <div className="row justify-content-end">
                                <div className="col-sm-9">
                                    <button type="submit" className="btn btn-primary me-sm-2 me-1 waves-effect waves-light">
                                        Submit
                                    </button>
                                    <button type="reset" className="btn btn-label-secondary waves-effect">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
            <ToastContainer />

        </div >

    );
};

export default Contact;
