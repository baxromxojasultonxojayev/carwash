import React from "react";
import CustomInput from "../../../FormElements/CustomInput";
import "./style.scss";

interface TabContentProps {
  nameValue?: string;
  priceValue?: string;
  onNameChange?: (value: string) => void;
  onPriceChange?: (value: string) => void;
}

const Modes: React.FC<TabContentProps> = ({
  nameValue,
  priceValue,
  onNameChange,
  onPriceChange,
}) => {
  return (
    <>
      <div className="tab-content-container">
        <h3 className="section-title">ВОДА</h3>
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Название</label>
            <CustomInput
              placeholder="Введите"
              value={nameValue}
              onChange={(e) => e}
            />
          </div>
          <div className="input-group">
            <label className="input-label">VFD</label>
            <CustomInput
              type="number"
              placeholder="Введите VFD"
              value={nameValue}
              onChange={(e) => e}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Dimmer</label>
            <CustomInput
              type="number"
              placeholder="Введите Dimmer"
              value={nameValue}
              onChange={(e) => e}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Цена Сум/Мин</label>
            <CustomInput
              placeholder="Введите"
              value={priceValue}
              onChange={(e) => e}
            />
          </div>
        </div>
      </div>
      <div className="tab-content-container">
        <h3 className="section-title">Воск</h3>
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Название</label>
            <CustomInput
              placeholder="Введите"
              value={nameValue}
              onChange={(e) => e}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Цена Сум/Мин</label>
            <CustomInput
              placeholder="Введите"
              value={priceValue}
              onChange={(e) => e}
            />
          </div>
        </div>
      </div>
      <div className="tab-content-container">
        <h3 className="section-title">Осмос</h3>
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Название</label>
            <CustomInput
              placeholder="Введите"
              value={nameValue}
              onChange={(e) => e}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Цена Сум/Мин</label>
            <CustomInput
              placeholder="Введите"
              value={priceValue}
              onChange={(e) => e}
            />
          </div>
        </div>
      </div>
      <div className="tab-content-container">
        <h3 className="section-title">Осмос</h3>
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">Название</label>
            <CustomInput
              placeholder="Введите"
              value={nameValue}
              onChange={(e) => e}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Цена Сум/Мин</label>
            <CustomInput
              placeholder="Введите"
              value={priceValue}
              onChange={(e) => e}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Modes;
