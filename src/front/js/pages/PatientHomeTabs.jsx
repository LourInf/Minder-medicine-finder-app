import React from "react";
import { Link, Route, Routes, Outlet } from "react-router-dom" ;
import { PatientInfo } from "./PatientInfo.jsx";

// const PatientInfo = () => {

//     const examplePatient = {
//         name: "Test1",
//         email: "test@test.test"
//     }


//     return (

//         <div>

//             <h2>Patient information</h2>
//             <p>Name: {examplePatient.name}</p>
//             <p>Email: {examplePatient.email}</p>

//         </div>

//     )


// }


const PatientOrders = () => {

    const orders = [

        {
            orderId: 38249,
            items:[
                {itemId:"562", itemName:"Hostión", quantity:"1"},
                {itemId:"637", itemName:"Melasuda", quantity:"3"},
            ], 
            status:"Pending"
        },
        {
            orderId: 58326,
            items:[
                {itemId:"213", itemName:"Nofumesmax", quantity:"10"},
            ], 
            status:"Completed"
        }

    ];

    return (
        <div>
            <h2>Patient Orders</h2>
            <ul>
                {orders.map((order) => {
                    <li key={order.orderId}>
                        Order Id: {order.orderId} - <h4>Items</h4>
                        <ul>
                            {orders.items.map((item) => {
                                <li>Item Id: {item.itemId} - Item Name: {item.itemName} - Quantity: {item.quantity}</li>
                            })}
                        </ul>
                         - Status: {order.status}
                    </li>
                })}
            </ul>
        </div>
    )

}



export const PatientHome = () => {

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
          <Outlet />
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





