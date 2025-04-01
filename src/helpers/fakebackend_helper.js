import { post } from "./api_helper";
import * as url from "./url_helper";

const postFakeLogin = (data) => post(url.POST_FAKE_LOGIN, data);

const postJwtLogin = (data) => post(url.POST_FAKE_JWT_LOGIN, data);

export { postFakeLogin, postJwtLogin };
