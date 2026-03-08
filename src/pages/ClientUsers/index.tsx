import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDebounce } from "use-debounce";
import qs from "qs";
import { useNavigate, useLocation } from "react-router-dom";
import DynamicTable from "../../components/Table";
import DashboardCard from "../../components/Cards/DashboardCard";
import { Button, Col, message, Modal, Pagination, Row } from "antd";
import CustomInput from "../../components/FormElements/CustomInput";
import UserModal from "../../components/Modals/UserModal";
import UserClientForm from "./components/Form";
import { useDispatch } from "react-redux";
import { LoadDefault } from "../../store/actions/loadDefault";
import { setLoading } from "../../store/slices/authSlice";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import { loadData } from "../../utils/api";
import "./style.scss";
import Filter from "./components/Filter";
import TopUpForm from "./components/TopUpForm";
import { formatMoney } from "../../utils/formatMoney";

const ClientUser = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  const initialSearch = query.search || "";
  const initialPage = Number(query.page || 1);

  const [debouncedSearch] = useDebounce(initialSearch, 500);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isTopUp, setIsTopUp] = useState(false);

  const [data, setData] = useState([]);
  const [canUpdate, setCanUpdate] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const handleDeleteClick = (data: any) => {
    setSelected(data);
    setConfirmVisible(true);
  };

  const columns = [
    {
      title: "Ф.И.О",
      dataIndex: "holder_name",
      key: "holder_name",
    },
    {
      title: "Номер",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "ID Карты",
      dataIndex: "uid",
      key: "uid",
    },
    {
      title: "Баланс",
      dataIndex: "balance",
      key: "balance",
      render: (val: number, record: any) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>{formatMoney(val)}</span>
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelected(record);
                setIsTopUp(true);
              }}
            />
          </div>
        );
      },
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="action-buttons">
          <EditOutlined
            style={{
              marginRight: 10,
              cursor: "pointer",
              color: "var(--text-color)",
            }}
            onClick={() => {
              setEditModal(true);
              setSelected(record);
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

  const getData = () => {
    dispatch(setLoading(true));
    dispatch(
      LoadDefault.request({
        url: "/admin/rfid-cards/",
        params: {
          search: debouncedSearch,
          skip: (page - 1) * limit,
          limit,
          extra: { status: "active" },
        },
        cb: {
          success: (response) => {
            const mappedData = response?.map((item: any) => ({
              id: item.id,
              holder_name: item.holder_name,
              phone_number: item.phone_number || "—",
              uid: item.uid,
              balance: item.balance,
            }));
            setData(mappedData || []);
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
    try {
      await loadData({
        url: `/admin/rfid-cards/${selected?.uid}`,
        method: "delete",
      });
      message.success("Клиент успешно удален");
      setCanUpdate((prev) => !prev);
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Ошибка при удалении");
    } finally {
      setConfirmVisible(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, debouncedSearch, canUpdate]);

  return (
    <div>
      <ConfirmModal
        visible={confirmVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmVisible(false)}
      />
      <Modal
        open={isTopUp}
        onCancel={() => setIsTopUp(false)}
        footer={null}
        centered
        width={800}
        className="add-device-modal"
      >
        <TopUpForm
          setCanUpdate={setCanUpdate}
          setIsTopUp={setIsTopUp}
          selected={selected}
        />
      </Modal>
      <div className="table-header">
        <h2>Клиенты</h2>
        <div className="add-client">
          <Button
            type="primary"
            onClick={handleOpenModal}
            className="add-button"
          >
            +СОЗДАТЬ КАРТУ
          </Button>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <UserModal visible={modalVisible} onClose={handleCloseModal}>
          <UserClientForm
            setModalVisible={setModalVisible}
            setCanUpdate={setCanUpdate}
          />
        </UserModal>
        <UserModal visible={editModal} onClose={() => setEditModal(false)}>
          <UserClientForm
            setModalVisible={setEditModal}
            setCanUpdate={setCanUpdate}
            selected={selected}
            isUpdate={true}
          />
        </UserModal>
        <DynamicTable columns={columns} data={data} rowKey="id" />
      </div>
      <Pagination
        current={page}
        pageSize={limit}
        total={total}
        onChange={(page) => setPage(page)}
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

export default ClientUser;
