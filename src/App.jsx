import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import GlobalStyles from "./styles/GlobalStyles";
import Dashboard from "./pages/Dashboard";

import Cocktails from "./pages/Cocktails";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./ui/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import Orders from "./pages/Orders";
import Order from "./pages/Order";
import CheckPaid from "./pages/CheckPaid";
import Inventory from "./pages/Inventory";
import Clients from "./pages/Clients";
import ProtectedRoute from "./ui/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";
import CocktailDetail from "./features/cocktails/CocktailDetail";
import RoleGuard from "./components/RoleGuard";

const queryClient = new QueryClient({
  defaultOptions: {
    staleTime: 0,
  },
});
function App() {
  return (
    <>
      <DarkModeProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <GlobalStyles />
          <BrowserRouter>
            <Routes>
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="dashboard" />} />
                <Route
                  path="dashboard"
                  element={
                    <RoleGuard allowedRoles={["admin", "staff"]}>
                      <Dashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <RoleGuard allowedRoles={["admin", "staff"]}>
                      <Orders />
                    </RoleGuard>
                  }
                />
                <Route
                  path="orders/:orderId"
                  element={
                    <RoleGuard allowedRoles={["admin", "staff"]}>
                      <Order />
                    </RoleGuard>
                  }
                />
                <Route
                  path="checkPaid/:orderId"
                  element={
                    <RoleGuard allowedRoles={["admin", "staff"]}>
                      <CheckPaid />
                    </RoleGuard>
                  }
                />
                <Route
                  path="cocktails"
                  element={
                    <RoleGuard allowedRoles={["admin", "staff"]}>
                      <Cocktails />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/cocktails/:cocktailId"
                  element={
                    <RoleGuard allowedRoles={["admin", "staff"]}>
                      <CocktailDetail />
                    </RoleGuard>
                  }
                />
                <Route
                  path="inventory"
                  element={
                    <RoleGuard allowedRoles={["admin", "staff"]}>
                      <Inventory />
                    </RoleGuard>
                  }
                />
                <Route
                  path="clients"
                  element={
                    <RoleGuard allowedRoles={["admin", "staff"]}>
                      <Clients />
                    </RoleGuard>
                  }
                />
                <Route
                  path="users"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <Users />
                    </RoleGuard>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <RoleGuard allowedRoles={["admin"]}>
                      <Settings />
                    </RoleGuard>
                  }
                />
                <Route path="account" element={<Account />} />
              </Route>
              <Route path="login" element={<Login />}></Route>
              <Route path="*" element={<PageNotFound />}></Route>
            </Routes>
          </BrowserRouter>

          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "var(--color-grey-0)",
                color: "var(--color-grey-700)",
              },
            }}
          />
        </QueryClientProvider>
      </DarkModeProvider>
    </>
  );
}

export default App;
