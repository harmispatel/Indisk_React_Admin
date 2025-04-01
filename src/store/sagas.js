import { all, fork } from "redux-saga/effects";

import LayoutSaga from "./layout/saga";
import dashboardSaga from "./dashboard/saga";

export default function* rootSaga() {
  yield all([fork(LayoutSaga), fork(dashboardSaga)]);
}
