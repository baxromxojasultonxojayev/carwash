import React, { useEffect, useState } from "react";
import { Button, message, Modal } from "antd";
import {
  SettingOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import DynamicTable from "../../components/Table";
import DeviceForm from "./components/Form";
import { RootState } from "../../store/configureStore";
import { setLoading } from "../../store/slices/authSlice";
import { LoadDefault } from "../../store/actions/loadDefault";

import "./style.scss";
import { loadData } from "../../utils/api";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import TopUpForm from "./components/TopUpForm";
import { formatMoney } from "../../utils/formatMoney";

const Devices = () => {
  const dispatch = useDispatch();
  const [canUpdate, setCanUpdate] = useState(false);
  const [createDevice, setCreateDevice] = useState(false);
  const [editDevice, setEditDevice] = useState(false);
  const [isTopUp, setIsTopUp] = useState(false);

  const [kioskList, setKioskList] = useState([]);

  const handleOpenModal = () => setCreateDevice(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const deviceColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Баланс (наличные)",
      dataIndex: "cash_balance",
      key: "cash_balance",
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
      title: "Активен",
      dataIndex: "is_active",
      key: "is_active",
      render: (val: boolean) => (
        <span style={{ color: val ? "#52c41a" : "#f5222d" }}>
          {val ? "Да" : "Нет"}
        </span>
      ),
    },
    {
      title: "Дата обслуживания",
      dataIndex: "last_maintenance",
      key: "last_maintenance",
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
              setEditDevice(true), setSelected(record);
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
        url: "/admin/kiosks/",
        cb: {
          success: (response) => {
            setKioskList(response);
            dispatch(setLoading(false));
          },
          error: (error) => {
            console.error("\u274C Xatolik:", error);
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
        url: `/admin/kiosks/${selected?.id}`,
        method: "delete",
      });
      message.success("Клиент успешно удален");
      setCanUpdate((prev) => !prev);
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Ошибка при удалении");
    } finally {
      setIsDeleting(false);
      setConfirmVisible(false);
    }
  };
  const handleDeleteClick = (data: any) => {
    setSelected(data);
    setConfirmVisible(true);
  };

  useEffect(() => {
    getData();
  }, [canUpdate]);

  return (
    <div>
      <ConfirmModal
        visible={confirmVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmVisible(false)}
        confirmLoading={isDeleting}
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
          kioskId={selected?.id}
        />
      </Modal>
      <div className="table-header">
        <h2>УСТРОЙСТВА</h2>
        <Button type="primary" onClick={handleOpenModal} className="add-button">
          + ДОБАВИТЬ УСТРОЙСТВО
        </Button>
        <Modal
          open={createDevice}
          onCancel={() => setCreateDevice(false)}
          footer={null}
          centered
          width={800}
          className="add-device-modal"
        >
          <DeviceForm
            setCanUpdate={setCanUpdate}
            setModalVisible={setCreateDevice}
          />
        </Modal>
        <Modal
          open={editDevice}
          onCancel={() => setEditDevice(false)}
          footer={null}
          centered
          width={800}
          className="add-device-modal"
        >
          <DeviceForm
            isUpdate={true}
            selected={selected}
            setModalVisible={setEditDevice}
            setCanUpdate={setCanUpdate}
          />
        </Modal>
      </div>
      <DynamicTable columns={deviceColumns} data={kioskList} rowKey="id" />
    </div>
  );
};

export default Devices;
