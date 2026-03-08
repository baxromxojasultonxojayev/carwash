import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Button, message, Switch, DatePicker, ConfigProvider } from "antd";
import ruRU from "antd/es/locale/ru_RU";

import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ru";
dayjs.extend(customParseFormat);
dayjs.locale("ru");

import "./style.scss";
import CustomInputFormik from "../../../components/FormElements/InputFormik";
import { loadData } from "../../../utils/api";

const FMT = "YYYY-MM-DD HH:mm";

interface TimeDiscountFormProps {
  setCanUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate?: boolean;
  selected?: any;
}

const defaultValues = {
  name: "",
  start_time: "",
  end_time: "",
  discount_percent: "",
  is_active: true,
};

const TimeDiscountForm: React.FC<TimeDiscountFormProps> = ({
  setCanUpdate,
  setModalVisible,
  isUpdate = false,
  selected = {},
}) => {
  const initialValues = isUpdate
    ? {
        name: selected?.name || "",
        start_time: selected?.start_time
          ? dayjs(selected.start_time).format(FMT)
          : "",
        end_time: selected?.end_time
          ? dayjs(selected.end_time).format(FMT)
          : "",
        discount_percent: selected?.discount_percent ?? 0,
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
        ? `/admin/time-discounts/${selected.id}`
        : "/admin/time-discounts/";

      await loadData({ url, method, data: values });

      message.success(isUpdate ? "Скидка обновлена" : "Скидка создана");
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
        {isUpdate ? "Редактировать скидку" : "Создать скидку"}
      </h3>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values, isSubmitting }) => {
          const startM = values.start_time
            ? dayjs(values.start_time, FMT)
            : null;
          const endM = values.end_time ? dayjs(values.end_time, FMT) : null;

          const disabledStart = (current: Dayjs) => {
            if (!endM) return false;
            return current.isAfter(endM.endOf("day"));
          };

          const disabledEnd = (current: Dayjs) => {
            if (!startM) return false;
            return current.isBefore(startM.startOf("day"));
          };

          return (
            <ConfigProvider locale={ruRU}>
              <Form>
                <Field
                  name="name"
                  label="Название"
                  placeholder="Введите название"
                  component={CustomInputFormik}
                />

                <div className="form-field">
                  <label>Начало (дата и время)</label>
                  <DatePicker
                    showTime={{ format: "HH:mm" }}
                    format={FMT}
                    value={startM || undefined}
                    onChange={(_, dateString) =>
                      setFieldValue("start_time", dateString || "")
                    }
                    disabledDate={disabledStart}
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Выберите дату"
                  />
                </div>

                <div className="form-field" style={{ marginTop: 12 }}>
                  <label>Конец (дата и время)</label>
                  <DatePicker
                    showTime={{ format: "HH:mm" }}
                    format={FMT}
                    value={endM || undefined}
                    onChange={(_, dateString) =>
                      setFieldValue("end_time", dateString || "")
                    }
                    disabledDate={disabledEnd}
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Выберите дату"
                  />
                </div>

                <Field
                  name="discount_percent"
                  type="number"
                  label="Скидка (%)"
                  placeholder="Введите скидку (%)"
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
            </ConfigProvider>
          );
        }}
      </Formik>
    </div>
  );
};

export default TimeDiscountForm;
