import React from "react";
import { useField } from "formik";
import AsyncSelect from ".";

interface Props {
  name: string;
  url: string;
  labelKey: string;
  valueKey: string;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: any;
  params?: Record<string, any>;
  label?: string;
  isMulti?: boolean;
  onChange?: (value: any, option: any) => void;
}

const AsyncSelectFormik: React.FC<Props> = ({
  name,
  label,
  isMulti = false,
  url,
  labelKey,
  valueKey,
  placeholder,
  disabled,
  defaultValue,
  params,
  onChange,
}) => {
  const [field, meta, helpers] = useField(name);
  const { setValue, setTouched } = helpers;

  const safeValue = () =>
    isMulti
      ? Array.isArray(field.value)
        ? field.value
        : []
      : field.value ?? undefined;

  // Itemdan kerakli ID ni chiqarish (controller_id ustuvor)
  const pickId = (opt: any, fallback: any) => {
    const item = opt && (opt.item || opt); // Option.props.item yoki bevosita obyekt
    if (
      name === "controller_id" &&
      item &&
      typeof item.controller_id !== "undefined"
    ) {
      return item.controller_id;
    }
    if (item && typeof item[valueKey] !== "undefined") return item[valueKey];
    if (item && typeof item.id !== "undefined") return item.id;
    if (typeof fallback !== "undefined") return fallback; // Select’dan kelgan val
    return undefined;
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            marginBottom: 4,
            color: "var(--text-color)",
          }}
        >
          {label}
        </label>
      )}

      <AsyncSelect
        url={url}
        labelKey={labelKey}
        valueKey={valueKey}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={defaultValue}
        params={params}
        isMulti={isMulti}
        value={safeValue()}
        onClear={() => setValue(isMulti ? [] : undefined)}
        onChange={(val: any, option: any) => {
          // isMulti: option -> Option[]; single: option -> Option
          if (isMulti) {
            const arr = Array.isArray(option) ? option : [];
            const ids = arr
              .map((o) => pickId(o, undefined))
              .filter((x) => typeof x !== "undefined");
            setValue(ids);
            setTouched(true);
            onChange && onChange(ids, option);
          } else {
            const id = pickId(option, val);
            setValue(id);
            setTouched(true);
            onChange && onChange(id, option);
          }
        }}
      />

      {meta.touched && meta.error ? (
        <div style={{ color: "#ff6d6d", marginTop: 6, fontSize: 12 }}>
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export default AsyncSelectFormik;

// import React from "react";
// import { useField, useFormikContext } from "formik";
// import AsyncSelect from ".";

// interface Props {
//   name: string;
//   url: string;
//   labelKey: string;
//   valueKey: string;
//   placeholder?: string;
//   disabled?: boolean;
//   defaultValue?: any;
//   params?: Record<string, any>;
//   label?: string;
//   onChange?: (value: any, item: any) => void;
//   isMulti?: boolean;
// }

// const AsyncSelectFormik: React.FC<Props> = ({
//   name,
//   label,
//   onChange,
//   isMulti = false,
//   ...rest
// }) => {
//   const [field] = useField(name);
//   const { setFieldValue } = useFormikContext<any>();

//   const safeValue = () => {
//     if (isMulti) {
//       return Array.isArray(field.value) ? field.value : [];
//     }
//     return field.value !== undefined ? field.value : undefined;
//   };

//   return (
//     <div style={{ marginBottom: 16 }}>
//       {label && (
//         <label
//           htmlFor={name}
//           style={{
//             display: "block",
//             marginBottom: 4,
//             color: "var(--text-color)",
//           }}
//         >
//           {label}
//         </label>
//       )}
//       <AsyncSelect
//         {...rest}
//         defaultValue={safeValue()}
//         isMulti={isMulti}
//         onChange={(val: any, item: any) => {
//           if (isMulti) {
//             const ids = Array.isArray(item) ? item.map((el) => el.id) : [];
//             setFieldValue(name, ids);
//           } else {
//             setFieldValue(name, item?.controller_id);
//             if (onChange) onChange(val, item);
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default AsyncSelectFormik;
