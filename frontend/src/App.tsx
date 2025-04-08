// Styles
import "./App.css";
// Dependencias externas
import { Toaster } from "sonner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
// Contexto
import { AuthProvider } from "./context/AuthenticationContext";
// Componentes
import { Layout } from "./Components/Layout";
import { DenunciasLayout } from "./Components/DenunciasLayout";
import { UsersLayout } from "./Components/UsersLayout";
import FormularioDenuncia from "./Components/Form/FormDenuncia";
import { ProtectedRoute } from "./Components/ProtectedRoute";
// Páginas Admin
import { Login } from "./pages/Admin/Login";
import { Denuncias } from "./pages/Admin/Denuncias/Denuncias";
import { DashboardAdmin } from "./pages/Admin/Dashboard";
import { AdminsHistorial } from "./pages/Admin/AdminsHistorial";
import AdministrarUsuarios from "./pages/Admin/AdministrarUsuarios/AdministrarUsuarios";
import { DenunciasRecibidas } from "./pages/Admin/Denuncias/DenunciasRecibidas";
import { SearchAdmin } from "./pages/Admin/AdministrarUsuarios/SearchAdmin";
import { SearchDenuncia } from "./pages/Admin/Denuncias/SearchDenuncia";
// Páginas Generales
import { TrackingDenuncia } from "./pages/Tracking/TrackingDenuncia";
import { Unauthorized } from "./pages/Unauthorized";
import { NotFound } from "./pages/404";

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
									<UsersLayout />
								</ProtectedRoute>
							}
						>
							<Route index element={<AdministrarUsuarios />} />
							<Route
								path="search"
								element={<SearchAdmin />}
							/>
						</Route>
						<Route
							path="/admin/historial-admins"
							element={
								<ProtectedRoute allowedRoles={["super_admin"]}>
									<AdminsHistorial />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/denuncias"
							element={
								<ProtectedRoute
									allowedRoles={["super_admin", "admin"]}
								>
									<DenunciasLayout />
								</ProtectedRoute>
							}
						>
							<Route index element={<Denuncias />} />
							<Route
								path="recibidos"
								element={<DenunciasRecibidas />}
							/>
							<Route
								path="search"
								element={<SearchDenuncia />}
							/>
						</Route>
						<Route path="*" element={<NotFound />} />
					</Route>
				</Routes>
			</AuthProvider>
			<Toaster richColors closeButton />
		</BrowserRouter>
	);
}

export default App;
