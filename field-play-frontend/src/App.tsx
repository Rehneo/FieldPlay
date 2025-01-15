import './App.css'
import {Outlet} from "react-router-dom";
import {AuthProvider} from './context/UserAuth';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {CityProvider} from "./context/CityProvider.tsx";

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <CityProvider>
                        <Outlet/>
                    </CityProvider>
                </AuthProvider>
            </QueryClientProvider>
        </>
    );
}

export default App
