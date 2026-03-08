import React, { useState } from "react";
import { Modal, Tabs, Slider, Button } from "antd";
import "./style.scss";
import Devices from "./Devices";
import CustomInput from "../../FormElements/CustomInput";
import Modes from "./Modes";
import AsyncSelect from "../../FormElements/AsyncSelect";

const { TabPane } = Tabs;

interface AddDeviceModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  visible,
  onClose,
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

  const onNameChange = (e: any) => {
    setNameValue(e.target.value0);
  };
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      className="add-device-modal"
    >
      <div className="modal-header">
        <span className="cancel-text" onClick={onClose}>
          Отмена
        </span>
        <span className="title">Добавить устройство</span>
        <span className="done-text" onClick={onClose}>
          Готово
        </span>
      </div>
      {/* <AsyncSelect
        url="/admin/services/"
        labelKey="name"
        valueKey="id"
        onChange={(id, item) => {
          console.log("Tanlandi:", id, item);
        }}
        placeholder="Устройство"
      /> */}
      {/* <Tabs defaultActiveKey="1" centered>
       
        <TabPane
          tab="Режимы"
          key="1"
          style={{ overflowY: "scroll", height: "500px", padding: "0 10px" }}
        >
          <Modes />
        </TabPane>

        <TabPane tab="История" key="3">
        </TabPane>
      </Tabs> */}
    </Modal>
  );
};

export default AddDeviceModal;
