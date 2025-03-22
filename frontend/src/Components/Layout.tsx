import { Outlet } from "react-router";
import Header from "./Header";
import { FormProvider } from "../context/DenunciasContext";

export const Layout = () => {
    return (
        <FormProvider>
            <div className="min-h-screen">
                <Header />
                <Outlet />
            </div>
        </FormProvider>
    )
}