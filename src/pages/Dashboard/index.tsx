import qs from "qs";

import Filter from "./components/Filter";
import SummaryPanel from "./components/SummaryPanel/SummaryPanel";
import { useLocation } from "react-router-dom";
import "./style.scss";
import SummaryBarchart from "./components/barchart";
import { Col, Row } from "antd";
import DashboardCard from "../../components/Cards/DashboardCard";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { LoadDefault } from "../../store/actions/loadDefault";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/slices/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    total_clients: 0,
    active_clients_this_week: 0,
    new_clients_this_week: 0,
    period_info: {
      current_week_start: "",
      current_week_end: "",
      last_month_start: "",
      last_month_end: "",
    },
  });
  const location = useLocation();
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  }) as any;

  const getCardStatistics = () => {
    dispatch(setLoading(true));
    dispatch(
      LoadDefault.request({
        url: "/statistics/clients",
        cb: {
          success: (response) => {
            setStats({
              total_clients: response.total_clients || 0,
              active_clients_this_week: response.active_clients_this_week || 0,
              new_clients_this_week: response.new_clients_this_week || 0,
              period_info: response.period_info || {
                current_week_start: "",
                current_week_end: "",
                last_month_start: "",
                last_month_end: "",
              },
            });
            dispatch(setLoading(false));
          },
          error: (error) => {
            console.error("❌ Xatolik:", error);
            dispatch(setLoading(false));
          },
        },
      })
    );
  };
  useEffect(() => {
    setTimeout(() => {
      getCardStatistics();
    }, 1000);
  }, []);
  return (
    <div className="dashboard">
      <div className="summary-panel">
        <div className="client-header">
          <Row
            gutter={[16, 16]}
            style={{
              display: "flex",
            }}
          >
            <>
              <Col xs={24} sm={12} md={5}>
                <DashboardCard
                  title="Всего клиентов"
                  value={stats.total_clients}
                  subtext={`с ${stats.period_info.last_month_start} по ${stats.period_info.last_month_end}`}
                  icon={<UserOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={5}>
                <DashboardCard
                  title="Пришло клиентов"
                  value={stats.active_clients_this_week}
                  subtext={`на этой неделе (${stats.period_info.current_week_start} - ${stats.period_info.current_week_end})`}
                  icon={<UserOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={5}>
                <DashboardCard
                  title="Новые клиенты"
                  value={stats.new_clients_this_week}
                  subtext={`на этой неделе (${stats.period_info.current_week_start} - ${stats.period_info.current_week_end})`}
                  icon={<UserOutlined />}
                />
              </Col>
            </>
          </Row>
        </div>
        {/* <SummaryPanel query={query} /> */}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          alignItems: "stretch",
          marginTop: 50,
        }}
      >
        <div>
          <Filter />
        </div>
      </div>
      <div>
        <SummaryBarchart />
      </div>
    </div>
  );
};

export default Dashboard;
