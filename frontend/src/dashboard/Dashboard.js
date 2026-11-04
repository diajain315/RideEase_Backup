import React from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Dashboardnavbar from "./navbar/Dashboardnavbar";
import Headerstats from "./components/Headerstats";
import User from "./sidebar/User/User";
import Bike from "./sidebar/Bikes/Bike";
import AddBike from "./sidebar/Bikes/AddBike";
import EditBike from "./sidebar/Bikes/EditBike";
import Ordertable from "./sidebar/Order/Ordertable";
import Category from "./sidebar/Category/Category";
import AddCategory from "./sidebar/Category/AddCategory";
import EditCategory from "./sidebar/Category/EditCategory";
import AdminMessages from "./sidebar/AdminMessages";

const Dashboard = () => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[220px] min-h-screen transition-all duration-300">
        {/* Navbar */}
        <Dashboardnavbar />

        {/* Dynamic Route Content */}
        <div className="flex-1 p-4 md:p-6">
          <Routes>
            <Route path="" element={<Headerstats />} />
            <Route path="/" element={<Headerstats />} />
            <Route path="users" element={<User />} />
            <Route path="bikes" element={<Bike />} />
            <Route path="bikes/add" element={<AddBike />} />
            <Route path="bikes/edit/:id" element={<EditBike />} />
            <Route path="orders" element={<Ordertable />} />
            <Route path="category" element={<Category />} />
            <Route path="category/add" element={<AddCategory />} />
            <Route path="category/edit/:id" element={<EditCategory />} />
            <Route path="messages" element={<AdminMessages />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
