import { useFormik } from "formik";
import {
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
import withRouter from "../../components/Common/withRouter";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import adminService from "../../services/AdminUser";
import toast from "react-hot-toast";
import DeleteModal from "../../components/Common/DeleteModal";

const AdminUser = () => {
  const [addAdminModel, setAdminModel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState(null);
  const [isView, setIsView] = useState(false);
  const [viewAdmin, setviewAdmin] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [adminData, setAdminData] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);

  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  const handleImageClick = () => {
    if (imagePreview) {
      toggleImageModal();
    }
  };

  const toggleModal = () => setAdminModel(!addAdminModel);

  const getAdminData = () => {
    adminService
      .getAdmin()
      .then((res) => {
        setAdminData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAdminData();
  }, []);

  const handleEditClick = (users) => {
    setUser(users);
    setImagePreview(users.image);
    setIsEdit(true);
    toggleModal();
  };

  const handleAddAdminUser = () => {
    setUser(null);
    setIsEdit(false);
    toggleModal();
    setImagePreview(null);
  };

  const handleViewClick = (data) => {
    setIsView(true);
    setviewAdmin(data);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const confirmDelete = (data) => {
    setDeleteUser(data);
    toggleDeleteModal();
  };

  const handleConfirmDelete = () => {
    if (!deleteUser) return;

    adminService
      .deleteAdmin({ id: deleteUser._id })
      .then((res) => {
        if (res.success === true) {
          toast.success(res.message);
          getAdminData();
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });

    toggleDeleteModal();
  };

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
        Header: "Name",
        accessor: "name",
        filterable: true,
        Cell: ({ value }) => <div className="text-body fw-bold">{value}</div>,
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: true,
      },
      {
        Header: "Image",
        accessor: "image",
        disableFilters: true,
        filterable: false,
        Cell: ({ value }) => (
          <div className="d-flex justify-content-center align-items-center">
            <img className="avatar-md" src={value} alt="" />
          </div>
        ),
      },

      {
        Header: "Action",
        accessor: "action",
        disableFilters: true,
        Cell: ({ row }) => {
          return (
            <div className="d-flex gap-3">
              {/* <Link to="#" className="text-success">
                <i
                  className="mdi mdi-eye-outline font-size-18"
                  id="viewtooltip"
                ></i>
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View
                </UncontrolledTooltip>
              </Link> */}
              <Link
                to="#"
                className="text-success"
                onClick={() => handleEditClick(row.original)}
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (adminData && adminData?._id) || "",
      name: (user && user?.name) || "",
      email: (user && user?.email) || "",
      password: (user && user?.password) || "",
      image: (user && user?.image) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required!"),
      email: Yup.string()
        .email("Must be a valid Email!")
        .max(255)
        .required("Email is required!"),
      password: Yup.string().required("Password is required"),
      image: Yup.mixed()
        .test("fileRequired", "image is required!", function (value) {
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
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("image", values.image);

      if (isEdit) {
        formData.append("id", user?._id);
        adminService
          .editAdmin(formData)
          .then((res) => {
            if (res.success === true) {
              toast.success(res.message);
              toggleModal();
              getAdminData();
            } else {
              toast.error(res.message);
            }
          })
          .catch((err) => {
            toast.error(err);
          });
      } else {
        adminService
          .addAdmin(formData)
          .then((res) => {
            if (res.success === true) {
              toast.success(res.message);
              toggleModal();
              getAdminData();
              formik.resetForm();
            } else {
              toast.error(res.message);
            }
          })
          .catch((err) => {
            toast.error(err);
          });
      }
    },
  });

  document.title = "Admin users | Indisk";

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Manage Admin Users" breadcrumbItem="Users" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={adminData}
                    isGlobalFilter={true}
                    isAddAdminUser={true}
                    handleAddAdminUser={handleAddAdminUser}
                    customPageSize={10}
                    className="custom-header-css"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Modal
            isOpen={addAdminModel}
            toggle={toggleModal}
            backdrop="static"
            keyboard={false}
          >
            <ModalHeader
              toggle={() => {
                toggleModal();
                formik.resetForm();
                setImagePreview("");
              }}
              tag="h4"
            >
              {isEdit ? "Edit user" : "Add user"}
            </ModalHeader>
            <ModalBody>
              <form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col className="col-12">
                    <div className="mb-3">
                      <Label className="form-label">Name</Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Insert Name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name || ""}
                        invalid={
                          formik.touched.name && formik.errors.name
                            ? true
                            : false
                        }
                      />
                      {formik.touched.name && formik.errors.name ? (
                        <FormFeedback type="invalid">
                          {formik.errors.name}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">email</Label>
                      <Input
                        name="email"
                        type="text"
                        placeholder="Insert email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email || ""}
                        invalid={
                          formik.touched.email && formik.errors.email
                            ? true
                            : false
                        }
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <FormFeedback type="invalid">
                          {formik.errors.email}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Password</Label>
                      <Input
                        name="password"
                        type="text"
                        placeholder="Insert password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password || ""}
                        invalid={
                          formik.touched.password && formik.errors.password
                            ? true
                            : false
                        }
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <FormFeedback type="invalid">
                          {formik.errors.password}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Image</Label>
                      <Input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          if (file) {
                            formik.setFieldValue("image", file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.image && !!formik.errors.image}
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="image_Preview"
                            className="avatar-md"
                          />
                        </div>
                      )}
                      {formik.touched.image && formik.errors.image ? (
                        <FormFeedback type="invalid">
                          {formik.errors.image}
                        </FormFeedback>
                      ) : null}
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

          <Modal isOpen={isImageModalOpen} toggle={toggleImageModal} centered>
            <ModalHeader toggle={toggleImageModal}>View Image</ModalHeader>
            <ModalBody>
              <img
                src={imagePreview}
                alt="Full view"
                className="img-fluid"
                style={{ maxWidth: "100%", maxHeight: "400px" }}
              />
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

export default withRouter(AdminUser);
