import React, { useEffect, useState } from "react";
import qs from "qs";
import "./style.scss";
import { formatMoney } from "../../../../utils/formatMoney";

export interface SummaryData {
  start_date?: string;
  end_date?: string;
  by_provider: {
    click?: number;
    payme?: number;
    uzum?: number;
  };
  cash?: number;
  card?: number;
  online?: number;
  rfid?: number;
  total?: number;
}

const SummaryPanel: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const query = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }) as any;

  const today = new Date().toISOString().slice(0, 10);
  const start_date = query.start_date || today;

  const end_date = query.end_date || today;

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const url = new URL(
          "https://garage-group.uz/api/v1/statistics/breakdown"
        );

        url.searchParams.append("start_date", start_date);
        url.searchParams.append("end_date", end_date);

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setSummary(data);
      } catch (err) {
        console.error("❌ Summary fetch error:", err);
        setSummary(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [start_date, end_date]);

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="summary-grid">
      <div className="summary-head">
        <div>
          <div className="summary-title">Итоги</div>
          <div className="summary-dates">
            {summary?.start_date || start_date} →{" "}
            {summary?.end_date || end_date}
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
          <div className="summary-card-val">
            <div className="summary-card-label">
              <div>Click: {formatMoney(summary?.by_provider?.click ?? 0)}</div>
              <div>Payme: {formatMoney(summary?.by_provider?.payme ?? 0)}</div>
              <div>Uzum: {formatMoney(summary?.by_provider?.uzum ?? 0)}</div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-label">RFID</div>
          <div className="summary-card-val">
            {formatMoney(summary?.rfid ?? 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
