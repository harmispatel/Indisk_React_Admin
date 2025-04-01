import { takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import { GET_CHARTS_DATA } from "./actionTypes";

function* getChartsData({ payload: periodType }) {}

export function* watchGetChartsData() {
  yield takeEvery(GET_CHARTS_DATA, getChartsData);
}

function* dashboardSaga() {
  yield all([fork(watchGetChartsData)]);
}

export default dashboardSaga;
