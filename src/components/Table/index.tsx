import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./style.scss";

interface DynamicTableProps<T> {
  columns: ColumnsType<T>;
  data: T[];
  rowKey: string;
  title?: string;
}

function DynamicTable<T extends object>({
  columns,
  data,
  rowKey,
  title,
}: DynamicTableProps<T>) {
  return (
    <div className="dynamic-table-wrapper">
      {title && <h2 className="table-title">{title}</h2>}
      <Table
        columns={columns}
        dataSource={data}
        rowKey={rowKey}
        pagination={false}
        className="dynamic-table"
      />
    </div>
  );
}

export default DynamicTable;

// import React from "react";
// import { Table, Button } from "antd";
// import { SettingOutlined, DeleteOutlined } from "@ant-design/icons";
// import { ColumnsType } from "antd/es/table";

// import "./style.scss";

// interface DynamicTableProps<T> {
//   columns: ColumnsType<T>;
//   data: T[];
//   rowKey: string;
//   title?: string;
// }

// const DevicesTable: React.FC<DevicesTableProps> = ({
//   devices,
//   onEdit,
//   onDelete,
// }) => {
//   const columns = [
//     {
//       title: "Статус",
//       dataIndex: "status",
//       key: "status",
//       render: (status: string) => {
//         let color = "";
//         switch (status) {
//           case "Online":
//             color = "#00FF00";
//             break;
//           case "Offline":
//             color = "#FF0000";
//             break;
//           case "Service":
//             color = "#FFD700";
//             break;
//           default:
//             color = "#FFFFFF";
//         }
//         return (
//           <div className="status-cell">
//             <span className="status-dot" style={{ backgroundColor: color }} />
//             {status}
//           </div>
//         );
//       },
//     },
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "Сила",
//       dataIndex: "power",
//       key: "power",
//       render: (power: number) => (
//         <div className="power-bar">
//           <div className="power-bar-fill" style={{ width: `${power}%` }}></div>
//         </div>
//       ),
//     },
//     {
//       title: "Доход",
//       dataIndex: "revenue",
//       key: "revenue",
//     },
//     {
//       title: "Вода(Л)",
//       dataIndex: "water",
//       key: "water",
//     },
//     {
//       title: "Пена(Л)",
//       dataIndex: "foam",
//       key: "foam",
//     },
//     {
//       title: "Воск(Л)",
//       dataIndex: "wax",
//       key: "wax",
//     },
//     {
//       title: "Действия",
//       key: "actions",
//       render: (_: any, record: Device) => (
//         <div className="action-buttons">
//           <SettingOutlined
//             style={{
//               marginRight: 12,
//               cursor: "pointer",
//               color: "var(--text-color)",
//             }}
//             onClick={() => onEdit && onEdit(record.id)}
//           />
//           <DeleteOutlined
//             style={{ cursor: "pointer", color: "var(--text-color)" }}
//             onClick={() => onDelete && onDelete(record.id)}
//           />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="devices-table-wrapper">
//       <Table
//         columns={columns}
//         dataSource={devices}
//         pagination={false}
//         rowKey="id"
//         className="devices-table"
//       />
//     </div>
//   );
// };

// export default DevicesTable;
