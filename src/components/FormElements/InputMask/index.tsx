import React from "react";
import { useField } from "formik";
// @ts-ignore
import InputMask from "react-input-mask";
import { Input } from "antd";
import "./style.scss";

interface PhoneInputFormikProps {
  name: string;
  label?: string;
  placeholder?: string;
}

const PhoneInputFormik: React.FC<PhoneInputFormikProps> = ({
  name,
  label,
  placeholder,
}) => {
  const [field, meta] = useField(name);

  return (
    <div className="custom-input">
      {label && <label className="custom-input-label">{label}</label>}
      <InputMask
        mask="+\9\9\8 99 999 99 99"
        value={field.value}
        onChange={field.onChange}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            name={field.name}
            placeholder={placeholder || "+998 __ ___ __ __"}
          />
        )}
      </InputMask>
      {meta.touched && meta.error && (
        <div className="input-error">{meta.error}</div>
      )}
    </div>
  );
};

export default PhoneInputFormik;
