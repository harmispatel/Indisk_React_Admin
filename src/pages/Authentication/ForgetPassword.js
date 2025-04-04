import PropTypes from "prop-types";
import React from "react";
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
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
      loginService
        .ForgotPassword({
          email: values?.email,
        })
        .then((res) => {
          if (res.success === true) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    },
  });

  document.title = "Forget Password | Indisk";

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-softbg-soft-primary">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue to Ecommerce.</p>
                      </div>
                    </Col>
                    <Col className="col-5 login-bg-image">
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
                      Enter your Email and instructions will be sent to you!{" "}
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
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md "
                            type="submit"
                          >
                            Reset
                          </button>
                        </Col>
                      </Row>
                    </Form>
                    <div className="mt-5 text-center">
                      <p>
                        Go back to{" "}
                        <Link
                          to="/login"
                          className="font-weight-medium text-primary"
                        >
                          Login
                        </Link>{" "}
                      </p>
                    </div>
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

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
