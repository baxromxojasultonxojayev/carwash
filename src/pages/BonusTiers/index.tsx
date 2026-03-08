import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/slices/authSlice";
import { LoadDefault } from "../../store/actions/loadDefault";
import { loadData } from "../../utils/api";
import { Button, message, Modal } from "antd";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import DynamicTable from "../../components/Table";
import BonusForm from "./components/Form";
import { formatMoney } from "../../utils/formatMoney";

const BonusTiers = () => {
  const dispatch = useDispatch();
  const [canUpdate, setCanUpdate] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [bonusList, setBonusList] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const bonusColumns = [
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
      title: "Мин. сумма",
      dataIndex: "min_amount",
      key: "min_amount",
      render: (val: number) => formatMoney(val),
    },
    {
      title: "Макс. сумма",
      dataIndex: "max_amount",
      key: "max_amount",
      render: (val: number) => formatMoney(val),
    },
    {
      title: "Бонус (%)",
      dataIndex: "bonus_percent",
      key: "bonus_percent",
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
      title: "Действия",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="action-buttons">
          <SettingOutlined
            style={{ marginRight: 12, cursor: "pointer" }}
            onClick={() => {
              setEditModalVisible(true);
              setSelected(record);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
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
        url: "/admin/bonus-tiers/",
        cb: {
          success: (response) => {
            setBonusList(response);
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
        url: `/admin/bonus-tiers/${selected?.id}`,
        method: "delete",
      });
      message.success("Бонус успешно удален");
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
      <div className="table-header">
        <h2>Бонусные уровни</h2>
        <Button
          type="primary"
          className="add-button"
          onClick={() => setCreateModalVisible(true)}
        >
          + ДОБАВИТЬ БОНУС
        </Button>
      </div>
      <DynamicTable columns={bonusColumns} data={bonusList} rowKey="id" />

      <Modal
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        centered
        width={700}
      >
        <BonusForm
          setCanUpdate={setCanUpdate}
          setModalVisible={setCreateModalVisible}
        />
      </Modal>

      <Modal
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        centered
        width={700}
      >
        <BonusForm
          isUpdate={true}
          selected={selected}
          setCanUpdate={setCanUpdate}
          setModalVisible={setEditModalVisible}
        />
      </Modal>
    </div>
  );
};

export default BonusTiers;
