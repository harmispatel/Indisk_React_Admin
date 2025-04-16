import Call from "./Call";

const getAdmin = async (data) => {
  let d = await Call({
    path: "api/admin-list",
    method: "POST",
    data,
  });
  return d;
};

const addAdmin = async (data) => {
  let d = await Call({
    path: "api/admin-create",
    method: "POST",
    data,
  });
  return d;
};

const editAdmin = async (data) => {
  let d = await Call({
    path: "api/admin-update",
    method: "PUT",
    data,
  });
  return d;
};

const deleteAdmin = async (data) => {
  let d = await Call({
    path: "api/admin-delete",
    method: "DELETE",
    data,
  });
  return d;
};

const exportObject = {
  getAdmin,
  addAdmin,
  editAdmin,
  deleteAdmin,
};

export default exportObject;
