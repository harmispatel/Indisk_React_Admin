import React from "react";
import { Container } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";

const Dashboard = (props) => {
  document.title = "Dashboard | Admin";

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboards" breadcrumbItem="Dashboard" />
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
