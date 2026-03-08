import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  Form as AntForm,
  message,
  Typography,
  Space,
} from "antd";
import { Formik, Form } from "formik";
import { loadData } from "../../utils/api";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

type FormValues = {
  username: string;
  password: string;
  confirm: string;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [initial, setInitial] = useState<FormValues>({
    username: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const validate = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};
    const uname = (values.username || "").trim();
    if (!uname) errors.username = "Введите логин";

    const pwd = (values.password || "").trim();
    const cnf = (values.confirm || "").trim();

    if (pwd.length > 0 && pwd.length < 4) {
      errors.password = "Минимум 4 символа";
    }
    if (pwd && cnf && pwd !== cnf) {
      errors.confirm = "Пароли не совпадают";
    }
    return errors;
  };

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      setLoading(true);

      const payload: { username: string; password?: string } = {
        username: values.username.trim(),
      };
      if (values.password.trim().length > 0) {
        payload.password = values.password.trim();
      }

      await loadData({
        url: "/admin/me",
        method: "put",
        data: payload,
      });

      message.success("Профиль обновлён");
      setInitial({ username: payload.username, password: "", confirm: "" });
      resetForm({
        values: { username: payload.username, password: "", confirm: "" },
      });
      navigate("/");
    } catch (e: any) {
      const msg =
        (e && e.errorMessage) ||
        (e && e.message) ||
        "Не удалось обновить профиль";
      message.error(msg);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-me-page">
      <Card className="admin-me-card">
        <Space direction="vertical" size={6} style={{ width: "100%" }}>
          <Title level={4} style={{ marginBottom: 24 }}>
            Обновить данные администратора
          </Title>
          <Text type="secondary" style={{ marginBottom: "14px" }}>
            Измените логин и при необходимости пароль.
          </Text>
        </Space>

        <Formik<FormValues>
          enableReinitialize
          initialValues={initial}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <AntForm.Item
                label="Логин"
                validateStatus={
                  touched.username && errors.username ? "error" : ""
                }
                help={
                  touched.username && errors.username ? errors.username : ""
                }
              >
                <Input
                  name="username"
                  placeholder="Введите логин"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="username"
                />
              </AntForm.Item>

              <AntForm.Item
                label="Новый пароль (по желанию)"
                validateStatus={
                  touched.password && errors.password ? "error" : ""
                }
                help={
                  touched.password && errors.password ? errors.password : ""
                }
              >
                <Input.Password
                  name="password"
                  placeholder="Введите новый пароль"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
              </AntForm.Item>

              <AntForm.Item
                label="Подтверждение пароля"
                validateStatus={
                  touched.confirm && errors.confirm ? "error" : ""
                }
                help={touched.confirm && errors.confirm ? errors.confirm : ""}
              >
                <Input.Password
                  name="confirm"
                  placeholder="Повторите пароль"
                  value={values.confirm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
              </AntForm.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading || isSubmitting}
                block
                size="large"
              >
                Сохранить
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Profile;
