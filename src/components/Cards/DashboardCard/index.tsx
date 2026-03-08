import React from "react";
import { Card, Button } from "antd";
import "./style.scss";

interface CardComponentProps {
  title: string;
  value?: number;
  subtext: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
}

const DashboardCard: React.FC<CardComponentProps> = ({
  title,
  value,
  subtext,
  icon,
  buttonText,
  onButtonClick,
}) => {
  return (
    <Card className="modern-card" variant="borderless">
      <div className="card-header">
        <span>{title}</span>
        {icon && <span className="card-icon">{icon}</span>}
      </div>
      <p className="card-value">{value}</p>
      <p className="card-subtext">{subtext}</p>
      {buttonText && (
        <Button
          type="primary"
          className="card-button"
          onClick={onButtonClick}
          block
        >
          {buttonText}
        </Button>
      )}
    </Card>
  );
};

export default DashboardCard;
