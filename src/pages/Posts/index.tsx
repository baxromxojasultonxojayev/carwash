import React, { useEffect, useState } from "react";
import { Button, message, Modal } from "antd";
import { SettingOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import DynamicTable from "../../components/Table";
import PostForm from "./components/Form";
import { setLoading } from "../../store/slices/authSlice";
import { LoadDefault } from "../../store/actions/loadDefault";

import "./style.scss";
import { loadData } from "../../utils/api";
import ConfirmModal from "../../components/Modals/ConfirmModal";

const Posts = () => {
  const dispatch = useDispatch();
  const [canUpdate, setCanUpdate] = useState(false);
  const [createPost, setCreatePost] = useState(false);
  const [editPost, setEditPost] = useState(false);
  const [postsList, setPostsList] = useState([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const columns = [
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
      title: "Контроллер",
      dataIndex: "controller",
      key: "controller_id",
      render: (value: any) => value?.name,
    },
    {
      title: "Сервисы",
      dataIndex: "available_services",
      key: "available_services",
      render: (services: any[]) =>
        Array.isArray(services) && services.length > 0
          ? services.map((s) => s.name).join(", ")
          : "-",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "#777";
        if (status === "free") color = "#52c41a";
        else if (status === "busy") color = "#faad14";
        else if (status === "error") color = "#ff4d4f";

        return (
          <span style={{ color, fontWeight: 500, textTransform: "capitalize" }}>
            {status}
          </span>
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
              setEditPost(true), setSelected(record);
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

  const fetchPosts = () => {
    dispatch(setLoading(true));
    dispatch(
      LoadDefault.request({
        url: "/admin/posts/",
        cb: {
          success: (res) => {
            setPostsList(res);
            dispatch(setLoading(false));
          },
          error: (err) => {
            console.error("❌ Xatolik:", err);
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
        url: `/admin/posts/${selected?.id}`,
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
    fetchPosts();
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
        <h2>Посты</h2>
        <Button
          type="primary"
          className="add-button"
          onClick={() => setCreatePost(true)}
        >
          + ДОБАВИТЬ ПОСТ
        </Button>
      </div>

      <DynamicTable columns={columns} data={postsList} rowKey="id" />

      <Modal
        open={createPost}
        onCancel={() => setCreatePost(false)}
        footer={null}
        centered
        width={700}
        className="add-post-modal"
      >
        <PostForm setModalVisible={setCreatePost} setCanUpdate={setCanUpdate} />
      </Modal>
      <Modal
        open={editPost}
        onCancel={() => (setEditPost(false), setSelected(null))}
        footer={null}
        centered
        width={700}
        className="add-post-modal"
      >
        <PostForm
          isUpdate={true}
          selected={selected}
          setModalVisible={setEditPost}
          setCanUpdate={setCanUpdate}
        />
      </Modal>
    </div>
  );
};

export default Posts;
