import "./App.css";
import FormularioDenuncia from "./Components/Form/FormDenuncia";
import Header from "./Components/Header";
import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./Components/Layout";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<FormularioDenuncia />}></Route>
					<Route
						path="/tracking-denuncia"
						element={<Header />}
					></Route>
				</Route>
				<Toaster richColors closeButton />
			</Routes>
		</BrowserRouter>
		// <FormProvider>
		// 	<div className="min-h-screen">
		// 		<Header />
		// 		<FormularioDenuncia />
		// 		<Toaster richColors closeButton />
		// 	</div>
		// </FormProvider>
	);
}

export default App;
