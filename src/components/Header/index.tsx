import React, { useState } from "react";
import { Switch, Tooltip, Dropdown, Avatar, Modal, Input, message } from "antd";
import type { MenuProps } from "antd";
import {
  BulbOutlined,
  MoonOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import "./style.scss";

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: (checked: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.data);
  const username = user?.username ?? "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const [authOpen, setAuthOpen] = useState(false);
  const [val, setVal] = useState("");

  const handleProfileClick = () => {
    setVal("");
    setAuthOpen(true);
  };

  const handleOk = () => {
    if (val.trim() === username) {
      setAuthOpen(false);
      navigate("/profile");
    } else {
      message.error("Неверный пароль");
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span>Выйти</span>,
      onClick: handleLogout,
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <span>Профиль</span>,
      onClick: handleProfileClick,
    },
  ];

  return (
    <div className="header">
      <h1>Garage Car Wash Admin</h1>

      <div className="header-right">
        <Tooltip>
          <Switch
            checked={darkMode}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<BulbOutlined />}
            onChange={toggleTheme}
            className="theme-switch"
          />
        </Tooltip>

        {user && (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <div className="account-box">
              <p className="account-box-title">{user?.username}</p>
              <Avatar size="small" icon={<UserOutlined />} />
            </div>
          </Dropdown>
        )}
      </div>

      <Modal
        title="Введите пароль"
        open={authOpen}
        onOk={handleOk}
        okText="Открыть"
        cancelText="Отмена"
        onCancel={() => setAuthOpen(false)}
        destroyOnClose
        styles={{
          body: {
            minHeight: 100,
            gap: 12,
          },
        }}
      >
        <Input.Password
          autoFocus
          placeholder="Пароль (введите имя пользователя)"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onPressEnter={handleOk}
        />
      </Modal>
    </div>
  );
};

export default Header;
