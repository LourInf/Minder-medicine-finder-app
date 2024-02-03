import React, { useEffect } from "react";
import { Link, Route, Routes, Outlet, useNavigate } from "react-router-dom";
import { PatientInfo } from "./PatientInfo.jsx";


export const PatientHome = () => {

    const navigate = useNavigate();

    // useEffect(() => {
    //     const userLogged = JSON.parse(localStorage.getItem("userLogged"));
    //     if(userLogged){
    //         if(userLogged.expire < new Date().getTime()){
    //             localStorage.removeItem("userLogged");
    //             navigate("/login");
    //         }
    //     }else{
    //         navigate("/login");
    //     }
    // }, [navigate])



    return (
        <div>
            <h1>Welcome Patient</h1>
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





