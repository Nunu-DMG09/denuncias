import "./App.css";
import FormularioDenuncia from "./Components/Form/FormDenuncia";
import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./Components/Layout";
import { TrackingDenuncia } from "./pages/Tracking/TrackingDenuncia";
import { Login } from "./pages/Admin/Login";
import { DashboardAdmin } from "./pages/Admin/Dashboard";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<FormularioDenuncia />} />
					<Route
						path="/tracking-denuncia"
						element={<TrackingDenuncia />}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/admin-dashboard" element={<DashboardAdmin/>} />
				</Route>
			</Routes>
			<Toaster richColors closeButton />
		</BrowserRouter>
	);
}

export default App;
