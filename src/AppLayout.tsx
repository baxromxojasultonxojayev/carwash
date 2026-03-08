import React, { useEffect, useState } from "react";
import { Layout, Spin } from "antd";
import { useLocation, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header";

import Devices from "./pages/Devices";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import ClientUser from "./pages/ClientUsers";
import TerminalView from "./pages/TerminalPreview";
import Settings from "./pages/Settings";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import { LoadDefault } from "./store/actions/loadDefault";
import { setUser, clearUser } from "./store/slices/userSlice";
import { RootState } from "./store/configureStore";
import { setLoading } from "./store/slices/authSlice";
import DeviceServices from "./pages/DeviceServices";
import Posts from "./pages/Posts";
import BonusTiers from "./pages/BonusTiers";
import TimeDiscounts from "./pages/TimeDiscounts";
import Controllers from "./pages/Controllers";
import Profile from "./pages/Profile";

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const user = useSelector((state: RootState) => state.user.data);
  const loading = useSelector((state: RootState) => state.user.loading);

  const toggleTheme = (checked: boolean) => {
    setDarkMode(checked);
    document.body.className = checked ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  const getData = () => {
    dispatch(setLoading(true));
    dispatch(
      LoadDefault.request({
        url: "/admin/me",
        params: {
          extra: { status: "active" },
        },
        cb: {
          success: (response) => {
            dispatch(setUser(response));
            dispatch(setLoading(false));
          },
          error: (error) => {
            console.error("❌ Xatolik:", error);
            dispatch(clearUser());
            dispatch(setLoading(false));
          },
        },
      })
    );
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    getData();
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
      document.body.className =
        savedTheme === "dark" ? "dark-mode" : "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {user && <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />}

      <Layout>
        <Header darkMode={darkMode} toggleTheme={toggleTheme} />
        <Content style={{ margin: "20px" }}>
          <Routes>
            {!user ? (
              <>
                <Route path="/*" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/devices-services" element={<DeviceServices />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/controllers" element={<Controllers />} />
                <Route path="/bonus-tiers" element={<BonusTiers />} />
                <Route path="/time-discounts" element={<TimeDiscounts />} />
                <Route path="/clients" element={<ClientUser />} />
                <Route path="/terminal-preview" element={<TerminalView />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </>
            )}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
