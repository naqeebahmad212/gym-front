import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { App_host } from '../Data';

const RegisterGymSchema = Yup.object().shape({
    full_name: Yup.string().required('Full Name is required !'),
    email: Yup.string().email('Invalid email format').required('Email is required !'),
    password: Yup.string().min(6, 'Password must be at least 6 characters !').required('Password is required !'),
    gymName: Yup.string().required('Gym Name is required !'),
    gymAddress: Yup.string().required('Gym Address is required !'),
    phone: Yup.string().matches(/^\d+$/, 'Invalid phone number !'),
    city: Yup.string().required('City is required !'),
    description: Yup.string(),
    package: Yup.string().required('Package is required!'),
    images: Yup.array()
});

const AddNewJim = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showImages, setShowImages] = useState([]);
    const [packagesData, SetPackagesData] = useState([]);
    let user = JSON.parse(localStorage.getItem('user'))
    const [filterPackages, setFilterPackages] = useState(user.isJimAdmin ? "mypackages" : null);



    const handleSubmit = async (values, formikBag) => {
        try {

            const formValues = await RegisterGymSchema.validate(values, { abortEarly: false });
            formValues["status"] = "active"
            const formData = new FormData();

            Object.entries(formValues).forEach(([key, value]) => {
                if (key !== 'images') {
                    formData.append(key, value);
                }
                console.log("key ::", formData[key])
            });


             
            if (formValues.images && formValues.images.length > 0) {
                formValues.images.forEach((image) => {
                    formData.append('images', image);
                });
            }
            console.log("-------------------------------", [...formData]);
            const response = await axios.post(`${App_host}/Jim/addJim`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.data?.success) {
                toast.success('Gym registered successfully!', {
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
            formikBag?.resetForm();
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
        finally {
            formikBag?.setSubmitting(false);
        }
    };

    const activegym = localStorage.getItem("activegym")
    let token = localStorage.getItem('token')

    let params = {
        page: 1,
        limit: 20,
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
        try {
            const response = await axios.get(`${App_host}/packages/getPackages`, {
                params: params,
                headers: {
                    token,
                },
            });

            let { results, ...otherPages } = response.data.data
            SetPackagesData(results);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    useEffect(() => {
        getPackagesList()
    }, [])

    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">

                <div className="col-xxl">
                    <div className="card mb-4">
                        <h5 className="card-header">Add New Gym</h5>
                        <Formik
                            initialValues={{
                                full_name: '',
                                email: '',
                                password: '',
                                gymName: '',
                                gymAddress: '',
                                phone: '',
                                city: '',
                                package:'',
                                description: '',
                                images: [],
                            }}
                            validationSchema={RegisterGymSchema}
                            onSubmit={handleSubmit}
                            validateOnBlur={true}
                            validateOnChange={true}
                        >
                            {({ isSubmitting, setFieldValue, values }) => (
                                <Form className="card-body">
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label text-sm-end">Name</label>
                                        <div className="col-sm-9">
                                            <Field type="text" name="full_name" className="form-control" placeholder="Enter Name Here" />
                                            <ErrorMessage name="full_name" component="div" className="error-message" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label text-sm-end">Email</label>
                                        <div className="col-sm-9">
                                            <Field type="text" name="email" className="form-control" placeholder="Enter Email Here" />
                                            <ErrorMessage name="email" component="div" className="error-message" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label text-sm-end">Gym Name</label>
                                        <div className="col-sm-9">
                                            <Field type="text" name="gymName" className="form-control" placeholder="Enter Gym Name Here" />
                                            <ErrorMessage name="gymName" component="div" className="error-message" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label text-sm-end">Contact</label>
                                        <div className="col-sm-9">
                                            <Field type="text" name="phone" className="form-control" placeholder="Enter Contact No. Here" maxLength={13} />
                                            <ErrorMessage name="phone" component="div" className="error-message" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label text-sm-end">City</label>
                                        <div className="col-sm-9">
                                            <Field type="text" name="city" className="form-control" placeholder="Enter city Here" />
                                            <ErrorMessage name="city" component="div" className="error-message" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label text-sm-end">Address</label>
                                        <div className="col-sm-9">
                                            <Field type="text" name="gymAddress" className="form-control" placeholder="Enter Address Here" />
                                            <ErrorMessage name="gymAddress" component="div" className="error-message" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                    <label className="col-sm-3 col-form-label text-sm-end">Package</label>
                                    <div className="col-sm-9">
                                        <Field
                                            as="select"
                                            name="package"
                                            className="form-select"
                                            aria-label="Select Package"
                                            onChange={(e) => {
                                                const selectedPackageId = e.target.value;
                                                setFieldValue("package", selectedPackageId);
                                            }}
                                        >
                                            <option value="">Select Package</option>
                                            {packagesData.length > 0 &&
                                                packagesData.map((item) => (
                                                    <option key={item._id} value={item._id} className='justify-content-between'>
                                                        {item.name}  -------------- $ {item.price}
                                                    </option>
                                                ))}
                                        </Field>
                                        <ErrorMessage name="package" component="div" className="error-message" />
                                    </div>
                                </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label text-sm-end">Description</label>
                                        <div className="col-sm-9">
                                            <Field as="textarea" name="description" className="form-control message-input" placeholder="Enter Description Here" rows="4" />
                                            <ErrorMessage name="description" component="div" className="error-message" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-3 col-form-label text-sm-end">Image</label>
                                        <div className="col-sm-9">
                                            <Field name="images">
                                                {({ field, form }) => (
                                                    <div>
                                                        <input
                                                            type="file"
                                                            name="images"
                                                            multiple
                                                            onChange={(event) => {
                                                                const files = Array.from(event.currentTarget.files);
                                                                console.log(files)
                                                                setFieldValue("images", files);
                                                            }}

                                                            accept="image/*"
                                                        />
                                                        <ErrorMessage name="images" component="div" className="error-message" />
                                                    </div>
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="row mb-3 form-password-toggle">
                                        <label className="col-sm-3 col-form-label text-sm-end">Password</label>
                                        <div className="col-sm-9">
                                            <Field type={showPassword ? 'text' : 'password'} name="password" className="form-control" placeholder="Enter Password" />
                                            <span
                                                className="input-group-text cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`ti ti-eye${showPassword ? '-off' : ''}`}></i>
                                            </span>
                                            <ErrorMessage name="password" component="div" className="error-message" />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <div className="row justify-content-end">
                                            <div className="col-sm-9">
                                                <button type="submit" className="btn btn-primary me-sm-2 me-1 waves-effect waves-light" disabled={isSubmitting}>
                                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                                </button>
                                                <button type="reset" className="btn btn-label-secondary waves-effect" disabled={isSubmitting}>
                                                    Reset
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                <ToastContainer />
            </div>
        </>
    )
}

export default AddNewJim

