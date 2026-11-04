import React from 'react';
import { Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, DownOutlined, SafetyCertificateFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Dashboardnavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleHome = () => {
    navigate('/');
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined className="text-emerald-600" />,
      label: <span className="font-medium text-slate-700">My Profile</span>,
      onClick: () => navigate('/userProfile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-red-500" />,
      label: <span className="font-medium text-red-600">Sign Out</span>,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200/90 shadow-sm sticky top-0 z-20">
      {/* Left indicator */}
      <div className="flex items-center gap-2">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <SafetyCertificateFilled className="text-emerald-500 text-sm" />
          Management Portal
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Single dedicated button to view customer site */}
        <button
          onClick={handleHome}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 shadow-sm transition-all"
          title="Visit Customer Website"
        >
          <HomeOutlined className="text-emerald-600" />
          <span>View Website</span>
        </button>

        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <div className="flex items-center cursor-pointer hover:bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80 transition-all gap-2">
            <div className="relative">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                className="bg-emerald-600 text-white font-semibold flex items-center justify-center"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <span className="text-xs font-bold text-slate-800 hidden sm:inline">Admin</span>
            <DownOutlined className="text-slate-400 text-[10px]" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Dashboardnavbar;
