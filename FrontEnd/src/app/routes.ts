import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Trading } from "./pages/Trading";
import { History } from "./pages/History";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "trading", Component: Trading },
      { path: "history", Component: History },
    ],
  },
]);
