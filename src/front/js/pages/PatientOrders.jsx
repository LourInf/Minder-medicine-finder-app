import React from "react"


export const PatientOrders = () => {

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
                {orders.map((order) => (
                    <li key={order.orderId}>
                        <b>Order Id:</b> {order.orderId} - <b>Items</b>
                        <ul>
                            {order.items.map((item) => (
                                <li key={item.itemId}>Item Id: {item.itemId} - Item Name: {item.itemName} - Quantity: {item.quantity}</li>
                            ))}
                        </ul>
                         - <b>Status:</b> {order.status}
                    </li>
                ))}
            </ul>
        </div>
    )

}