import React, { useState } from "react";
import { Layout, Menu, Modal, Input, message } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  CreditCardOutlined,
  BarChartOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.data);
  const username = (user as any)?.username ?? "";

  const GUARDED = new Set<string>([
    "/devices-services",
    "/clients",
    "/statistics",
  ]);

  const [authOpen, setAuthOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [val, setVal] = useState("");

  const openGuard = (path: string) => (e: React.MouseEvent) => {
    if (GUARDED.has(path)) {
      e.preventDefault();
      setPendingPath(path);
      setVal("");
      setAuthOpen(true);
    }
  };

  const handleOk = () => {
    if (val.trim() === username) {
      setAuthOpen(false);
      navigate(pendingPath || "/");
      setPendingPath(null);
    } else {
      message.error("Неверное имя. Доступ запрещён");
    }
  };

  const GuardedLink = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <Link to={to} onClick={openGuard(to)} className="menu-link spread">
      <span>{children}</span>
      <LockOutlined className="menu-lock-right" />
    </Link>
  );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      className="custom-sidebar"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--sidebar-bg)",
        color: "var(--text-color)",
      }}
    >
      <div className="logo">
        <img
          src="/logo.jpg"
          width={200}
          height={70}
          style={{ objectFit: "cover", borderRadius: 8 }}
          alt="Logo"
        />
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="custom-menu"
        items={[
          {
            key: "/",
            icon: <DashboardOutlined />,
            label: <Link to="/">Панель</Link>,
          },
          {
            key: "/devices",
            icon: <AppstoreOutlined />,
            label: <Link to="/devices">Устройства</Link>,
          },
          {
            key: "/posts",
            icon: <AppstoreOutlined />,
            label: <Link to="/posts">Геолокация</Link>,
          },

          {
            key: "/devices-services",
            icon: <AppstoreOutlined />,
            label: <GuardedLink to="/devices-services">Сервисы</GuardedLink>,
          },
          {
            key: "/clients",
            icon: <CreditCardOutlined />,
            label: <GuardedLink to="/clients">Карта лояльности</GuardedLink>,
          },
          {
            key: "/statistics",
            icon: <BarChartOutlined />,
            label: <GuardedLink to="/statistics">Статистика</GuardedLink>,
          },

          {
            key: "/controllers",
            icon: <BarChartOutlined />,
            label: <Link to="/controllers">Контроллеры</Link>,
          },
          {
            key: "/bonus-tiers",
            icon: <BarChartOutlined />,
            label: <Link to="/bonus-tiers">Бонусные уровни</Link>,
          },
          {
            key: "/time-discounts",
            icon: <BarChartOutlined />,
            label: <Link to="/time-discounts">Скидки</Link>,
          },
        ]}
      />

      <Modal
        title="Введите имя пользователя для доступа"
        open={authOpen}
        onOk={handleOk}
        okText="Войти"
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
    </Sider>
  );
};

export default Sidebar;
