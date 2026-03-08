import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Pagination, Tag } from "antd";
import Filter from "./components/Filter";
import DynamicTable from "../../components/Table";
import qs from "qs";
import { setLoading } from "../../store/slices/authSlice";
import { LoadDefault } from "../../store/actions/loadDefault";
import { useLocation, useNavigate } from "react-router-dom";

import "./style.scss";
import SummaryPanel from "./components/SummaryPanel/SummaryPanel";
import { formatMoney } from "../../utils/formatMoney";

interface PaymentRow {
  transactions: any[];
  pagination: {
    total_count: number;
    total_pages: number;
    current_page: number;
  };
}

const columns = [
  {
    title: "ID платежа",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Сумма",
    dataIndex: "amount",
    key: "amount",
    render: (value: number) => `${formatMoney(value)} сум`,
  },
  {
    title: "Описание",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Дата",
    dataIndex: "created_at",
    key: "date",
    render: (value: string, data: any) => (
      <div>
        {value} - {data.Время}
      </div>
    ),
  },
  {
    title: "Тип",
    dataIndex: "type",
    key: "type",
    render: (type: string) => {
      const map: Record<string, string> = {
        card: "gold",
        qr: "purple",
        cash: "green",
      };
      return <Tag color={map[type] || "default"}>{type || "—"}</Tag>;
    },
  },
];

const Statistics = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [dataStats, setDataStats] = useState<PaymentRow>({
    transactions: [],
    pagination: {
      total_count: 0,
      total_pages: 0,
      current_page: 1,
    },
  });

  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  const { start_date, end_date, payment_type, page: queryPage } = query;

  useEffect(() => {
    const currentPage = Number(queryPage || 1);
    setPage(currentPage);
  }, [queryPage]);

  useEffect(() => {
    const updatedQuery = {
      ...query,
      page: 1,
    };
    const queryStr = qs.stringify(updatedQuery);
    navigate(`?${queryStr}`, { replace: true });
  }, [start_date, end_date, payment_type]);

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(
      LoadDefault.request({
        url: "/statistics",
        method: "get",
        params: {
          start_date,
          end_date,
          payment_type,
          skip: (page - 1) * limit,
          limit,
        },
        cb: {
          success: (response) => {
            setDataStats(response);
            setTotal(response.pagination?.total_count || 0);
            dispatch(setLoading(false));

            if (
              query?.page &&
              Number(query.page) !== response.pagination?.current_page
            ) {
              const cleanedQuery = { ...query };
              delete cleanedQuery.page;
              const queryStr = qs.stringify(cleanedQuery);
              navigate(`?${queryStr}`, { replace: true });
              setPage(1);
            }
          },
          error: (err) => {
            console.error("❌ Payment statistics error:", err);
            dispatch(setLoading(false));
          },
        },
      })
    );
  }, [page, start_date, end_date, payment_type]);

  const handlePageChange = (newPage: number) => {
    const updatedQuery = {
      ...query,
      page: newPage,
    };
    const newQueryString = qs.stringify(updatedQuery);
    navigate(`?${newQueryString}`);
  };

  return (
    <div>
      <div className="table-header">
        <h2>СТАТИСТИКА ПЛАТЕЖА</h2>
      </div>

      <div className="statistic-table">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          <div>
            <Filter />
          </div>

          <SummaryPanel />
        </div>
        <DynamicTable
          columns={columns}
          data={dataStats?.transactions || []}
          rowKey="ID"
        />
      </div>

      <Pagination
        current={page}
        pageSize={limit}
        total={total}
        onChange={handlePageChange}
        showSizeChanger={false}
        style={{
          marginTop: 20,
          textAlign: "right",
          padding: "5px 10px",
          borderRadius: "10px",
          background: "#ffcc00",
        }}
      />
    </div>
  );
};

export default Statistics;
