import Call from "./Call";

const getRestaurantOwner = async () => {
  let d = await Call({
    path: "api/restaurant-owner-list",
    method: "GET",
  });
  return d;
};

const addRestaurantOwner = async (data) => {
  let d = await Call({
    path: "api/restaurant-owner-create",
    method: "POST",
    data,
  });
  return d;
};

const editRestaurantOwner = async (data) => {
  let d = await Call({
    path: "api/restaurant-owner-update",
    method: "PUT",
    data,
  });
  return d;
};

const deleteRestaurantOwner = async (data) => {
  let d = await Call({
    path: "api/restaurant-owner-delete",
    method: "DELETE",
    data,
  });
  return d;
};

const exportObject = {
  getRestaurantOwner,
  addRestaurantOwner,
  editRestaurantOwner,
  deleteRestaurantOwner,
};

export default exportObject;
