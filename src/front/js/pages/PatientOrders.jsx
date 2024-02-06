import React, { useContext } from "react"


export const PatientOrders = () => {

    const { store, actions } = useContext(Context);
    const [ patient, setPatient ] = useState(null);
  

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




    useEffect(() => {

        console.log("Hola antes del getPatientInfo");
        const getPatientInfo = async () => {

            const patientId = localStorage.getItem("user_id")   //  Lo malo es que el id de este usuario será vulnerable...
            const url = process.env.BACKEND_URL + `/api/getPatientById/${patientId}`;

            try{
                console.log("La url -> ",url);
                const response = await fetch(url);
                console.log("Pasado el response");
                
                if(response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setPatient(data);
                }else{
                    console.error("Error fetching the patient");
                }
            }catch (error){
                console.error("Error fetching the patient info -> ",error);
            } 
            


        }

        getPatientInfo();

    }, []);


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