import React, { useState, useEffect, lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Loading from "./Loading";
import Dashboard from "../dashboard/Dashboard";
import User from "../dashboard/sidebar/User/User";
import Category from "../dashboard/sidebar/Category/Category";
import AddCategory from "../dashboard/sidebar/Category/AddCategory";
import EditCategory from "../dashboard/sidebar/Category/EditCategory";
import Bike from "../dashboard/sidebar/Bikes/Bike";
import AddBike from "../dashboard/sidebar/Bikes/AddBike";
import EditBike from "../dashboard/sidebar/Bikes/EditBike";
import AdminMessages from "../dashboard/sidebar/AdminMessages";
import Ordertable from "../dashboard/sidebar/Order/Ordertable";
import Attractions from "./attractions";
import PaymentSuccess from "./paymentSuccess";
import TermsCond from "./TermsCond";
import UserProfile from "./UserProfile";
import { useSelector } from "react-redux";
import Private from "../Helper/Private";

// Lazy Load Components
const Navbar = lazy(() => import("./Navbar"));
const Footer = lazy(() => import("./Footer"));
const Home = lazy(() => import("./Home"));
const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./Signup"));
const ForgotPassword = lazy(() => import("./ForgotPassword"));
const Cart = lazy(() => import("./Cart"));
const Order = lazy(() => import("./Order"));
const Categories = lazy(() => import("./Categories"));
const Contact = lazy(() => import("./Contact"));
const OrderDropdown = lazy(() => import("./OrderDropdown"));
const BikeRentSection = lazy(() => import("./BikeRentSection"));
const Testimonial = lazy(() => import("./Testimonial"));
const SendOtp = lazy(() => import("./SendOtp"));
// Static Pages
const AboutUs = lazy(() => import("./AboutUs"));
const Faqs = lazy(() => import("./FAQs"));
const Terms = lazy(() => import("./Terms"));
const Payment = lazy(() => import("./Payment"));

// Error Handling
const Unauthorized = lazy(() => import("../Helper/Unauthorized"));

const App1 = () => {
  const [scrolled, setScrolled] = useState(false);
  const { userInfo } = useSelector((state) => state.auth); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Navbar scrolled={scrolled} />

        <div className="mt-16 sm:mt-18 bg-slate-50 min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/bikecategory" element={<Categories />} />
            <Route path="/bikerentsection" element={<BikeRentSection />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orderdropdown" element={<OrderDropdown />} />
            <Route path="/reviews" element={<Testimonial />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/order/:slug" element={<Order />} />
            <Route path="/sendOtp" element={<SendOtp />} />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            {/* Admin Redirections to Unified Admin Dashboard */}
            <Route path='/admin' element={<Navigate to="/admin" replace />} />
            <Route path='/users' element={<Navigate to="/admin/users" replace />} />
            <Route path='/category' element={<Navigate to="/admin/category" replace />} />
            <Route path='/category/add' element={<Navigate to="/admin/category/add" replace />} />
            <Route path='/category/edit/:id' element={<Navigate to="/admin/category" replace />} />
            <Route path='/bikes' element={<Navigate to="/admin/bikes" replace />} />
            <Route path='/bikes/add' element={<Navigate to="/admin/bikes/add" replace />} />
            <Route path='/bikes/edit/:id' element={<Navigate to="/admin/bikes" replace />} />
            <Route path='/userorders' element={<Navigate to="/admin/orders" replace />} />
            <Route path="/AdminMessages" element={<Navigate to="/admin/messages" replace />} />

            {/* New pages */}
            <Route path="/attractions" element={<Attractions />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/Terms" element={<Terms />} />

            {/* Static Pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/termsc" element={<TermsCond />} />
            <Route path="/payment" element={<Payment />} />

            {/* Catch-All Route */}
            <Route path="*" element={<Unauthorized />} />
          </Routes>
        </div>
        <Footer />
      </Suspense>
    </>
  );
};

export default App1;
