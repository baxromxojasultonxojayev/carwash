import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/slices/authSlice";
import { LoadDefault } from "../../store/actions/loadDefault";
import { loadData } from "../../utils/api";
import { Button, message, Modal } from "antd";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import DynamicTable from "../../components/Table";
import TimeDiscountForm from "./components/Form";
import moment from "moment";

const TimeDiscounts = () => {
  const dispatch = useDispatch();
  const [canUpdate, setCanUpdate] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [discountList, setDiscountList] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const discountColumns = [
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
      title: "Время начала",
      dataIndex: "start_time",
      key: "start_time",
      render: (value: string) =>
        value ? moment(value).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: "Время окончания",
      dataIndex: "end_time",
      key: "end_time",
      render: (value: string) =>
        value ? moment(value).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: "% Скидки",
      dataIndex: "discount_percent",
      key: "discount_percent",
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
        url: "/admin/time-discounts/",
        cb: {
          success: (response) => {
            setDiscountList(response);
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
        url: `/admin/time-discounts/${selected?.id}`,
        method: "delete",
      });
      message.success("Скидка успешно удалена");
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
        <h2>Скидки по времени</h2>
        <Button
          type="primary"
          className="add-button"
          onClick={() => setCreateModalVisible(true)}
        >
          + ДОБАВИТЬ СКИДКУ
        </Button>
      </div>
      <DynamicTable columns={discountColumns} data={discountList} rowKey="id" />

      <Modal
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        centered
        width={700}
      >
        <TimeDiscountForm
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
        <TimeDiscountForm
          isUpdate={true}
          selected={selected}
          setCanUpdate={setCanUpdate}
          setModalVisible={setEditModalVisible}
        />
      </Modal>
    </div>
  );
};

export default TimeDiscounts;
