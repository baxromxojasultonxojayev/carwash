import React from "react";
import { Button, message } from "antd";
import { Formik, Form, Field } from "formik";
import { loadData } from "../../../utils/api";
import CustomInputFormik from "../../../components/FormElements/InputFormik";
import PhoneInput from "../../../components/FormElements/InputMask";

interface UserClientFormProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCanUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate?: boolean;
  selected?: any;
}

const UserClientForm: React.FC<UserClientFormProps> = ({
  setModalVisible,
  setCanUpdate,
  isUpdate = false,
  selected = {},
}) => {
  const validate = (values: any) => {
    const errors: any = {};
    if (!values.manual_uid && !isUpdate) errors.manual_uid = "Обязательно";
    if (!values.holder_name) errors.holder_name = "Обязательно";
    if (!values.phone_number) errors.phone_number = "Обязательно";
    if (!values.initial_balance) errors.initial_balance = "Обязательно";
    return errors;
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      let url = "";
      let method = "";
      let payload: any = {};

      if (isUpdate) {
        url = `https://garage-group.uz/api/v1/admin/rfid-cards/${selected?.id}`;
        method = "PUT";
        payload = {
          holder_name: values.holder_name,
          phone_number: values.phone_number,
          is_active: true,
        };
      } else {
        url =
          "https://garage-group.uz/api/v1/admin/rfid-cards/register-manual-uid";
        method = "POST";
        payload = {
          manual_uid: values.manual_uid,
          holder_name: values.holder_name,
          phone_number: values.phone_number,
          initial_balance: parseFloat(values.initial_balance),
        };
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        message.success(
          isUpdate
            ? "Карта успешно обновлена"
            : "Карта успешно зарегистрирована"
        );
        resetForm();
        setModalVisible(false);
        setCanUpdate((prev) => !prev);
      } else {
        console.error("❌ Xatolik:", result);
        message.error(result?.message || "Ошибка при сохранении карты");
      }
    } catch (error) {
      console.error("❌ Server error:", error);
      message.error("Сервер не доступен");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="user-form-content">
      <h3 className="section-title">
        {isUpdate ? "РЕДАКТИРОВАТЬ" : "ПОЛЬЗОВАТЕЛЬ"}
      </h3>
      <Formik
        initialValues={{
          manual_uid: selected?.uid || "",
          holder_name: selected?.holder_name || "",
          phone_number: selected?.phone_number || "",
          initial_balance: selected?.initial_balance?.toString() || "",
        }}
        enableReinitialize
        validate={(values) => {
          const errors: any = {};
          if (!isUpdate && !values.manual_uid)
            errors.manual_uid = "Обязательно";
          if (!values.holder_name) errors.holder_name = "Обязательно";
          if (!values.phone_number) errors.phone_number = "Обязательно";
          if (!isUpdate && !values.initial_balance)
            errors.initial_balance = "Обязательно";
          return errors;
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {!isUpdate && (
              <Field
                name="manual_uid"
                label="UID"
                placeholder="Введите"
                component={CustomInputFormik}
              />
            )}
            <Field
              name="holder_name"
              label="Ф.И.О"
              placeholder="Введите"
              component={CustomInputFormik}
            />
            <Field name="phone_number" label="Номер телефона" as={PhoneInput} />
            {!isUpdate && (
              <Field
                name="initial_balance"
                label="Баланс карты"
                placeholder="Введите"
                component={CustomInputFormik}
              />
            )}
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              block
              style={{ marginTop: 20 }}
            >
              {isUpdate ? "Обновить" : "Сохранить"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserClientForm;
