import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Button, message, Switch } from "antd";
import CustomInputFormik from "../../../components/FormElements/InputFormik";
import { loadData } from "../../../utils/api";

interface ControllerFormProps {
  setCanUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate?: boolean;
  selected?: any;
}

const defaultValues = {
  controller_id: null,
  name: "",
  description: "",
  ip_address: "",
  port: null,
  is_active: true,
};

const ControllerForm: React.FC<ControllerFormProps> = ({
  setCanUpdate,
  setModalVisible,
  isUpdate = false,
  selected = {},
}) => {
  const initialValues = isUpdate
    ? {
        controller_id: selected?.controller_id || null,
        name: selected?.name || "",
        description: selected?.description || "",
        ip_address: selected?.ip_address || "",
        port: selected?.port || null,
        is_active: selected?.is_active ?? true,
      }
    : defaultValues;

  const handleSubmit = async (
    values: typeof defaultValues,
    { resetForm }: FormikHelpers<typeof defaultValues>
  ) => {
    try {
      const method = isUpdate ? "put" : "post";
      const url = isUpdate
        ? `/admin/controllers/${selected?.controller_id}`
        : "/admin/controllers/";

      await loadData({ url, method, data: values });

      message.success(isUpdate ? "Контроллер обновлен" : "Контроллер создан");
      setCanUpdate((prev) => !prev);
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("❌ Xatolik:", error);
      message.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="user-form-content">
      <h3 className="section-title">
        {isUpdate ? "Редактировать контроллер" : "Создать контроллер"}
      </h3>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form>
            <Field
              name="controller_id"
              label="Controller ID"
              placeholder="Введите ID контроллера"
              component={CustomInputFormik}
            />
            <Field
              name="name"
              label="Название"
              placeholder="Введите название"
              component={CustomInputFormik}
            />
            <Field
              name="description"
              label="Описание"
              placeholder="Введите описание"
              component={CustomInputFormik}
            />
            <Field
              name="ip_address"
              label="IP-адрес"
              placeholder="Введите IP-адрес"
              component={CustomInputFormik}
            />
            <Field
              name="port"
              type="number"
              label="Порт"
              placeholder="Введите порт"
              component={CustomInputFormik}
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

export default ControllerForm;
