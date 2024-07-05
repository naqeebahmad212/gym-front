import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faBookmarks, faTimes, faQuestionCircle, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { App_host } from '../Data';
import { useLocation ,useNavigate} from 'react-router-dom';

const UpgradePackage = () => {
    const [showThanks, setShowThanks] = useState(true)
    const navigate=useNavigate()
    let activegym = localStorage.getItem('activegym')
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id')
    let handleshowThanks = async() => {
       await  SubscribePackage()
        setShowThanks(false)
    }
    let token = localStorage.getItem('token')
    let SubscribePackage = async () => {
        try {
            let Data = {
                id: id,
                jimId: activegym
            }
            const response = await axios.post(`${App_host}/packages/subscribePackage`, Data, {
                headers: {
                    'token': token
                },
            });

            if (response?.data?.success) {
                toast.success('Package subscribed successfully!', {
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
    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="py-3 mb-4">
                <span className="text-muted fw-light">Package/</span> Checkout
            </h4>
            <div id="wizard-checkout" className="bs-stepper wizard-icons wizard-icons-example mb-5">
                <div className="bs-stepper-header m-auto border-0 py-4">
                </div>
                <div className="bs-stepper-content border-top">

                    <div id="checkout-confirmation" className="content" style={{ paddingTop: "20px" }}>

                        {showThanks == true ? (
                            <div class="col-xxl-6 col-lg-8 mx-auto">
                                <ul class="nav nav-pills card-header-pills mb-3" id="paymentTabs" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link active" id="pills-cc-tab" data-bs-toggle="pill"
                                            data-bs-target="#pills-cc" type="button" role="tab" aria-controls="pills-cc"
                                            aria-selected="true">Card</button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="pills-cod-tab" data-bs-toggle="pill"
                                            data-bs-target="#pills-cod" type="button" role="tab" aria-controls="pills-cod"
                                            aria-selected="false">Pay later</button>
                                    </li>
                                </ul>
                                <div class="tab-content px-0" id="paymentTabsContent">
                                    <div class="tab-pane fade show active" id="pills-cc" role="tabpanel"
                                        aria-labelledby="pills-cc-tab">
                                        <div class="row g-3 px-4">
                                            <div class="col-12">
                                                <label class="form-label w-100" for="paymentCard">Card Number</label>
                                                <div class="input-group input-group-merge">
                                                    <input id="paymentCard" name="paymentCard" class="form-control credit-card-mask"
                                                        type="text" placeholder="1356 3215 6548 7898" aria-describedby="paymentCard2" />
                                                    <span class="input-group-text cursor-pointer p-1" id="paymentCard2"><span
                                                        class="card-type"></span></span>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6">
                                                <label class="form-label" for="paymentCardName">Name</label>
                                                <input type="text" id="paymentCardName" class="form-control" placeholder="John Doe" />
                                            </div>
                                            <div class="col-6 col-md-3">
                                                <label class="form-label" for="paymentCardExpiryDate">Exp. Date</label>
                                                <input type="text" id="paymentCardExpiryDate" class="form-control expiry-date-mask"
                                                    placeholder="MM/YY" />
                                            </div>
                                            <div class="col-6 col-md-3">
                                                <label class="form-label" for="paymentCardCvv">CVV Code</label>
                                                <div class="input-group input-group-merge">
                                                    <input type="text" id="paymentCardCvv" class="form-control cvv-code-mask"
                                                        maxlength="3" placeholder="654" />
                                                    <span class="input-group-text cursor-pointer" id="paymentCardCvv2"><i
                                                        class="ti ti-help text-muted" data-bs-toggle="tooltip" data-bs-placement="top"
                                                        title="Card Verification Value"></i></span>
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <label class="switch">
                                                    <input type="checkbox" class="switch-input" />
                                                    {/* <span class="switch-toggle-slider">
                                                        <span class="switch-on"></span>
                                                        <span class="switch-off"></span>
                                                    </span> */}
                                                    {/* <span class="switch-label">Save card for future billing?</span> */}
                                                </label>
                                            </div>
                                            <div class="col-12">
                                                <button type="button" class="btn btn-primary btn-next me-sm-3 me-1" onClick={()=>navigate('/payment')}>Submit</button>
                                                <button type="reset" class="btn btn-label-secondary">Cancel</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="pills-cod" role="tabpanel" aria-labelledby="pills-cod-tab">
                                        <p>Pay later is a type of payment method where the recipient make payment for the
                                            order at the time of delivery rather than in advance.</p>
                                        <button type="button" class="btn btn-primary btn-next" onClick={handleshowThanks}>Pay later</button>
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <div className="row mb-3">
                                <div className="col-12 col-lg-8 mx-auto text-center mb-3">
                                    <h4 className="mt-2">Thank You! 😇</h4>
                                    <p>Your successfully subscribed the Package</p>
                                    <p>Thank you! We've recieved your order confirmation. Thanks!</p>
                                    {/* <p><span className="fw-medium"><i className="ti ti-clock me-1"></i> Time placed:&nbsp;</span> </p> */}
                                </div>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
            <ToastContainer />

        </div>
    );
};

export default UpgradePackage;
