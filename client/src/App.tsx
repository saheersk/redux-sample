import { Route, Routes } from "react-router-dom";
import Home from "./view/Home";
import SignUp from "./view/SignUp";
import Login from "./view/Login";
import UserProfile from "./view/UserProfile";
import Admin from "./view/Admin";
import { UserEditInput, UserInput } from "./components/admin";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/add" element={<UserInput />} />
                <Route path="/admin/edit/:id" element={<UserEditInput />} />
            </Routes>
        </>
    );
}

export default App;
