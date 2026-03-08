import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Button, message, Switch } from "antd";
import CustomInputFormik from "../../../components/FormElements/InputFormik";
import { loadData } from "../../../utils/api";

interface BonusFormProps {
  setCanUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate?: boolean;
  selected?: any;
}

const defaultValues = {
  name: "",
  min_amount: "",
  max_amount: "",
  bonus_percent: "",
  is_active: true,
};

const BonusForm: React.FC<BonusFormProps> = ({
  setCanUpdate,
  setModalVisible,
  isUpdate = false,
  selected = {},
}) => {
  const initialValues = isUpdate
    ? {
        name: selected?.name || "",
        min_amount: selected?.min_amount || 0,
        max_amount: selected?.max_amount || 0,
        bonus_percent: selected?.bonus_percent || 0,
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
        ? `/admin/bonus-tiers/${selected.id}`
        : "/admin/bonus-tiers/";

      await loadData({ url, method, data: values });

      message.success(isUpdate ? "Бонус обновлен" : "Бонус создан");
      setCanUpdate((prev) => !prev);
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Xatolik:", error);
      message.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="user-form-content">
      <h3 className="section-title">
        {isUpdate ? "Редактировать бонус" : "Создать бонус"}
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
              name="min_amount"
              type="number"
              label="Мин. сумма"
              placeholder="Введите мин. сумму"
              component={CustomInputFormik}
            />
            <Field
              name="max_amount"
              type="number"
              label="Макс. сумма"
              placeholder="Введите макс. сумму"
              component={CustomInputFormik}
            />
            <Field
              name="bonus_percent"
              label="Бонус (%)"
              placeholder="Введите бонус (%)"
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

export default BonusForm;
