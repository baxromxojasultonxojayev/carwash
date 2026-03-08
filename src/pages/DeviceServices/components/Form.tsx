import React from "react";
import { Button, message } from "antd";
import { Formik, Form } from "formik";
import { loadData } from "../../../utils/api";
import "./style.scss";

interface Props {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  setCanUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate?: boolean;
  selected?: any;
}

const DeviceServiceModal: React.FC<Props> = ({
  onClose,
  setCanUpdate,
  isUpdate = false,
  selected = {},
}) => {
  const initialValues = {
    name: selected.name || "",
    price_per_minute:
      typeof selected.price_per_minute === "number"
        ? String(selected.price_per_minute)
        : "",
    is_active: selected.is_active ?? true,
    command_str: selected.command_str || "",
    relay_bits: selected?.relay_bits || "",
    pump1_power:
      typeof selected.pump1_power === "number"
        ? String(selected.pump1_power)
        : "",
    pump2_power:
      typeof selected.pump2_power === "number"
        ? String(selected.pump2_power)
        : "",
    pump3_power:
      typeof selected.pump3_power === "number"
        ? String(selected.pump3_power)
        : "",
    pump4_power:
      typeof selected.pump4_power === "number"
        ? String(selected.pump4_power)
        : "",
    motor_frequency:
      typeof selected.motor_frequency === "number"
        ? String(selected.motor_frequency)
        : "",
    motor_flag: (selected.motor_flag || "").toString().toUpperCase(),
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: any
  ) => {
    try {
      const method = isUpdate ? "put" : "post";
      const url = isUpdate
        ? `/admin/services/${selected?.id}`
        : "/admin/services/";

      const payload = {
        ...values,
        price_per_minute: values.price_per_minute
          ? Number(values.price_per_minute)
          : null,
        pump1_power: values.pump1_power ? Number(values.pump1_power) : 0,
        pump2_power: values.pump2_power ? Number(values.pump2_power) : 0,
        pump3_power: values.pump3_power ? Number(values.pump3_power) : 0,
        pump4_power: values.pump4_power ? Number(values.pump4_power) : 0,
        motor_frequency: values.motor_frequency
          ? Number(values.motor_frequency)
          : null,
        motor_flag: (values.motor_flag || "").toUpperCase(),
      };

      await loadData({ url, method, data: payload });

      message.success(isUpdate ? "Сервис обновлен" : "Сервис успешно создан");
      setCanUpdate((prev) => !prev);
      onClose(false);
      if (!isUpdate) resetForm();
    } catch (err) {
      console.error(err);
      message.error("Ошибка при сохранении");
    }
  };

  return (
    <div className="device-service-modal">
      <h3 className="section-title">
        {isUpdate ? "Редактировать сервис" : "Создание сервиса"}
      </h3>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue, isSubmitting }) => (
          <Form className="ds-form">
            <div className="ds-grid">
              <div className="ds-field">
                <label>Название</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Введите название"
                  value={values.name}
                  onChange={handleChange}
                />
              </div>

              <div className="ds-field">
                <label>Цена за минуту</label>
                <input
                  name="price_per_minute"
                  type="number"
                  placeholder="Введите цену за минуту"
                  value={values.price_per_minute}
                  onChange={handleChange}
                />
              </div>

              <div className="ds-field ds-col-2">
                <label>Команда</label>
                <input
                  name="command_str"
                  type="text"
                  placeholder="Введите команду"
                  value={values.command_str}
                  onChange={handleChange}
                />
              </div>

              <div className="ds-field">
                <label>Relay bits</label>
                <input
                  name="relay_bits"
                  type="text"
                  placeholder="Введите 8 бит (например 01010101)"
                  inputMode="numeric"
                  maxLength={8}
                  value={values.relay_bits}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^01]/g, "").slice(0, 8);
                    setFieldValue("relay_bits", v);
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    let text = e.clipboardData.getData("text") || "";
                    text = text.replace(/[^01]/g, "").slice(0, 8);
                    setFieldValue("relay_bits", text);
                  }}
                />
              </div>

              <div className="ds-field">
                <label>Частота мотора</label>
                <input
                  name="motor_frequency"
                  type="number"
                  min={0}
                  max={50}
                  placeholder="Введите частоту мотора"
                  value={values.motor_frequency}
                  onChange={(e) => {
                    let val = parseFloat(e.target.value);

                    if (isNaN(val)) {
                      setFieldValue("motor_frequency", "");
                      return;
                    }

                    if (val < 0) val = 0;
                    if (val > 50) val = 50;

                    const fixed = Number(val.toFixed(1));
                    setFieldValue("motor_frequency", fixed);
                  }}
                />
              </div>

              <div className="ds-field">
                <label>Насос 1</label>
                <input
                  name="pump1_power"
                  type="number"
                  placeholder="Введите мощность насоса 1"
                  value={values.pump1_power}
                  min={0}
                  max={99}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);

                    if (isNaN(val)) {
                      setFieldValue("pump1_power", "");
                      return;
                    }

                    if (val < 0) val = 0;
                    if (val > 99) val = 99;

                    setFieldValue("pump1_power", val);
                  }}
                />
              </div>

              <div className="ds-field">
                <label>Насос 2</label>
                <input
                  name="pump2_power"
                  type="number"
                  placeholder="Введите мощность насоса 2"
                  value={values.pump2_power}
                  min={0}
                  max={99}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);

                    if (isNaN(val)) {
                      setFieldValue("pump2_power", "");
                      return;
                    }

                    if (val < 0) val = 0;
                    if (val > 99) val = 99;

                    setFieldValue("pump2_power", val);
                  }}
                />
              </div>

              <div className="ds-field">
                <label>Насос 3</label>
                <input
                  name="pump3_power"
                  type="number"
                  placeholder="Введите мощность насоса 3"
                  value={values.pump3_power}
                  min={0}
                  max={99}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);

                    if (isNaN(val)) {
                      setFieldValue("pump3_power", "");
                      return;
                    }

                    if (val < 0) val = 0;
                    if (val > 99) val = 99;

                    setFieldValue("pump3_power", val);
                  }}
                />
              </div>

              <div className="ds-field">
                <label>Насос 4</label>
                <input
                  name="pump4_power"
                  type="number"
                  placeholder="Введите мощность насоса 4"
                  value={values.pump4_power}
                  min={0}
                  max={99}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);

                    if (isNaN(val)) {
                      setFieldValue("pump4_power", "");
                      return;
                    }

                    if (val < 0) val = 0;
                    if (val > 99) val = 99;

                    setFieldValue("pump4_power", val);
                  }}
                />
              </div>

              <div className="ds-field">
                <label>Флаг мотора (F yoki S)</label>
                <input
                  name="motor_flag"
                  type="text"
                  maxLength={1}
                  placeholder="Введите флаг мотора"
                  value={values.motor_flag}
                  onChange={(e) => {
                    const v = (e.target.value || "")
                      .toUpperCase()
                      .replace(/[^FS]/g, "")
                      .slice(0, 1);
                    setFieldValue("motor_flag", v);
                  }}
                  onBlur={(e) =>
                    setFieldValue(
                      "motor_flag",
                      (e.target.value || "").toUpperCase().slice(0, 1)
                    )
                  }
                />
              </div>

              <div className="ds-field ds-col-2 ds-checkbox">
                <label className="ds-switch">
                  <input
                    type="checkbox"
                    checked={values.is_active}
                    onChange={(e) =>
                      setFieldValue("is_active", e.target.checked)
                    }
                  />
                  <span>Активен</span>
                </label>
              </div>
            </div>

            <div className="ds-actions">
              <Button onClick={() => onClose(false)}>Отмена</Button>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                {isUpdate ? "Обновить" : "Сохранить"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DeviceServiceModal;
