import "./App.css";
import FormularioDenuncia from "./Components/FormDenuncia";
import Header from "./Components/Header";
import { FormProvider } from "./context/DenunciasContext";
import { Toaster } from "sonner";
// interface Step {
// 	id: number;
// 	title: string;
// 	isCompleted: boolean;
// 	isActive: boolean;
// }

function App() {
	return (
		<FormProvider>
			<div className="min-h-screen">
				<Header />
				<FormularioDenuncia />
				<Toaster richColors closeButton />
			</div>
		</FormProvider>
	);
}

export default App;
