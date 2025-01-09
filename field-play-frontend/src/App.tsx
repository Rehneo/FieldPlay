import './App.css'
import {Outlet} from "react-router-dom";
import {AuthProvider} from './context/UserAuth';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Outlet/>
                </AuthProvider>
            </QueryClientProvider>
        </>
    );
}

export default App
