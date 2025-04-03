import Call from "./Call";

const Login = async (data) => {
  let d = await Call({
    path: "api/login",
    method: "post",
    data,
  });
  return d;
};

const ForgotPassword = async (data) => {
  let d = await Call({
    path: "api/forgot-password",
    method: "post",
    data,
  });
  return d;
};

const exportObject = {
  Login,
  ForgotPassword,
};

export default exportObject;
