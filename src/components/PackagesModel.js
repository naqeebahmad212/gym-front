import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { App_host } from '../Data';

const PackageSchema = Yup.object().shape({
    name: Yup.string().required('Package Name is required'),
    price: Yup.number().required('Price is required').positive('Price must be a positive number'),
    description: Yup.string().required('Description is required'),
    user: Yup.string(),
});

const PackagesModel = ({ showUpdatePackage, HandleSHowUpdatePackageModel, type = "other", previousData, SetPackagesData }) => {
    const [userData, setUserData] = useState([]);
    let user = JSON.parse(localStorage.getItem('user'))
    let token = localStorage.getItem('token')
    let activegym = localStorage.getItem('activegym')

    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${App_host}/user/getAllBusinessUser`, {
                params: {
                    page,
                    limit,
                    search: search.trim(),
                    status: "active",
                    BusinessLocation: activegym
                },
                headers: {
                    token,
                },
            });

            let { results, ...otherPages } = response.data.data
            setUserData(results);
            setPagination(otherPages);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers()
    }, [])
    const handleSubmit = async (values, formikBag) => {


        try {
            const formValues = await PackageSchema.validate(values, { abortEarly: false });

            console.log("nnnnnnnnnnnnnnnnnn", formValues)
            
            formValues['price'] = formValues.price.toString()
            if (user.isJimAdmin) {
                formValues['is_jim_package'] = true
                formValues['is_admin_package'] = false
                formValues['BusinessLocation'] = activegym
                if(type==='custom'){
                    formValues['customPackageUsers'] =[formValues?.user]
                }
               
            } else if (user.isAdmin) {
                formValues['is_jim_package'] = false
                formValues['is_admin_package'] = true
            }

            // edit data
            let endpoint = `${App_host}/packages/addPackage`;

            if (previousData) {
                endpoint = `${App_host}/packages/updatePackages`;

                const editableData = {
                    id: previousData._id,
                    name: formValues?.name,
                    price: formValues?.price,
                    description: formValues?.description
                }


                const responseEdit = await axios.put(endpoint, editableData, {
                    headers: {
                        // 'Content-Type': 'multipart/form-data',
                        'token': token
                    },
                });

                if (responseEdit?.data?.success) {
                    toast.success('Package Edit successfully!', {
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
                console.log("responseEdit", responseEdit)
                !user.isAdmin &&   updatepackageList(responseEdit?.data?.data?._id,responseEdit?.data?.data)
                formikBag?.resetForm();
                HandleSHowUpdatePackageModel()

                return

            }


            const response = await axios.post(endpoint, formValues, {
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    'token': token
                },
            });


            console.log("response",response)


            if (response?.data?.success) {
                toast.success('Package added successfully!', {
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
            HandleSHowUpdatePackageModel()
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



    const updatepackageList = (idToEdit, newItem) => {
        // Assuming SetPackagesData is a state setter function
        SetPackagesData((items) => {
            // Mapping through the array to find the item with the provided ID
            return items.map(item => {

                console.log('mapmataching',item._id === idToEdit)
                if (item?._id === idToEdit) {
                    // If the item's ID matches, update its name
                    return { ...item, ...newItem };
                }
                return item;
            });
        });
    };

    return (
        <>
            <Modal show={showUpdatePackage} onHide={HandleSHowUpdatePackageModel}>
                <Modal.Header closeButton>
                    <Modal.Title>{previousData ? 'Edit' : 'Create'} Gym Package</Modal.Title> {/* Change modal title */}
                </Modal.Header>
                <Formik
                    initialValues={{
                        name: previousData ? previousData.name : "",
                        price: previousData ? previousData.price : "",
                        description: previousData ? previousData.description : "",
                        user: ''
                    }}
                    validationSchema={PackageSchema}
                    onSubmit={handleSubmit}
                    validateOnBlur={true}
                    validateOnChange={true}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Modal.Body>
                                <div className="form-group">
                                    <label htmlFor="name">Package Name</label>
                                    <Field type="text" name="name" className="form-control inputBackground" placeholder="Enter Package Name" />
                                    <ErrorMessage name="name" component="div" className="error-message" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Price</label>
                                    <Field type="number" name="price" className="form-control inputBackground" placeholder="Enter Price" />
                                    <ErrorMessage name="price" component="div" className="error-message" />
                                </div>
                                {type == "custom" && (
                                    <div className="form-group mb-2" >
                                        <label htmlFor="user">User</label>
                                        <Field as="select" name="user" className="form-control inputBackground">
                                            <option value="" disabled>Select user</option>
                                            {userData.length > 0 &&
                                                userData.map((item) => (
                                                    <option key={item._id} value={item._id} className='justify-content-between'>
                                                        {item.full_name}
                                                    </option>
                                                ))}
                                        </Field>
                                        <ErrorMessage name="user" component="div" className="error-message" />
                                    </div>)
                                }
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <Field as="textarea" name="description" className="form-control inputBackground" placeholder="Enter Description" rows="4" />
                                    <ErrorMessage name="description" component="div" className="error-message" />
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={HandleSHowUpdatePackageModel}>
                                    Close
                                </Button>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    {previousData ? 'Update' : 'Save'} Package {/* Change submit button text */}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
            <ToastContainer />
        </>
    );
};

export default PackagesModel;
