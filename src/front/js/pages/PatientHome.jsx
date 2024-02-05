import React, { useContext, useEffect } from "react";
import { Link, Route, Routes, Outlet, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { PatientInfo } from "./PatientInfo.jsx";


export const PatientHome = () => {
    const { store, actions } = useContext(Context);

    const navigate = useNavigate();

    useEffect(() => {
        const userLogged = JSON.parse(localStorage.getItem("userLogged"));
        if(userLogged != null){
            if(userLogged.expire < new Date().getTime()){
                actions.logout();
                localStorage.removeItem("userLogged");
                navigate("/login");
            }
        }else{
            navigate("/login");
        }
    }, [navigate])


    const handleLogout = () => {
        actions.logout();

        const userLogged = localStorage.getItem("userLogged");
        if(userLogged != null){
            localStorage.removeItem("userLogged");
            navigate("/login", {replace: true});
        }else{
            navigate("/login");
        }


    }



    return (
        <div>
            <h1>Welcome Patient</h1>

            <button id="logoutBtn" className="btn btn-danger" onClick={handleLogout}>Log out</button>

            <nav>
                <ul>
                    <li>
                        <Link to="info">Patient Info</Link>
                    </li>
                    <li>
                        <Link to="orders">Patient Orders</Link>
                    </li>
                </ul>
            </nav>
            <div className="m-4 p-4 border border-dark rounded-3 ">
                <Outlet />  
            </div>
        </div>
    );

}




// export const PatientHomeTabs = () => {

//     return (

//         <Routes>
//             <Route path="/" element={<PatientHome />} />
//             <Route path="info" element={<PatientInfo />} />
//             <Route path="orders" element={<PatientOrders />} />
//         </Routes>

//     )

// }





