import React, { useMemo } from "react";
import { Formik, Field } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "qs";
import debounce from "lodash/debounce";
import CustomInputFormik from "../../../components/FormElements/InputFormik";

const Filter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  const { search } = query;

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        const updatedQuery = qs.stringify(
          {
            ...query,
            search: value || undefined,
            page: 1,
          },
          { addQueryPrefix: true }
        );

        navigate(
          { pathname: location.pathname, search: updatedQuery },
          { replace: true }
        );
      }, 400),
    [location.pathname, navigate]
  );

  return (
    <Formik initialValues={{ search }} enableReinitialize onSubmit={() => {}}>
      {() => (
        <div style={{ padding: "8px", maxWidth: 300 }}>
          <Field
            name="search"
            placeholder="Введите"
            component={CustomInputFormik}
            onChange={(val: string) => {
              debouncedSearch(val);
            }}
          />
        </div>
      )}
    </Formik>
  );
};

export default Filter;
