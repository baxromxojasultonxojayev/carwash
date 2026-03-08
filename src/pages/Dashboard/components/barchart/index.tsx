import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./style.scss";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { formatMoney } from "../../../../utils/formatMoney";

export interface SummaryData {
  start_date?: string;
  end_date?: string;
  by_provider: {
    click?: number;
    payme?: number;
    uzum?: number;
  };
  card?: number;
  online?: number;
  rfid?: number;
  total?: number;
  cash?: number;
}

function parseQuery(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const obj: Record<string, string> = {};
  params.forEach((v, k) => (obj[k] = v));
  return obj;
}

const SummaryBarchart: React.FC = () => {
  const location = useLocation();
  const [summary, setSummary] = useState<SummaryData | undefined>();
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => parseQuery(location.search), [location.search]);

  const today = new Date().toISOString().slice(0, 10);
  const start = (query.start_date as string) || today;
  const end = (query.end_date as string) || today;

  useEffect(() => {
    let ignore = false;

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const url = new URL(
          "https://garage-group.uz/api/v1/statistics/breakdown"
        );
        url.searchParams.append("start_date", start);
        url.searchParams.append("end_date", end);

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as SummaryData;

        if (!ignore) setSummary(data);
      } catch (err) {
        console.error("❌ Summary fetch error:", err);
        if (!ignore) setSummary(undefined);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchSummary();
    return () => {
      ignore = true;
    };
  }, [start, end]);

  if (loading) return <div>Yuklanmoqda...</div>;

  // ---- chart datasets ----
  const totalsData = [
    { name: "Наличные", Сумма: summary?.cash ?? 0 },
    { name: "Онлайн", Сумма: summary?.online ?? 0 },
    { name: "RFID", Сумма: summary?.rfid ?? 0 },
  ];

  const providersData = [
    { name: "Click", Сумма: summary?.by_provider?.click ?? 0 },
    { name: "Payme", Сумма: summary?.by_provider?.payme ?? 0 },
    { name: "Uzum", Сумма: summary?.by_provider?.uzum ?? 0 },
  ];

  return (
    <div className="summary-grid">
      <div className="summary-head">
        <div>
          <div className="summary-title">Итоги</div>
          <div className="summary-dates">
            {summary?.start_date || start || "—"} →{" "}
            {summary?.end_date || end || "—"}
          </div>
        </div>
        <div className="summary-total">
          <div className="summary-total-label">Всего</div>
          <div className="summary-total-value">
            {formatMoney(summary?.total ?? 0)}
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-label">Наличные</div>
          <div className="summary-card-val">
            {formatMoney(summary?.cash ?? 0)}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-label">Онлайн</div>
          <div className="summary-card-val">
            {formatMoney(summary?.online ?? 0)}
          </div>
          <div className="summary-card-val providers">
            <div>Click: {formatMoney(summary?.by_provider?.click ?? 0)}</div>
            <div>Payme: {formatMoney(summary?.by_provider?.payme ?? 0)}</div>
            <div>Uzum: {formatMoney(summary?.by_provider?.uzum ?? 0)}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-label">RFID</div>
          <div className="summary-card-val">
            {formatMoney(summary?.rfid ?? 0)}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="summary-charts">
        <div className="chart-card">
          <div className="chart-title">По типам оплаты</div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={totalsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {/* <Bar fill="#4CAF50" dataKey="value" /> */}
                <Bar dataKey="Сумма" radius={[6, 6, 0, 0]}>
                  {totalsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#4CAF50", "#2196F3", "#FFC107"][index % 3]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Онлайн (провайдеры)</div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={providersData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Сумма" radius={[6, 6, 0, 0]}>
                  {providersData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#03A9F4", "#E91E63", "#9C27B0"][index % 3]}
                    />
                  ))}
                </Bar>{" "}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryBarchart;
