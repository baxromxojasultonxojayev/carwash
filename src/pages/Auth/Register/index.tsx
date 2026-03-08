import React from "react";
import { Button, message } from "antd";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import CustomInputFormik from "../../../components/FormElements/InputFormik";
import "../style.scss";
import { loadData } from "../../../utils/api";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const validate = (values: { username: string; password: string }) => {
    const errors: Partial<typeof values> = {};
    if (!values.username) errors.username = "Имя пользователя обязательно";
    if (!values.password) errors.password = "Пароль обязателен";
    return errors;
  };

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await loadData({
        url: "/auth/register",
        method: "post",
        data: {
          username: values.username,
          password: values.password,
        },
      });

      message.success("Регистрация прошла успешно!");
      navigate("/");
    } catch (error) {
      message.error("Ошибка при регистрации");
      console.error("Register error:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Регистрация</h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              name="username"
              label="Логин"
              placeholder="Введите логин"
              component={CustomInputFormik}
            />

            <Field
              name="password"
              label="Пароль"
              type="password"
              placeholder="Введите пароль"
              component={CustomInputFormik}
            />

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isSubmitting}
            >
              Зарегистрироваться
            </Button>
            <Button
              type="default"
              onClick={() => navigate("/login")}
              block
              style={{ marginTop: "20px" }}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
