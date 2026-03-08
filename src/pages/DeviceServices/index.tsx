import React, { useEffect, useState } from "react";
import { Button, message, Pagination } from "antd";
import AddDeviceModal from "../../components/Modals/DeviceModal";
import { SettingOutlined, DeleteOutlined } from "@ant-design/icons";
import qs from "qs";
import { useNavigate, useLocation } from "react-router-dom";
import DynamicTable from "../../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { setLoading } from "../../store/slices/authSlice";
import { LoadDefault } from "../../store/actions/loadDefault";
import "./style.scss";
import UserModal from "../../components/Modals/UserModal";
import DeviceServiceModal from "./components/Form";
import { loadData } from "../../utils/api";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import { formatMoney } from "../../utils/formatMoney";

const DevicesServices = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  const initialPage = Number(query.page || 1);
  const [canUpdate, setCanUpdate] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(5);
  const [deviceServices, setDeviceServices] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenModal = () => setCreateModal(true);

  const handlePageChange = (page: number) => {
    setPage(page);
    const params = qs.stringify({ ...query, page });
    navigate(`?${params}`);
  };
  const deviceColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "RelayBits",
      dataIndex: "relay_bits",
      key: "relay_bits",
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Цена за минуту",
      dataIndex: "price_per_minute",
      key: "price_per_minute",
      render: (val: any) => formatMoney(val),
    },
    {
      title: "Команда",
      dataIndex: "command_str",
      key: "command_str",
    },
    {
      title: "Состояние",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) =>
        active ? (
          <span style={{ color: "green" }}>Вкл</span>
        ) : (
          <span style={{ color: "red" }}>Выкл</span>
        ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="action-buttons">
          <SettingOutlined
            style={{
              marginRight: 12,
              cursor: "pointer",
              color: "var(--text-color)",
            }}
            onClick={() => {
              setEditModal(true), setSelected(record);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer", color: "var(--text-color)" }}
            onClick={() => handleDeleteClick(record)}
          />
        </div>
      ),
    },
  ];

  const handleDeleteClick = (data: any) => {
    setSelected(data);
    setConfirmVisible(true);
  };

  const getData = () => {
    dispatch(setLoading(true));
    dispatch(
      LoadDefault.request({
        url: "/admin/services/",
        params: {
          extra: {
            skip: (page - 1) * limit,
            limit,
            status: "active",
          },
        },
        cb: {
          success: (response) => {
            setDeviceServices(response.items || response || []);
            setTotal(response.total || 0);
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

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await loadData({
        url: `/admin/services/${selected?.id}`,
        method: "delete",
      });
      message.success("Клиент успешно удален");
      setCanUpdate((prev) => !prev);
    } catch (error) {
      message.error("Ошибка при удалении");
    } finally {
      setIsDeleting(false);
      setConfirmVisible(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, canUpdate]);

  return (
    <div>
      <ConfirmModal
        visible={confirmVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmVisible(false)}
        confirmLoading={isDeleting}
      />
      <div className="table-header">
        <h2>Устройства сервиса</h2>
        <Button type="primary" onClick={handleOpenModal} className="add-button">
          + ДОБАВИТЬ СЕРВИС
        </Button>
        <UserModal visible={createModal} onClose={() => setCreateModal(false)}>
          <DeviceServiceModal
            onClose={setCreateModal}
            setCanUpdate={setCanUpdate}
          />
        </UserModal>
        <UserModal visible={editModal} onClose={() => setEditModal(false)}>
          <DeviceServiceModal
            isUpdate={true}
            selected={selected}
            onClose={setEditModal}
            setCanUpdate={setCanUpdate}
          />
        </UserModal>
      </div>
      <DynamicTable
        columns={deviceColumns}
        data={deviceServices}
        rowKey="id"
        // loading={loading}
      />
      <Pagination
        current={page}
        pageSize={limit}
        total={total}
        onChange={handlePageChange}
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

export default DevicesServices;
