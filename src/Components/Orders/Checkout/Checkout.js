import React, { Component } from "react";
import { Button, Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import Spinner from "../../Spinner/Spinner";

import axios from 'axios';
import { resetIngredients } from "../../../redux/actionCreators";
import { Formik } from "formik";

const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice,
        purchasable: state.purchasable,
        userId: state.userId,
        token: state.token,
    }
}

const mapDisptachToProps = disptach => {
    return {
        resetIngredients: () => disptach(resetIngredients()),
    }
}

class Checkout extends Component {
    state = {
        values: {
            delivaryAddress: "",
            phone: "",
            paymentType: "Cash On Delivery",
        },
        isLoading: false,
        isModalOpen: false,
        modalMsg: "",
    }

    goBack = () => {
        this.props.history.goBack("/");
    }

    // inputChangeHandler = (e) => {
    //     this.setState({
    //         values: {
    //             ...this.state.values,
    //             [e.target.name]: e.target.value,
    //         }
    //     })
    // }

    submit = values => {
        this.setState({ isLoading: true });
        const order = {
            ingredients: this.props.ingredients,
            customer: values,
            price: this.props.totalPrice,
            orderTime: new Date(),
            userId: this.props.userId,
        }
        axios.post("https://burger-builder-bd25c-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json?auth=" + this.props.token, order)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        isLoading: false,
                        isModalOpen: true,
                        modalMsg: "Order Placed Successfully!",
                    })
                    this.props.resetIngredients();
                } else {
                    this.setState({
                        isLoading: false,
                        isModalOpen: true,
                        modalMsg: "Something went Wrong! Order Again!",
                    })
                }
            })
            .catch(err => {
                this.setState({
                    isLoading: false,
                    isModalOpen: true,
                    modalMsg: "Something went Wrong! Order Again!",
                })
            })
    }
    render() {
        let form = (
            <div>
                <h4 style={{
                    border: "1px solid grey",
                    boxShadow: "1px 1px #888888",
                    borderRadius: "5px",
                    padding: "20px"
                }}>Payment: {this.props.totalPrice} BDT</h4>
                <Formik
                    initialValues={
                        {
                            delivaryAddress: '',
                            phone: '',
                            paymentType: '',
                        }
                    }

                    onSubmit={(values) => {
                        console.log('Values: ', values)
                        this.submit(values);
                    }}

                    validate={values => {
                        const errors = {};
                        if (!values.delivaryAddress) {
                            errors.delivaryAddress = 'Required';
                        }
                        if (!values.phone) {
                            errors.phone = 'Required';
                        } // else if (!/^(\+88)?(88)?01[3-9]([0-9]){8}$/.test(values.phone)) {
                        //     errors.phone = 'Invalid Mobile';
                        // }

                        if (!values.paymentType) {
                            errors.paymentType = 'Required';
                        } else if (values.paymentType === 'Select Payment Gateway') {
                            errors.paymentType = 'Required';
                        }
                        console.log('Erros:', errors);
                        return errors;
                    }}
                >
                    {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
                        <form style={{
                            border: "1px solid grey",
                            boxShadow: "1px 1px #888888",
                            borderRadius: "5px",
                            padding: "20px"
                        }}

                            onSubmit={handleSubmit}

                        >
                            <textarea
                                name="delivaryAddress"
                                id="delivaryAddress"
                                value={values.delivaryAddress}
                                className="form-control"
                                placeholder="Your Address"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <span className="error">
                                {errors.delivaryAddress && touched.delivaryAddress && errors.delivaryAddress}
                            </span>
                            <br />
                            <input
                                name="phone"
                                id="phone"
                                className="form-control"
                                value={values.phone} placeholder="Your Phone Number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <span className="error">
                                {errors.phone}
                            </span>
                            <br />
                            <select
                                name="paymentType"
                                id="paymentType"
                                className="form-control"
                                value={values.paymentType}
                                onBlur={handleBlur}
                                onChange={handleChange}>
                                <option>Select Payment Gateway</option>
                                <option value="Cash On Delivery">Cash On Delivery</option>
                                <option value="Bkash">Bkash</option>
                            </select>
                            <span className="error">
                                {errors.paymentType}
                            </span>
                            <br />
                            <Button style={{ background: "#D70F64" }} className="me-auto" onClick={this.submitHandler} disabled={!this.props.purchasable}>Place Order</Button>
                            <Button color="secondary" className="ms-1" onClick={this.goBack}>Cancel</Button>
                        </form>
                    )}
                </Formik>
            </div>
        )
        return (
            <div>
                {this.state.isLoading ? <Spinner /> : form}
                <Modal isOpen={this.state.isModalOpen} onClick={this.goBack}>
                    <ModalBody>
                        <p>{this.state.modalMsg}</p>
                    </ModalBody>
                </Modal>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDisptachToProps)(Checkout); 