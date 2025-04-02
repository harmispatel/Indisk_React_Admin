import Call from "./Call";

const Login = async (data) => {
  let d = await Call({
    path: "api/login",
    method: "post",
    data,
  });
  return d;
};

const exportObject = {
  Login,
};

export default exportObject;
