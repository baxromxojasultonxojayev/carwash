import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/slices/authSlice";
import { LoadDefault } from "../../store/actions/loadDefault";
import { loadData } from "../../utils/api";
import { Button, message, Modal } from "antd";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import DynamicTable from "../../components/Table";
import ControllerForm from "./components/Form"; // Create this form similar to BonusForm
import moment from "moment";

const Controllers = () => {
  const dispatch = useDispatch();
  const [canUpdate, setCanUpdate] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [controllerList, setControllerList] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const controllerColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Controller ID",
      dataIndex: "controller_id",
      key: "controller_id",
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "IP адрес",
      dataIndex: "ip_address",
      key: "ip_address",
    },
    {
      title: "Порт",
      dataIndex: "port",
      key: "port",
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
      title: "Последний пинг",
      dataIndex: "last_ping",
      key: "last_ping",
      render: (value: string) =>
        value ? moment(value).format("YYYY-MM-DD HH:mm") : "-",
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
        url: "/admin/controllers/",
        cb: {
          success: (response) => {
            setControllerList(response);
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
        url: `/admin/controllers/${selected?.controller_id}`,
        method: "delete",
      });
      message.success("Контроллер успешно удален");
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
        <h2>Список контроллеров</h2>
        <Button
          type="primary"
          className="add-button"
          onClick={() => setCreateModalVisible(true)}
        >
          + ДОБАВИТЬ КОНТРОЛЛЕР
        </Button>
      </div>

      <DynamicTable
        columns={controllerColumns}
        data={controllerList}
        rowKey="id"
      />

      <Modal
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        centered
        width={700}
      >
        <ControllerForm
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
        <ControllerForm
          isUpdate={true}
          selected={selected}
          setCanUpdate={setCanUpdate}
          setModalVisible={setEditModalVisible}
        />
      </Modal>
    </div>
  );
};

export default Controllers;
