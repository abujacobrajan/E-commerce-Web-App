import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import RootLayout from '../layout/RootLayout.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import ProfilePage from '../pages/user/ProfilePage.jsx';
import CartPage from '../pages/user/CartPage.jsx';
import ProductDetails from '../pages/ProductDetails.jsx';
import UserLayout from '../layout/UserLayout.jsx';
import WishListPage from '../pages/WishListPage.jsx';
import AuthUser from './protectedRoutes/AuthUser.jsx';
import SellerSignup from '../pages/seller/SellerSignupPage.jsx';
import SellerLogin from '../pages/seller/SellerLoginPage.jsx';
import SellerLayout from '../layout/SellerLayout.jsx';
import SellerProfilePage from '../pages/seller/SellerProfilePage.jsx';
import AuthSeller from './protectedRoutes/AuthSeller.jsx';
import ErrorPage from '../pages/ErrorPage.jsx';
import CreateProduct from '../pages/seller/CreateProduct.jsx';
import SellerProducts from '../pages/seller/SellerProducts.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminLayout from '../layout/AdminLayout.jsx';
import AuthAdmin from './protectedRoutes/AuthAdmin.jsx';
import ManageUsers from '../pages/admin/ManageUsers.jsx';
import ManageSellers from '../pages/admin/ManageSellers.jsx';
import ManageProducts from '../pages/admin/ManageProducts.jsx';
import SuccessPage from '../pages/user/SuccessPage.jsx';
import CancelPage from '../pages/user/CancelPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '', element: <Home /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'products/:productId', element: <ProductDetails /> },
    ],
  },
  {
    path: 'user',
    element: (
      <AuthUser>
        <UserLayout />
      </AuthUser>
    ),
    children: [
      { path: 'profile', element: <ProfilePage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'wishlist', element: <WishListPage /> },
      { path: '', element: <Home /> },
      { path: 'products/:productId', element: <ProductDetails /> },
      // { path: 'payment/success', element: <h2>Payment Success</h2> },
      // { path: 'payment/cancell', element: <h2>Payment Cancelled</h2> },
      { path: 'payment/success', element: <SuccessPage /> },
      { path: 'payment/cancell', element: <CancelPage /> },
    ],
  },
  {
    path: 'seller-signup',
    element: <SellerSignup />,
  },
  {
    path: 'seller-login',
    element: <SellerLogin />,
  },
  {
    path: 'seller',
    element: (
      <AuthSeller>
        <SellerLayout />
      </AuthSeller>
    ),
    children: [
      { path: 'profile', element: <SellerProfilePage /> },
      { path: '', element: <Home /> },
      { path: 'products/:productId', element: <ProductDetails /> },
      { path: 'create-product', element: <CreateProduct /> },
      { path: 'seller-products', element: <SellerProducts /> },
    ],
  },
  {
    path: 'admin',
    element: (
      <AuthAdmin>
        <AdminLayout />
      </AuthAdmin>
    ),
    children: [
      { path: '', element: <AdminDashboard /> },
      { path: 'manage-users', element: <ManageUsers /> },
      { path: 'manage-sellers', element: <ManageSellers /> },
      { path: 'manage-products', element: <ManageProducts /> },
    ],
  },
]);
