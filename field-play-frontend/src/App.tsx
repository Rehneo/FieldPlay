import './App.css'
import {Outlet} from "react-router-dom";
import { AuthProvider } from './context/UserAuth';

function App() {
    return (
        <>
            <AuthProvider>
                <Outlet/>
            </AuthProvider>
        </>
    );
}

export default App
