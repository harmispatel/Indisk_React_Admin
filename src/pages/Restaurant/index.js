import React, { useEffect, useMemo, useState } from "react";
import withRouter from "../../components/Common/withRouter";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import { Link } from "react-router-dom";
import restaurantService from "../../services/Restaurant.jsx";
import toast from "react-hot-toast";
import DeleteModal from "../../components/Common/DeleteModal.js";
import * as Yup from "yup";
import { useFormik } from "formik";

const Restaurant = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteRestaurant, setDeleteRestaurant] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [restaurantModel, setRestaurantModel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [viewRestaurant, setViewRestaurant] = useState(false);
  const [viewRestaurantData, setViewRestaurantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getRestaurantData = () => {
    setLoading(true);
    restaurantService
      .getRestaurant()
      .then((res) => {
        setRestaurantData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getRestaurantData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }) => (
          <div className="text-body fw-bold">{row.index + 1}</div>
        ),
      },
      {
        Header: "Restaurant Name",
        accessor: "restaurant_name",
        filterable: true,
        Cell: ({ value }) => <div className="text-body fw-bold">{value}</div>,
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: true,
      },
      {
        Header: "Contact",
        accessor: "contact",
        filterable: true,
      },
      {
        Header: "Logo",
        accessor: "logo",
        disableFilters: true,
        filterable: false,
        Cell: ({ value }) => <img className="avatar-md" src={value} alt="" />,
      },

      {
        Header: "IsActive?",
        accessor: "isActive",
        filterable: true,
        Cell: ({ value }) => (
          <Badge color={value === "Active" ? "success" : "danger"}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        ),
      },

      {
        Header: "Action",
        accessor: "action",
        disableFilters: true,
        Cell: ({ row }) => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  toggleRestaurantViewModal();
                  setViewRestaurantData(row.original);
                }}
              >
                <i
                  className="mdi mdi-eye-outline font-size-18"
                  id={`viewtooltip-${row.original.id}`}
                ></i>
                <UncontrolledTooltip
                  placement="top"
                  target={`viewtooltip-${row.original.id}`}
                >
                  View
                </UncontrolledTooltip>
              </Link>

              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  setRestaurant(row.original);
                  setImagePreview(row.original.logo);
                  setIsEdit(true);
                  toggleModal();
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
              <Link
                to="#"
                className="text-danger"
                onClick={() => confirmDelete(row.original)}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
    ],
    [restaurantData]
  );

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const confirmDelete = (data) => {
    setDeleteRestaurant(data);
    toggleDeleteModal();
  };

  const handleConfirmDelete = () => {
    if (!deleteRestaurant) return;

    restaurantService
      .deleteRestaurant({ id: deleteRestaurant._id })
      .then((res) => {
        if (res.success === true) {
          toast.success(res.message);
          getRestaurantData();
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });

    toggleDeleteModal();
  };

  const toggleModal = () => setRestaurantModel(!restaurantModel);

  const handleAddRestaurant = () => {
    setRestaurant(null);
    setIsEdit(false);
    toggleModal();
    setImagePreview(null);
  };

  const toggleRestaurantViewModal = () => setViewRestaurant(!viewRestaurant);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (restaurantData && restaurantData?._id) || "",
      restaurant_name: restaurant?.restaurant_name || "",
      email: restaurant?.email || "",
      contact: restaurant?.contact || "",
      logo: restaurant?.logo || "",
      description: restaurant?.description || "",
      tagLine: restaurant?.tagLine || "",
      isActive: restaurant?.isActive || "",
      website_link: restaurant?.website_link || "",
    },
    validationSchema: Yup.object({
      restaurant_name: Yup.string().required("Restaurant name is required!"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required!"),
      contact: Yup.string()
        .matches(/^\d{10}$/, "Contact must be 10 digits")
        .required("Contact is required!"),
      logo: Yup.mixed()
        .test("fileRequired", "Logo image is required!", function (value) {
          if (isEdit && typeof value === "string") return true;
          return value && value instanceof File;
        })
        .test("fileSize", "File too large. Max size is 5MB", function (value) {
          if (!value || typeof value === "string") return true;
          return value.size <= 5 * 1024 * 1024;
        })
        .test("fileFormat", "Unsupported file format", function (value) {
          if (!value || typeof value === "string") return true;
          return ["image/jpg", "image/jpeg", "image/png"].includes(value.type);
        }),

      description: Yup.string().required("Description is required!"),
      tagLine: Yup.string().required("Tagline is required!"),
      isActive: Yup.string().required("Status is required!"),
      website_link: Yup.string()
        .url("Must be a valid website URL")
        .required("Website link is required!"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("restaurant_name", values.restaurant_name);
      formData.append("email", values.email);
      formData.append("contact", values.contact);
      formData.append("logo", values.logo);
      formData.append("description", values.description);
      formData.append("tagLine", values.tagLine);
      formData.append("isActive", values.isActive);
      formData.append("website_link", values.website_link);

      if (isEdit) {
        formData.append("id", restaurant?._id);
        restaurantService
          .editRestaurant(formData)
          .then((res) => {
            if (res.success === true) {
              toast.success(res.message);
              toggleModal();
              getRestaurantData();
            } else {
              toast.error(res.message);
            }
          })
          .catch((err) => toast.error(err))
          .finally(() => setIsLoading(false));
      } else {
        restaurantService
          .addRestaurant(formData)
          .then((res) => {
            if (res.success === true) {
              toast.success(res.message);
              toggleModal();
              getRestaurantData();
              formik.resetForm();
            } else {
              toast.error(res.message);
            }
          })
          .catch((err) => toast.error(err))
          .finally(() => setIsLoading(false));
      }
    },
  });

  document.title = "Restaurant | Indisk";

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Manage Restaurant" breadcrumbItem="Restaurant" />

          {loading ? (
            <div className="text-center mt-5 pt-5">
              <span
                className="spinner-border spinner-border-md"
                role="status"
                aria-hidden="true"
                style={{ width: "3rem", height: "3rem" }}
              ></span>
            </div>
          ) : (
            <>
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <TableContainer
                        columns={columns}
                        data={restaurantData}
                        isGlobalFilter={true}
                        isAddAdminUser={true}
                        handleAddRestaurant={handleAddRestaurant}
                        customPageSize={10}
                        className="custom-header-css"
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          <Modal
            isOpen={restaurantModel}
            toggle={toggleModal}
            backdrop="static"
            keyboard={false}
            size="lg"
          >
            <ModalHeader
              toggle={() => {
                toggleModal();
                formik.resetForm();
                setImagePreview("");
              }}
              tag="h4"
            >
              {isEdit ? "Edit Restaurant" : "Add Restaurant"}
            </ModalHeader>
            <ModalBody>
              <form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label">Restaurant Name</Label>
                      <Input
                        name="restaurant_name"
                        type="text"
                        placeholder="Enter restaurant name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.restaurant_name}
                        invalid={
                          formik.touched.restaurant_name &&
                          !!formik.errors.restaurant_name
                        }
                      />
                      <FormFeedback>
                        {formik.errors.restaurant_name}
                      </FormFeedback>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label">Email</Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        invalid={formik.touched.email && !!formik.errors.email}
                      />
                      <FormFeedback>{formik.errors.email}</FormFeedback>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label">Contact</Label>
                      <Input
                        name="contact"
                        type="text"
                        placeholder="Enter contact"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.contact}
                        invalid={
                          formik.touched.contact && !!formik.errors.contact
                        }
                      />
                      <FormFeedback>{formik.errors.contact}</FormFeedback>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label">Website</Label>
                      <Input
                        name="website_link"
                        type="url"
                        placeholder="https://example.com"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.website_link}
                        invalid={
                          formik.touched.website_link &&
                          !!formik.errors.website_link
                        }
                      />
                      <FormFeedback>{formik.errors.website_link}</FormFeedback>
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="mb-3">
                      <Label className="form-label">Description</Label>
                      <Input
                        name="description"
                        type="textarea"
                        rows="3"
                        placeholder="Write a short description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        invalid={
                          formik.touched.description &&
                          !!formik.errors.description
                        }
                      />
                      <FormFeedback>{formik.errors.description}</FormFeedback>
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="mb-3">
                      <Label className="form-label">Tagline</Label>
                      <Input
                        name="tagLine"
                        type="text"
                        placeholder="Write a tagline"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.tagLine}
                        invalid={
                          formik.touched.tagLine && !!formik.errors.tagLine
                        }
                      />
                      <FormFeedback>{formik.errors.tagLine}</FormFeedback>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label">Logo</Label>
                      <Input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          if (file) {
                            formik.setFieldValue("logo", file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.logo && !!formik.errors.logo}
                      />
                      <FormFeedback>{formik.errors.logo}</FormFeedback>

                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Logo Preview"
                            className="avatar-md"
                          />
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label">Status</Label>
                      <Input
                        type="select"
                        name="isActive"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.isActive || ""}
                        invalid={
                          formik.touched.isActive && formik.errors.isActive
                            ? true
                            : false
                        }
                      >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Input>
                      {formik.touched.isActive && formik.errors.isActive ? (
                        <FormFeedback type="invalid">
                          {formik.errors.isActive}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="text-end">
                      <Button
                        type="submit"
                        color="success"
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                        {isEdit ? "Update" : "Save"}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </form>
            </ModalBody>
          </Modal>

          <Modal
            isOpen={viewRestaurant}
            toggle={toggleRestaurantViewModal}
            size="lg"
            centered
          >
            <ModalHeader
              toggle={toggleRestaurantViewModal}
              className="bg-light"
            >
              <h5 className="mb-0">
                <i className="mdi mdi-silverware-fork-knife me-2"></i>
                View Restaurant Details -{" "}
                <span className="text-primary">
                  {viewRestaurantData?.restaurant_name}
                </span>
              </h5>
            </ModalHeader>

            <ModalBody className="py-4 px-4">
              {viewRestaurantData && (
                <>
                  <div className="row">
                    <div className="col-md-5">
                      <div>
                        <Label className="fw-semibold text-muted mb-2 d-flex align-items-center">
                          Logo:
                        </Label>
                        <div className="border rounded p-2 text-center bg-light">
                          <img
                            src={viewRestaurantData.logo}
                            alt="restaurant-logo"
                            className="img-fluid"
                            style={{ maxHeight: "240px", objectFit: "contain" }}
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label className="fw-semibold text-muted d-flex align-items-center">
                          Restaurant Name:
                        </Label>
                        <div className="border rounded p-2 bg-light">
                          {viewRestaurantData.restaurant_name}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-7">
                      <div className="mb-2">
                        <Label className="fw-semibold text-muted d-flex align-items-center">
                          Email:
                        </Label>
                        <div className="border rounded p-2 bg-light">
                          {viewRestaurantData.email}
                        </div>
                      </div>

                      <div className="mb-2">
                        <Label className="fw-semibold text-muted d-flex align-items-center">
                          Contact:
                        </Label>
                        <div className="border rounded p-2 bg-light">
                          {viewRestaurantData.contact}
                        </div>
                      </div>

                      <div className="mb-2">
                        <Label className="fw-semibold text-muted d-flex align-items-center">
                          Website link:
                        </Label>
                        <div className="border rounded p-2 bg-light">
                          {viewRestaurantData.website_link}
                        </div>
                      </div>

                      <div className="mb-2">
                        <Label className="fw-semibold text-muted d-flex align-items-center">
                          TagLine:
                        </Label>
                        <div className="border rounded p-2 bg-light">
                          {viewRestaurantData.tagLine}
                        </div>
                      </div>

                      <div className="mb-2">
                        <Label className="fw-semibold text-muted d-flex align-items-center">
                          Description:
                        </Label>
                        <div className="border rounded p-2 bg-light">
                          {viewRestaurantData.description}
                        </div>
                      </div>

                      <div className="mb-2">
                        <Label className="fw-semibold text-muted d-flex align-items-center">
                          isActive?
                        </Label>
                        <div className="border rounded p-2 bg-light">
                          {viewRestaurantData.isActive}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </ModalBody>
          </Modal>
        </Container>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleConfirmDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
    </>
  );
};

export default withRouter(Restaurant);
