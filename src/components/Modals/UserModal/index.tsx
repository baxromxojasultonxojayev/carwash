import React, { useState, ReactNode } from "react";
import { Modal } from "antd";

import "./style.scss";

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  children?: ReactNode;
  height?: number;
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  onClose,
  children,
  height,
}) => {
  const [nameValue, setNameValue] = useState("");
  const [sliders, setSliders] = useState({
    VFD: 50,
    Power: 50,
    Dimmer: 50,
    Sensor: 50,
    RS485: 50,
  });

  const handleSliderChange = (name: string, value: number) => {
    setSliders((prev) => ({ ...prev, [name]: value }));
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value);
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      height={height}
      className="add-device-modal"
    >
      {children}
    </Modal>
  );
};

export default UserModal;
