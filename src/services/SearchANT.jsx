import React, { useRef } from "react";
import { Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const getSearchColumn = (dataIndex, title) => {
  return {
    title: title,
    dataIndex: dataIndex,
    key: dataIndex,
    filterDropdown: (props) => (
      <SearchDropdown {...props} title={title} dataIndex={dataIndex} />
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  };
};

const SearchDropdown = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  title,
  dataIndex,
}) => {
  const searchInput = useRef(null);

  const handleSearch = () => {
    confirm();
    setSelectedKeys(selectedKeys[0] || "");
  };

  const handleReset = () => {
    clearFilters?.();
    setSelectedKeys([]);
  };

  return (
    <div
      style={{
        padding: 8,
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Input
        ref={searchInput}
        placeholder={`חיפוש ${title}`}
        value={selectedKeys[0] || ""}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={handleSearch}
        style={{
          marginBottom: 8,
          display: "block",
        }}
      />
      <Space>
        <Button
          type="primary"
          onClick={handleSearch}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          חפש
        </Button>
        <Button
          onClick={handleReset}
          size="small"
          style={{
            width: 90,
          }}
        >
          אפס
        </Button>
      </Space>
    </div>
  );
};

const searchProps = (dataIndex, title) => getSearchColumn(dataIndex, title);

export default searchProps;
