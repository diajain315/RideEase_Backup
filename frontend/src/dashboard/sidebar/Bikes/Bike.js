import React from "react";
import { PlusOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BikeTable from "./BikeTable";
import Layout from "../../../components/Layout";

const Bike = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Dashboard : Fleet Management">
      <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ThunderboltOutlined className="text-emerald-600" />
              Bike Fleet Catalog
            </h1>
            <p className="text-xs text-slate-500">Manage all two-wheelers, pricing tariffs, and specifications</p>
          </div>

          <button
            onClick={() => navigate('/admin/bikes/add')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all"
          >
            <PlusOutlined />
            <span>Add New Vehicle</span>
          </button>
        </div>

        {/* Bike Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <BikeTable />
        </div>
      </div>
    </Layout>
  );
};

export default Bike;
