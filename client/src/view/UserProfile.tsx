import { useEffect } from "react";
import { Profile } from "../components/profile/index"
import { UserReducer } from "../store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function UserProfile() {
    const isLoggedIn: boolean = useSelector((state: UserReducer) => state.user.isLoggedIn);

    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate('/');
        }
    },[])
    return (
        <>
            <Profile />
        </>
    );
}

export default UserProfile;
