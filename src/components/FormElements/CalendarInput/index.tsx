import React from "react";
import { DatePicker } from "antd";
import type { DatePickerProps } from "antd";
import dayjs from "dayjs";
import "./style.scss";

interface CalendarInputProps {
  value: string;
  onChange: (dateString: string) => void;
  placeholder?: string;
}

const CalendarInput: React.FC<CalendarInputProps> = ({
  value,
  onChange,
  placeholder = "Выберите дату",
}) => {
  const handleChange: DatePickerProps["onChange"] = (_, dateString) => {
    if (typeof dateString === "string") {
      onChange(dateString);
    }
  };
  return (
    <DatePicker
      value={value ? dayjs(value) : null}
      onChange={handleChange}
      placeholder={placeholder}
      className="calendar-input"
      format="YYYY-MM-DD"
    />
  );
};

export default CalendarInput;
