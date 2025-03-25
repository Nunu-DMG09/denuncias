import "./App.css";
import FormularioDenuncia from "./Components/Form/FormDenuncia";
import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./Components/Layout";
import { TrackingDenuncia } from "./pages/Tracking/TrackingDenuncia";
import { Login } from "./pages/Admin/Login";
import { DashboardAdmin } from "./pages/Admin/Dashboard";
import { AuthProvider } from "./context/AuthenticationContext";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { Unauthorized } from "./pages/Unauthorized";
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
					</Route>
					<Route path="/login" element={<Login />} />
					<Route path="/unauthorized" element={<Unauthorized />} />
					<Route
						path="/admin-dashboard"
						element={
							<ProtectedRoute>
								<DashboardAdmin />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</AuthProvider>
			<Toaster richColors closeButton />
		</BrowserRouter>
	);
}

export default App;
