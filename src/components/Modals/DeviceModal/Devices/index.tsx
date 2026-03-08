import React from "react";
import { Slider } from "antd";

interface SliderSectionProps {
  sliders: Record<string, number>;
  onSliderChange: (name: string, value: number) => void;
}

const Devices: React.FC<SliderSectionProps> = ({ sliders, onSliderChange }) => {
  return (
    <>
      {Object.keys(sliders).map((key) => (
        <div className="slider-row" key={key}>
          <div className="slider-label">{key}</div>
          <Slider
            min={0}
            max={100}
            value={sliders[key as keyof typeof sliders]}
            onChange={(value) => onSliderChange(key, value)}
            trackStyle={{
              backgroundColor: "#f5a623",
              height: 10,
            }}
            handleStyle={{
              borderColor: "#f5a623",
              backgroundColor: "#f5a623",
            }}
            railStyle={{
              backgroundColor: "#333",
              height: 10,
            }}
          />
          <div className="slider-value">
            {sliders[key as keyof typeof sliders]}
          </div>
        </div>
      ))}
    </>
  );
};

export default Devices;
