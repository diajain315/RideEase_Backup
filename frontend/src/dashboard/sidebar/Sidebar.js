import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const navLinks = [
    { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard", to: "/admin" },
    { key: "/admin/users", icon: <UserOutlined />, label: "Users", to: "/admin/users" },
    { key: "/admin/category", icon: <AppstoreOutlined />, label: "Category", to: "/admin/category" },
    { key: "/admin/bikes", icon: <CarOutlined />, label: "Bikes Fleet", to: "/admin/bikes" },
    { key: "/admin/orders", icon: <ShoppingCartOutlined />, label: "Bike Orders", to: "/admin/orders" },
    { key: "/admin/messages", icon: <MailOutlined />, label: "Inquiries", to: "/admin/messages" },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      width={240}
      className="h-screen bg-slate-900 border-r border-slate-800 text-slate-200"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "auto",
        zIndex: 1000,
        backgroundColor: "#0F172A",
      }}
    >
      {/* Logo Container */}
      <div
        className="flex items-center justify-center p-3.5 border-b border-slate-800/80 transition-all duration-300"
        style={{
          minHeight: collapsed ? "64px" : "80px",
          backgroundColor: "#0F172A",
        }}
      >
        <Link to="/admin" className="flex items-center justify-center p-1">
          <img
            src="/images/BikeForRentFinalLogo-white.png?v=2"
            alt="RideEase Admin"
            style={{
              height: collapsed ? "28px" : "40px",
              width: "auto",
              objectFit: "contain",
              transition: "all 0.3s ease-in-out",
              cursor: "pointer",
            }}
          />
        </Link>
      </div>

      <div className="py-4">
        {!collapsed && (
          <p className="px-5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Operations
          </p>
        )}

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          className="bg-transparent border-0"
          style={{ backgroundColor: "transparent" }}
        >
          {navLinks.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              className={`my-1 mx-2 rounded-xl text-xs font-semibold transition-all ${
                location.pathname === item.key
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <Link to={item.to} className={location.pathname === item.key ? "text-slate-950 font-bold" : "text-slate-300"}>
                {item.label}
              </Link>
            </Menu.Item>
          ))}

          <div className="my-3 border-t border-slate-800/80"></div>

          {!collapsed && (
            <p className="px-5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              External Tools
            </p>
          )}

          <Menu.Item
            key="/downloadreports"
            icon={<DownloadOutlined className="text-slate-400" />}
            className="my-1 mx-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80"
          >
            <a
              href="https://docs.google.com/spreadsheets/d/1P_US4lNRlt6R1XfVw94XxaxfsMGpf_X1DbRmVtZZ8Kc/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white"
            >
              Download Reports
            </a>
          </Menu.Item>

          <Menu.Item
            key="/gpstracking"
            icon={<EnvironmentOutlined className="text-slate-400" />}
            className="my-1 mx-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80"
          >
            <a
              href="https://mvts11.millitrack.com/modern/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white"
            >
              GPS Fleet Tracker
            </a>
          </Menu.Item>
        </Menu>
      </div>
    </Sider>
  );
}
