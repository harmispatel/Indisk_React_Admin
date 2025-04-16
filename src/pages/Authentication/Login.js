import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import loginService from "../../services/Auth";
import withRouter from "../../components/Common/withRouter";

import profile from "../../assets/images/indisk-kitchen-logo.png";
import logo from "../../assets/images/Indisk_logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      loginService
        .Login({
          email: values?.email,
          password: values?.password,
        })
        .then((res) => {
          if (res.success === true) {
            toast.success(res.message);
            localStorage.setItem("authUser", JSON.stringify(res?.data));
            navigate("/");
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

  document.title = "Login | Indisk";

  return (
    <React.Fragment>
      <div className="account-pages">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={9}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome to Indisk</h5>
                        <p className="text-muted">
                          Sign in to access your personalized dashboard and
                          services
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
                    <Link to="/" className="logo-light-element">
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

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="mdi mdi-lock" />
                          </span>
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                            }
                          />
                          <span
                            className="input-group-text"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <span class="mdi mdi-eye-off-outline"></span>
                            ) : (
                              <span class="mdi mdi-eye-outline"></span>
                            )}
                          </span>
                        </div>
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback className="d-block">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block d-flex justify-content-center align-content-center"
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
                          {loading ? "Logging in..." : "Log In"}
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock-reset me-1" />
                          Forgot your password?
                        </Link>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
