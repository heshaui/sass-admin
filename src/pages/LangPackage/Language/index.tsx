import React, { useState, useEffect } from "react";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Input, Button, Space, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { languageList } from "@/services/ant-design-pro/langPackage";

// 语言数据
const languageData = [
  {
    key: "02",
    language: "中文简体",
    remark: "简体",
    code: "zh_CN",
    createdAt: "2021-12-12 21:00:00",
  },
  {
    key: "01",
    language: "中文繁体",
    remark: "繁体",
    code: "zh_HK",
    createdAt: "2021-12-12 21:00:00",
  },
  {
    key: "00",
    language: "English",
    remark: "英语",
    code: "en_US",
    createdAt: "2021-12-12 21:00:00",
  },
];

const Language: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取语言列表数据
  const fetchLanguageList = async (pageNo = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await languageList({
        keyword: searchValue,
        pageNo,
        pageSize
      });
      if (response && response.code === '0') {
        setDataSource(response.data || []);
        setPagination({
          current: pageNo,
          pageSize,
          total: response.total || 0
        });
      } else {
        message.error(response?.message || "获取语言列表失败");
      }
    } catch (error) {
      console.error("获取语言列表失败:", error);
      message.error("获取语言列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchLanguageList();
  }, []);

  // 处理查询
  const handleSearch = () => {
    fetchLanguageList(1, pagination.pageSize); // 搜索时重置到第一页
  };

  // 处理分页变化
  const handleTableChange = (page: number, pageSize?: number) => {
    fetchLanguageList(page, pageSize || pagination.pageSize);
  };

  return (
    <PageContainer title="多语言管理">
      {/* 搜索框 */}
      <Space style={{ marginBottom: 16 }}>
        <span>语言：</span>
        <Input
          placeholder="请输入语言"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          查询
        </Button>
      </Space>

      {/* 表格 */}
      <ProTable
        loading={loading}
        columns={[
          {
            title: "序号",
            dataIndex: "id",
            width: 80,
            align: "center",
          },
          {
            title: "语言",
            dataIndex: "lang",
            align: "center",
          },
          {
            title: "备注",
            dataIndex: "remark",
            align: "center",
          },
          {
            title: "语言编码",
            dataIndex: "langEncode",
            align: "center",
          },
          {
            title: "创建时间",
            dataIndex: "createTime",
            align: "center",
            render: (time) => new Date(time).toLocaleString(),
          },
        ]}
        dataSource={dataSource}
        rowKey="id"
        search={false} // 禁用 ProTable 自带的搜索
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handleTableChange,
        }}
        bordered
      />
    </PageContainer>
  );
};

export default Language;