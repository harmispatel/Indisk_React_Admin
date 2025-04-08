import React, { useEffect, useMemo, useState } from "react";
import withRouter from "../../components/Common/withRouter";
import {
  Badge,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";
import { Link } from "react-router-dom";
import restaurantService from "../../services/Restaurant.jsx";
import toast from "react-hot-toast";
import DeleteModal from "../../components/Common/DeleteModal.js";

const Restaurant = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteRestaurant, setDeleteRestaurant] = useState(null);

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
        accessor: "image",
        disableFilters: true,
        filterable: false,
        Cell: ({ value }) => <img className="avatar-md" src={value} alt="" />,
      },

      {
        Header: "IsActive?",
        accessor: "isActive",
        filterable: true,
        Cell: ({ value }) => (
          <Badge color={value === "true" ? "success" : "danger"}>
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
                // onClick={() => handleEditClick(row.original)}
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

  const handleAddRestaurant = () => {};

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
