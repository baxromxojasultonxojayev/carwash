import React, { useMemo, useEffect } from "react";
import { DatePicker, Select, ConfigProvider } from "antd";
import ruRU from "antd/es/locale/ru_RU";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ru";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "qs";

import "./style.scss";

dayjs.extend(customParseFormat);

const { Option } = Select;
const DATE_FMT = "YYYY-MM-DD";

const Filter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }) as any,
    [location.search]
  );

  const stringifyPush = (obj: Record<string, any>) => {
    const cleaned = { ...obj };
    Object.keys(cleaned).forEach((k) => {
      const v = cleaned[k];
      if (v === undefined || v === null || v === "") delete cleaned[k];
    });
    navigate(`${location.pathname}?${qs.stringify(cleaned)}`);
  };

  const parseD = (v?: string): Dayjs | null => {
    if (!v || typeof v !== "string") return null;
    const d = dayjs(v, DATE_FMT, true); // strict
    return d.isValid() ? d : null;
  };

  const start = parseD(query.start_date);
  const end = parseD(query.end_date);

  useEffect(() => {
    if (start && end && start.isAfter(end, "day")) {
      stringifyPush({ ...query, end_date: start.format(DATE_FMT) });
    }
  }, [location.search]);

  const disabledStart = (current: Dayjs) => {
    if (!end) return false;
    return current.isAfter(end, "day");
  };

  const disabledEnd = (current: Dayjs) => {
    if (!start) return false;
    return current.isBefore(start, "day");
  };

  const handleDateChange = (
    d: Dayjs | null,
    type: "start_date" | "end_date"
  ) => {
    const val = d ? d.format(DATE_FMT) : undefined;

    if (type === "start_date") {
      if (d && end && d.isAfter(end, "day")) {
        stringifyPush({ ...query, start_date: val, end_date: val, page: 1 });
      } else {
        stringifyPush({ ...query, start_date: val, page: 1 });
      }
      return;
    }

    if (d && start && d.isBefore(start, "day")) {
      stringifyPush({ ...query, start_date: val, end_date: val, page: 1 });
    } else {
      stringifyPush({ ...query, end_date: val, page: 1 });
    }
  };

  return (
    <ConfigProvider locale={ruRU}>
      <div className="filter-group">
        <div className="filter-item">
          <label>Дата Начала</label>
          <DatePicker
            format={DATE_FMT}
            value={start}
            onChange={(d) => handleDateChange(d, "start_date")}
            disabledDate={disabledStart}
            allowClear
            placeholder="Выберите дату"
          />
        </div>

        <div className="filter-item">
          <label>Дата Конец</label>
          <DatePicker
            format={DATE_FMT}
            value={end}
            onChange={(d) => handleDateChange(d, "end_date")}
            disabledDate={disabledEnd}
            allowClear
            placeholder="Выберите дату"
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Filter;
