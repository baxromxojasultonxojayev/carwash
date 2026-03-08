import { all, fork } from "redux-saga/effects";
import { watchLoadDefault } from "./loadDefaultSaga";

export default function* rootSaga() {
  yield all([fork(watchLoadDefault)]);
}
