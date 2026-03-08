import { createAction } from "@reduxjs/toolkit";

export const LoadDefault = {
  request: createAction<{
    url: string;
    method?: "get" | "post" | "put" | "delete";
    data?: any;
    params?: any;
    cb?: {
      success?: (res: any) => void;
      error?: (err: any) => void;
    };
  }>("loadDefault/request"),
};
