import Call from "./Call";

const getRestaurant = async (data) => {
  let d = await Call({
    path: "api/restaurant-list",
    method: "POST",
    data,
  });
  return d;
};

const addRestaurant = async (data) => {
  let d = await Call({
    path: "api/restaurant-create",
    method: "POST",
    data,
  });
  return d;
};

const editRestaurant = async (data) => {
  let d = await Call({
    path: "api/restaurant-update",
    method: "PUT",
    data,
  });
  return d;
};

const deleteRestaurant = async (data) => {
  let d = await Call({
    path: "api/restaurant-delete",
    method: "DELETE",
    data,
  });
  return d;
};

const exportObject = {
  getRestaurant,
  addRestaurant,
  editRestaurant,
  deleteRestaurant,
};

export default exportObject;
