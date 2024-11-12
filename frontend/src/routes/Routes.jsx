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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'products/:id',
        element: <ProductDetails />,
      },
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
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'wishlist',
        element: <WishListPage />,
      },
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'products/:id',
        element: <ProductDetails />,
      },
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
      {
        path: 'profile',
        element: <SellerProfilePage />,
      },
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'products/:id',
        element: <ProductDetails />,
      },
      {
        path: 'create-product',
        element: <CreateProduct />,
      },
      {
        path: 'products',
        element: <SellerProducts />,
      },
    ],
  },
]);
