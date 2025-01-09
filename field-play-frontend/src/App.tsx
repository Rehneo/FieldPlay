import './App.css'
import {Outlet} from "react-router-dom";
import {AuthProvider} from './context/UserAuth';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createTheme, ThemeProvider} from "@mui/material";

const queryClient = new QueryClient();

const theme = createTheme(
    {
        palette: {
            primary: {
                main: '#008000',
            },
            secondary: {
                main: '#008000',
            },
        },
    }
)


function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <ThemeProvider theme={theme}>
                        <Outlet/>
                    </ThemeProvider>
                </AuthProvider>
            </QueryClientProvider>
        </>
    );
}

export default App
