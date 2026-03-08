import React from "react";
import { FieldProps } from "formik";
import CustomInput from "../CustomInput";

interface Props extends FieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  onChange?: (val: string) => void; // tashqi onChange ni qo‘shamiz
}

const CustomInputFormik: React.FC<Props> = ({
  field,
  form,
  label,
  type,
  placeholder,
  onChange,
}) => {
  const rawError = form.errors[field.name];
  const errorText =
    form.touched[field.name] && typeof rawError === "string" ? rawError : "";

  const handleChange = (val: string) => {
    form.setFieldValue(field.name, val);
    if (onChange) onChange(val); // tashqi funksiyani chaqiramiz
  };

  return (
    <div>
      <CustomInput
        label={label}
        type={type}
        placeholder={placeholder}
        value={field.value}
        onChange={handleChange}
      />
      {errorText && <div className="input-error">{errorText}</div>}
    </div>
  );
};

export default CustomInputFormik;

// import React from "react";
// import { FieldProps } from "formik";
// import CustomInput from "../CustomInput";

// interface Props extends FieldProps {
//   label?: string;
//   type?: string;
//   placeholder?: string;
// }

// const CustomInputFormik: React.FC<Props> = ({
//   field,
//   form,
//   label,
//   type,
//   placeholder,
// }) => {
//   const rawError = form.errors[field.name];
//   const errorText =
//     form.touched[field.name] && typeof rawError === "string" ? rawError : "";

//   return (
//     <div>
//       <CustomInput
//         label={label}
//         type={type}
//         placeholder={placeholder}
//         value={field.value}
//         onChange={(val) => form.setFieldValue(field.name, val)}
//       />
//       {errorText && <div className="input-error">{errorText}</div>}
//     </div>
//   );
// };

// export default CustomInputFormik;
