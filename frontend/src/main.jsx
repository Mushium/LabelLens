import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useNavigate,
} from "react-router-dom";

import Home from "./Pages/home.jsx";
import Dashboard from "./Pages/dashboard.jsx";
import Model from "./Pages/model.jsx";
import Settings from "./Pages/settings.jsx";
import Account from "./Pages/account.jsx";

// CSS
import "primereact/resources/themes/md-dark-indigo/theme.css"; // theme
import "primereact/resources/primereact.min.css"; // core styles
import "primeicons/primeicons.css"; // icons
import "primeflex/primeflex.css"; // utility flex/grid classes
import "./index.css";
const router = createBrowserRouter([
  { path: "/", element: <Home></Home> },
  { path: "/dashboard", element: <Dashboard></Dashboard> },
  { path: "/settings", element: <Settings></Settings> },
  { path: "/model", element: <Model></Model> },
  { path: "/account", element: <Account></Account> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
