import React from "react";
import { Button, message } from "antd";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import "../style.scss";
import CustomInputFormik from "../../../components/FormElements/InputFormik";
import { loadData } from "../../../utils/api";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const validate = (values: { username: string; password: string }) => {
    const errors: Partial<typeof values> = {};
    if (!values.username) errors.username = "Логин обязателен";
    if (!values.password) errors.password = "Пароль обязателен";
    return errors;
  };

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", values.username);
      formData.append("password", values.password);
      const response = await loadData({
        url: "/auth/login",
        method: "post",
        data: formData,

        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("token", response.access_token);

      navigate("/");
      window.location.reload();
      message.success("Регистрация прошла успешно!");
    } catch (error) {
      console.error("Login error:", error);
      message.error("Ошибка при регистрации");
    }
  };

  return (
    <div className="auth-container">
      <h2>Вход</h2>
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
              Войти
            </Button>

            <Button
              type="default"
              onClick={() => navigate("/register")}
              block
              style={{ marginTop: "20px" }}
            >
              Зарегистрироваться
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
