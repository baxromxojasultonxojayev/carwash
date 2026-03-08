import { Input } from "antd";
import "./style.scss";
import { useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

interface CustomInputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  type,
  label,
  placeholder,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  return (
    <div className="custom-input">
      <label className="custom-input-label">{label}</label>
      <Input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        className="custom-input-field"
        placeholder={placeholder}
        suffix={
          isPassword &&
          (showPassword ? (
            <EyeTwoTone onClick={() => setShowPassword(false)} />
          ) : (
            <EyeInvisibleOutlined onClick={() => setShowPassword(true)} />
          ))
        }
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CustomInput;
