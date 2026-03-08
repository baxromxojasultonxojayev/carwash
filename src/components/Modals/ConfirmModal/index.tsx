import React from "react";
import { Modal } from "antd";

import "./style.scss";

interface ConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLoading?: boolean; // 👈 Yangi prop
  title?: string;
  content?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  confirmLoading = false, // 👈 Default qiymat false
  title = "Подтверждение",
  content = "Вы уверены, что хотите удалить?",
}) => {
  return (
    <Modal
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      centered
      closable={false}
      okText="Удалить"
      cancelText="Отмена"
      confirmLoading={confirmLoading} // 👈 loading spinner tugmaga
    >
      <h3>{title}</h3>
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmModal;
