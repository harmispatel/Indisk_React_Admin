import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";
import profile from "../../assets/images/indisk-kitchen-logo.png";
import logo from "../../assets/images/Indisk_logo.png";
import loginService from "../../services/Auth";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Required new password"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required confirm password"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      loginService
        .ResetPassword({
          password: values.password,
          token,
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
          toast.error(err?.message || "Something went wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  document.title = "Reset Password | Indisk";

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
                        <h5 className="text-primary">Reset Password</h5>
                        <p className="text-muted">
                          Please enter and confirm your new password to regain
                          access to your account.
                        </p>
                      </div>
                    </Col>
                    <Col className="col-3 login-bg-image">
                      <img src={profile} alt="logo" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div className="avatar-md profile-user-wid mb-4">
                    <span className="avatar-title rounded-circle bg-light">
                      <img
                        src={logo}
                        alt="logo"
                        className="rounded-circle"
                        height="75"
                        width="100"
                      />
                    </span>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={validation.handleSubmit}
                    >
                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="mdi mdi-lock" />
                          </span>
                          <Input
                            name="password"
                            type="password"
                            placeholder="Enter new password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                            }
                          />
                        </div>
                        {validation.touched.password &&
                          validation.errors.password && (
                            <div className="text-danger">
                              {validation.errors.password}
                            </div>
                          )}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Confirm Password</Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="mdi mdi-lock-check" />
                          </span>
                          <Input
                            name="confirmPassword"
                            type="password"
                            placeholder="Enter confirm password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.confirmPassword}
                            invalid={
                              validation.touched.confirmPassword &&
                              validation.errors.confirmPassword
                            }
                          />
                        </div>
                        {validation.touched.confirmPassword &&
                          validation.errors.confirmPassword && (
                            <div className="text-danger">
                              {validation.errors.confirmPassword}
                            </div>
                          )}
                      </div>
                      <Row className="mb-3">
                        <Col className="d-flex justify-content-center">
                          <button
                            className="btn btn-primary w-md d-flex justify-content-center align-items-center"
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? "Saving..." : "Save"}
                          </button>
                        </Col>
                      </Row>
                    </Form>
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

export default ResetPassword;
