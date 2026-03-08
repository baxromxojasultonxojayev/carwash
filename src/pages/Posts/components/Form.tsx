import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Button, message, Switch } from "antd";
import CustomInputFormik from "../../../components/FormElements/InputFormik";
import AsyncSelectFormik from "../../../components/FormElements/AsyncSelect/AsyncSelectFormik";
import { loadData } from "../../../utils/api";

import "./style.scss";

interface SelectOption {
  label: string;
  value: string | number;
}

interface FormValues {
  name: string;
  is_active: boolean;
  controller_id: string | SelectOption;
  available_service_ids: (string | number | SelectOption)[];
}

interface PostFormProps {
  setCanUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate?: boolean;
  selected?: any;
}

const defaultValues: FormValues = {
  name: "",
  is_active: true,
  controller_id: "",
  available_service_ids: [],
};

const PostForm: React.FC<PostFormProps> = ({
  setCanUpdate,
  setModalVisible,
  isUpdate = false,
  selected = {},
}) => {
  const initialValues: FormValues = isUpdate
    ? {
        name: selected?.name || "",
        controller_id: selected?.controller
          ? {
              label: selected.controller.name,
              value: selected.controller.id,
            }
          : selected.controller_id || "",
        is_active: selected?.is_active ?? true,
        available_service_ids:
          selected?.available_services?.map((s: any) => ({
            label: s.name,
            value: s.id,
          })) || [],
      }
    : defaultValues;

  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    try {
      const method = isUpdate ? "put" : "post";
      const url = isUpdate ? `/admin/posts/${selected.id}` : "/admin/posts/";

      const payload = {
        name: values.name,
        is_active: values.is_active,
        controller_id:
          typeof values.controller_id === "object"
            ? values.controller_id.value
            : values.controller_id,
        available_service_ids: values.available_service_ids.map((s: any) =>
          typeof s === "object" ? s.value : s
        ),
      };

      await loadData({
        url,
        method,
        data: { ...payload, controller_id: String(payload.controller_id) },
      });

      message.success(
        isUpdate ? "Пост успешно обновлен" : "Пост успешно создан"
      );
      setCanUpdate((prev) => !prev);
      setModalVisible(false);

      formikHelpers.resetForm();
    } catch (error) {
      console.error("Ошибка:", error);
      message.error(isUpdate ? "Ошибка при обновлении" : "Ошибка при создании");
    }
  };

  return (
    <div className="user-form-content">
      <h3 className="section-title">
        {isUpdate ? "Редактирование поста" : "Создание поста"}
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
              label="Название поста"
              placeholder="Введите название"
              component={CustomInputFormik}
            />
            <AsyncSelectFormik
              name="controller_id"
              label="Контроллер"
              url="/admin/controllers/"
              valueKey="id"
              labelKey="name"
              placeholder="Выберите контроллер"
            />
            <AsyncSelectFormik
              name="available_service_ids"
              label="Сервисы"
              url="/admin/services/"
              valueKey="id"
              labelKey="name"
              placeholder="Выберите сервисы"
              isMulti={true}
            />

            <div
              style={{
                marginTop: 12,
                marginBottom: 16,
                color: "var(--text-color)",
              }}
            >
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

export default PostForm;
