import React, { useState } from "react";
import { Card, Input } from "antd";
import { SearchOutlined, ArrowLeftOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserTable from "../User/UserTable";
import Layout from "../../../components/Layout";

const User = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  return (
    <Layout title="Dashboard : Users">
      <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)]">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
              title="Back to Dashboard"
            >
              <ArrowLeftOutlined />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <UsergroupAddOutlined className="text-emerald-600" />
                Customer & User Directory
              </h1>
              <p className="text-xs text-slate-500">View and manage all registered accounts and credentials</p>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search by name or email..."
              prefix={<SearchOutlined className="text-slate-400 mr-1" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-72 rounded-xl border-slate-200 py-2 shadow-sm text-xs"
              allowClear
            />
          </div>
        </div>

        {/* User Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <UserTable searchText={searchText} />
        </div>
      </div>
    </Layout>
  );
};

export default User;
