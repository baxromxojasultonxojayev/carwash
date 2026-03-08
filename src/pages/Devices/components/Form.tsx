import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import CustomInputFormik from "../../../components/FormElements/InputFormik";
import AsyncSelectFormik from "../../../components/FormElements/AsyncSelect/AsyncSelectFormik";
import { loadData } from "../../../utils/api";
import "./style.scss";
import { Button, message, Switch } from "antd";

interface FormValues {
  name: string;
  post_id: number | null;
  cash_balance: number;
  is_active: boolean;
}

interface DeviceFormProps {
  setCanUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate?: boolean;
  selected?: any;
}

const defaultValues: FormValues = {
  name: "",
  post_id: null,
  cash_balance: 0,
  is_active: true,
};

const DeviceForm: React.FC<DeviceFormProps> = ({
  setCanUpdate,
  setModalVisible,
  isUpdate = false,
  selected = {},
}) => {
  const initialValues: FormValues = isUpdate
    ? {
        name: selected?.name || "",
        post_id: selected?.post_id || null,
        cash_balance: selected?.cash_balance || 0,
        is_active: selected?.is_active ?? true,
      }
    : defaultValues;

  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    const method = isUpdate ? "put" : "post";
    const url = isUpdate ? `/admin/kiosks/${selected.id}` : "/admin/kiosks/";

    const payload = {
      name: values.name,
      cash_balance: values.cash_balance,
      is_active: values.is_active,
      post_id: values.post_id,
    };

    try {
      await loadData({ url, method, data: payload });
      message.success(isUpdate ? "Киоск обновлен" : "Киоск успешно создан");
      setCanUpdate((prev) => !prev);
      setModalVisible(false);
      formikHelpers.resetForm();
    } catch (err) {
      console.error("Ошибка при сохранении киоска:", err);
      message.error(
        isUpdate ? "Ошибка при обновлении" : "Ошибка при создании киоска"
      );
    }
  };

  return (
    <div className="user-form-content">
      <h3 className="section-title">
        {isUpdate ? "Редактирование киоска" : "Создание киоска"}
      </h3>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form>
            <Field
              name="name"
              label="Название"
              placeholder="Введите название"
              component={CustomInputFormik}
            />

            <Field
              name="cash_balance"
              label="Касса (наличные)"
              component={CustomInputFormik}
            />

            <AsyncSelectFormik
              name="post_id"
              label="Выберите пост"
              url="/admin/posts/"
              valueKey="id"
              labelKey="name"
              placeholder="Выберите пост"
              onChange={(val, item) => setFieldValue("post_id", val)}
            />

            <div style={{ marginTop: 12, marginBottom: 16 }}>
              <label>Активен: </label>
              <Switch
                checked={values.is_active}
                onChange={(checked) => setFieldValue("is_active", checked)}
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              block
            >
              Сохранить
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DeviceForm;
