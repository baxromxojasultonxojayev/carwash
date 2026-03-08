import React from "react";
import { Formik, Form, Field } from "formik";
import { Button, InputNumber, message } from "antd";
import { loadData } from "../../../utils/api"; // sizning api helper

interface TopUpFormProps {
  kioskId: number | string;
  setIsTopUp: (val: boolean) => void;
  setCanUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopUpForm: React.FC<TopUpFormProps> = ({
  setCanUpdate,
  kioskId,
  setIsTopUp,
}) => {
  const handleSubmit = async (values: { amount: number | null }) => {
    try {
      await loadData({
        url: `/admin/kiosks/${kioskId}/topup`,
        method: "post",
        data: { amount: values.amount },
      });
      message.success("Баланс успешно пополнен");
      setIsTopUp(false);
      setCanUpdate((prev) => !prev);
    } catch (err) {
      console.error("❌ Ошибка при пополнении:", err);
      message.error("Ошибка при пополнении баланса");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>💰 Пополнение баланса</h3>
      <Formik initialValues={{ amount: null }} onSubmit={handleSubmit}>
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <label>Сумма (в сумах):</label>
            <Field name="amount">
              {({ field }: any) => (
                <InputNumber
                  {...field}
                  min={0}
                  placeholder="0"
                  style={{ width: "100%", marginBottom: 16 }}
                  onChange={(val) => setFieldValue("amount", val)}
                />
              )}
            </Field>
            <div style={{ display: "flex", gap: 8 }}>
              <Button onClick={() => setIsTopUp(false)}>Отмена</Button>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Пополнить
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TopUpForm;
