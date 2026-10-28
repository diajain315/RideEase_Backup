import React from "react";
import { PlusOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CategoryTable from "./CategoryTable";
import Layout from "../../../components/Layout";

const Category = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Dashboard : Vehicle Categories">
      <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <AppstoreOutlined className="text-emerald-600" />
              Fleet Categories
            </h1>
            <p className="text-xs text-slate-500">Organize vehicles into intuitive categories like Scooters, Cruisers, and Sports</p>
          </div>

          <button
            onClick={() => navigate('/admin/category/add')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <PlusOutlined />
            <span>Create Category</span>
          </button>
        </div>

        {/* Category Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <CategoryTable />
        </div>
      </div>
    </Layout>
  );
};

export default Category;
