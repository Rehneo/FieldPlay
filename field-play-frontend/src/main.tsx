import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {router} from "./routes/Routes.tsx";
import {RouterProvider} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";

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


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}/>
        </ThemeProvider>
    </StrictMode>,
)
