import React, { useState } from "react";
import { Select, Spin } from "antd";
import type { SelectProps } from "antd";
import { loadData } from "../../../utils/api";
import "./style.scss";

const { Option } = Select;

export interface AsyncSelectProps {
  url: string;
  labelKey: string;
  valueKey: string;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: any;
  params?: any;
  isMulti?: boolean;
  value?: any;
  onChange: (value: any, option?: any) => void;
  onClear?: () => void;
}

const AsyncSelect: React.FC<AsyncSelectProps> = ({
  url,
  labelKey,
  valueKey,
  onChange,
  placeholder = "Выберите",
  disabled = false,
  defaultValue,
  params,
  isMulti = false,
  value,
  onClear,
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchOptions = async () => {
    if (fetched) return;
    setLoading(true);
    try {
      const data = await loadData({ url, method: "get", params });
      setOptions(Array.isArray(data) ? data : []);
      setFetched(true);
    } catch (err) {
      console.error("❌ Ошибка загрузки данных:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultValue = () =>
    isMulti
      ? Array.isArray(defaultValue)
        ? defaultValue
        : []
      : defaultValue ?? undefined;

  const handleChange: SelectProps["onChange"] = (val, option) => {
    onChange(val, option); // option ichida original item bo‘ladi (pastda qo‘ydik)
  };

  return (
    <Select
      mode={isMulti ? "multiple" : undefined}
      showSearch
      disabled={disabled}
      loading={loading}
      value={value}
      defaultValue={value === undefined ? getDefaultValue() : undefined}
      allowClear
      onClear={onClear}
      onDropdownVisibleChange={(open) => open && fetchOptions()}
      onChange={handleChange}
      placeholder={placeholder}
      style={{ width: "100%" }}
      notFoundContent={loading ? <Spin size="small" /> : "Нет данных"}
      optionFilterProp="children"
    >
      {options.map((item) => (
        // MUHIM: butun item’ni prop sifatida beramiz
        <Option
          key={item[valueKey]}
          value={item[valueKey]}
          item={item} // <-- shu orqali onChange’dagi option.item ga olamiz
        >
          {item[labelKey]}
        </Option>
      ))}
    </Select>
  );
};

export default AsyncSelect;

// import React, { useState } from "react";
// import { Select, Spin } from "antd";
// import { loadData } from "../../../utils/api";

// import "./style.scss";

// const { Option } = Select;

// interface AsyncSelectProps {
//   url: string;
//   labelKey: string;
//   valueKey: string;
//   onChange: (value: any, item?: any) => void;
//   placeholder?: string;
//   disabled?: boolean;
//   defaultValue?: any;
//   params?: any;
//   isMulti?: boolean;
// }

// const AsyncSelect: React.FC<AsyncSelectProps> = ({
//   url,
//   labelKey,
//   valueKey,
//   onChange,
//   placeholder = "Выберите",
//   disabled = false,
//   defaultValue,
//   params,
//   isMulti = false,
// }) => {
//   const [options, setOptions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [fetched, setFetched] = useState(false);

//   const fetchOptions = async () => {
//     if (fetched) return;
//     setLoading(true);
//     try {
//       const data = await loadData({ url, method: "get", params });
//       setOptions(data || []);
//       setFetched(true);
//     } catch (err) {
//       console.error("❌ Ошибка загрузки данных:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDefaultValue = () => {
//     if (isMulti) {
//       return Array.isArray(defaultValue) ? defaultValue : [];
//     }
//     return defaultValue !== undefined ? defaultValue : undefined;
//   };

//   const handleChange = (value: any) => {
//     if (isMulti) {
//       const selectedItems = options.filter((opt) =>
//         value.includes(opt[valueKey])
//       );
//       onChange(value, selectedItems);
//     } else {
//       const selectedItem = options.find((opt) => opt[valueKey] === value);
//       onChange(value, selectedItem);
//     }
//   };

//   return (
//     <Select
//       mode={isMulti ? "multiple" : undefined}
//       showSearch
//       disabled={disabled}
//       loading={loading}
//       defaultValue={getDefaultValue()}
//       onDropdownVisibleChange={(open) => {
//         if (open) fetchOptions();
//       }}
//       onChange={handleChange}
//       placeholder={placeholder}
//       style={{ width: "100%" }}
//       notFoundContent={loading ? <Spin size="small" /> : "Нет данных"}
//       optionFilterProp="children"
//     >
//       {options.map((item) => (
//         <Option key={item[valueKey]} value={item[valueKey]}>
//           {item[labelKey]}
//         </Option>
//       ))}
//     </Select>
//   );
// };

// export default AsyncSelect;
