import React from "react";
import { Tabs, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./style.scss";

const { TabPane } = Tabs;
const { Option } = Select;

const Settings: React.FC = () => {
  return (
    <div className="settings-page">
      <h2 className="settings-title">Настройки</h2>

      <div className="settings-container">
        <Tabs defaultActiveKey="1" tabPosition="left" className="settings-tabs">
          <TabPane tab="Общие" key="1">
            <div className="settings-form">
              <label>Название</label>
              <Input placeholder="Введите" />

              <label>Логотип</label>
              <Upload
                listType="picture-card"
                showUploadList={false}
                className="logo-uploader"
              >
                <div className="upload-placeholder">
                  <UploadOutlined style={{ fontSize: 28 }} />
                </div>
              </Upload>

              <label>Язык</label>
              <Select defaultValue="Русский" className="select">
                <Option value="Русский">Русский</Option>
                <Option value="O‘zbekcha">O‘zbekcha</Option>
              </Select>

              <label>Часовой Пояс</label>
              <Select defaultValue="UTC+5" className="select">
                <Option value="UTC+3">UTC+3</Option>
                <Option value="UTC+5">UTC+5</Option>
                <Option value="UTC+7">UTC+7</Option>
              </Select>

              <label>Валюта</label>
              <Select defaultValue="Узбекский Сум" className="select">
                <Option value="Узбекский Сум">Узбекский Сум</Option>
                <Option value="RUB">RUB</Option>
                <Option value="USD">USD</Option>
              </Select>
            </div>
          </TabPane>

          <TabPane tab="Сетевые" key="2" />
          <TabPane tab="Обновление" key="3" />
          <TabPane tab="Безопасность" key="4" />
          <TabPane tab="Резервные Копии" key="5" />
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
