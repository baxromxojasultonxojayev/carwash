import { call, takeLatest } from "redux-saga/effects";
import { LoadDefault } from "../actions/loadDefault";
import { loadData } from "../../utils/api";
import { PayloadAction } from "@reduxjs/toolkit";

interface LoadDefaultPayload {
  url: string;
  method?: "get" | "post" | "put" | "delete";
  data?: any;
  params?: any;
  cb?: {
    success?: (res: any) => void;
    error?: (err: any) => void;
  };
}

function* handleLoadDefault(
  action: PayloadAction<LoadDefaultPayload>
): Generator {
  const { url, method, data, params, cb } = action.payload;
  try {
    const response: any = yield call(loadData, { url, method, data, params });
    cb?.success?.(response);
  } catch (error) {
    cb?.error?.(error);
  }
}

export function* watchLoadDefault() {
  yield takeLatest(LoadDefault.request.type, handleLoadDefault);
}
