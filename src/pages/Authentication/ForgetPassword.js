import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
} from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import * as Yup from "yup";
import profile from "../../assets/images/indisk-kitchen-logo.png";
import logo from "../../assets/images/Indisk_logo.png";
import { useFormik } from "formik";
import loginService from "../../services/Auth";
import toast from "react-hot-toast";

const ForgetPasswordPage = () => {
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      loginService
        .ForgotPassword({
          email: values?.email,
        })
        .then((res) => {
          if (res.success === true) {
            toast.success(res.message);
            validation.resetForm();
          } else {
            toast.error(res.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  document.title = "Forget Password | Indisk";

  return (
    <>
      <div className="account-pages">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={9}>
                      <div className="p-4">
                        <h5 className="text-primary">Forgot your password?</h5>
                        <p className="text-muted">
                          No worries! Just enter your email and we’ll help you
                          reset it.
                        </p>
                      </div>
                    </Col>
                    <Col className="col-3 login-bg-image">
                      <img src={profile} alt="" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="75"
                            width="100"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <div
                      class="alert alert-success text-center mb-4"
                      role="alert"
                    >
                      Enter your registered email address below and we’ll send
                      you instructions to reset your password.
                    </div>

                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="mdi mdi-email" />
                          </span>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                            }
                          />
                        </div>
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback className="d-block">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <Row className="mb-3">
                        <Col className="d-flex justify-content-center">
                          <button
                            className="btn btn-primary w-md d-flex justify-content-center align-content-center"
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? (
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : null}
                            Reset
                          </button>
                        </Col>
                      </Row>
                    </Form>
                    <div className="mt-5 text-center">
                      <p>
                        <Link
                          to="/login"
                          className="font-weight-medium text-primary d-flex align-items-center justify-content-center"
                        >
                          <i className="mdi mdi-arrow-left me-1" /> Go back to
                          Login
                        </Link>
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
