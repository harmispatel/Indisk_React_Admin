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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [restaurantModel, setRestaurantModel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  const getRestaurantData = () => {
    restaurantService
      .getRestaurant()
      .then((res) => {
        setRestaurantData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
              <Link to="#" className="text-success">
                <i
                  className="mdi mdi-eye-outline font-size-18"
                  id="viewtooltip"
                ></i>
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View
                </UncontrolledTooltip>
              </Link>
              <Link
                to="#"
                className="text-success"
                onClick={() => handleEditRestaurant(row.original)}
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
    []
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
  };

  const handleEditRestaurant = (data) => {
    setRestaurant(data);
    setIsEdit(true);
    toggleModal();
  };

  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  const handleImageClick = () => {
    if (imagePreview) {
      toggleImageModal();
    }
  };

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (restaurantData && restaurantData?._id) || "",
      restaurant_name: restaurant?.restaurant_name || "",
      email: restaurant?.email || "",
      contact: restaurant?.contact || "",
      logo: null,
      description: restaurant?.description || "",
      tagLine: restaurant?.tagLine || "",
      isActive: restaurant?.isActive || false,
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
        .required("Logo image is required!")
        .test("fileSize", "File too large. Max size is 5MB", (value) => {
          return value && value.size <= 5 * 1024 * 1024;
        })
        .test("fileFormat", "Unsupported file format", (value) => {
          return (
            value &&
            ["image/jpg", "image/jpeg", "image/png"].includes(value.type)
          );
        }),
      description: Yup.string().required("Description is required!"),
      tagLine: Yup.string().required("Tagline is required!"),
      isActive: Yup.string().required("Status is required!"),
      website_link: Yup.string()
        .url("Must be a valid website URL")
        .required("Website link is required!"),
    }),
    onSubmit: (values) => {
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
        formData.append("id", restaurantData?._id);
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
          .catch((err) => toast.error(err));
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
          .catch((err) => toast.error(err));
      }
    },
  });

  document.title = "Restaurant | Indisk";

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Manage Restaurant" breadcrumbItem="Restaurant" />
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
                          formik.setFieldValue("logo", file);
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setImagePreview(reader.result);
                            reader.readAsDataURL(file);
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
                            className="img-thumbnail"
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              cursor: "pointer",
                            }}
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
                        value={formik.values.isActive}
                        invalid={
                          formik.touched.isActive && !!formik.errors.isActive
                        }
                      >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Input>
                      <FormFeedback>{formik.errors.isActive}</FormFeedback>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="text-end">
                      <Button type="submit" color="success">
                        {isEdit ? "Update" : "Save"}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </form>
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
