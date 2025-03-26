import "./App.css";
import FormularioDenuncia from "./Components/Form/FormDenuncia";
import { Toaster } from "sonner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Layout } from "./Components/Layout";
import { TrackingDenuncia } from "./pages/Tracking/TrackingDenuncia";
import { Login } from "./pages/Admin/Login";
import { DashboardAdmin } from "./pages/Admin/Dashboard";
import { AuthProvider } from "./context/AuthenticationContext";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { Unauthorized } from "./pages/Unauthorized";
import { NotFound } from "./pages/404";
import { Denuncias } from "./pages/Admin/Denuncias";
import { UsersManagement } from "./pages/Admin/UsersManagement";
function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<FormularioDenuncia />} />
						<Route
							path="/tracking-denuncia"
							element={<TrackingDenuncia />}
						/>
						<Route path="/admin/login" element={<Login />} />
						<Route
							path="/unauthorized"
							element={<Unauthorized />}
						/>
						<Route
							path="/admin"
							element={
								<ProtectedRoute
									allowedRoles={["super_admin", "admin"]}
								>
									<Navigate to="/admin/dashboard" replace />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/dashboard"
							element={
								<ProtectedRoute
									allowedRoles={["super_admin", "admin"]}
								>
									<DashboardAdmin />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/users"
							element={
								<ProtectedRoute allowedRoles={["super_admin"]}>
									<UsersManagement />
								</ProtectedRoute>
							}
						/>
						<Route 
							path="/admin/denuncias"
							element={
								<ProtectedRoute allowedRoles={["super_admin", "admin"]}>
									<Denuncias />
								</ProtectedRoute>
							}
						/>
						<Route path="*" element={<NotFound />} />
					</Route>
				</Routes>
			</AuthProvider>
			<Toaster richColors closeButton />
		</BrowserRouter>
	);
}

export default App;
