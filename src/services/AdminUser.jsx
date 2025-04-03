import Call from "./Call";

const getAdmin = async () => {
  let d = await Call({
    path: "api/admin-list",
    method: "get",
  });
  return d;
};

const addAdmin = async (data) => {
  let d = await Call({
    path: "api/admin-create",
    method: "post",
    data,
  });
  return d;
};

const editAdmin = async (data) => {
  console.log(data, "data");
  let d = await Call({
    path: "api/admin-update",
    method: "put",
    data,
  });
  return d;
};

const deleteAdmin = async (data) => {
  let d = await Call({
    path: "api/admin-delete",
    method: "delete",
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
