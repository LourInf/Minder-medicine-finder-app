import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Navigate, useNavigate } from "react-router-dom";



export const Login = () => {
    const { store, actions } = useContext(Context);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const navigate = useNavigate();
    


    const handleSubmit = async (e, ttl) => {
        e.preventDefault();
        const url = process.env.BACKEND_URL + "/api/login";
        console.log(url);
        const options = {
            method : "POST",
            body : JSON.stringify({email, password}),
            headers : {
                "Content-Type" : "application/json"
            }
        };
        console.log(options);

        const response = await fetch(url, options);
        console.log(response);
        if(response.ok){
            const data = await response.json();
            actions.login(data)
            //navigate(store.urlPostLogin);             -->REMOVED AS IT LOGGED OUT
        
            const currentTime = new Date();


            const userLogged = {
                "token": data.token,
                "user_id": data.user_id,
                "email": data.email,
                "is_pharmacy": data.is_pharmacy,
                "expire": currentTime.getTime() + 3600000  //  Expiración del token en 5 segundos... => CHANGED!! TOO SHORT
            };

            localStorage.setItem("userLogged", JSON.stringify(userLogged))



            if(data.is_pharmacy){
                // alert("working on...")
                console.log("What is the url -> ",store.urlPostLogin)
                navigate(store.urlPostLogin);
            }else if(data.is_pharmacy == false){
                console.log("What is the url -> ",store.urlPostLogin)
                navigate(store.urlPostLogin);
                // TODO 
                // Hay que hacer la lógica para solo poder acceder si tiene token. AUTHENTICATION
                //navigate("/patient");
            }else{
                console.error("What is this role -> ",data.is_pharmacy);
                const msg = document.querySelector("#errorMessageRole");
                msg.style.display = "block";
                setTimeout(() => {
                    msg.style.display = "none";
                }, 3000)
            }
            console.log(data);


        }else{
            const msg = document.querySelector("#errorMessage");
            msg.style.display = "block";
            setTimeout(() => {
                msg.style.display = "none";
            }, 3000)
            console.log(" Falló...", response.status, response.statusText)
        }

    }

    useEffect(() => {
        const userLogged = JSON.parse(localStorage.getItem("userLogged"));
        if(userLogged != null){
            if(userLogged.expire < new Date().getTime()){
                localStorage.removeItem("userLogged");
            }else{
                // navigate("/patientHome");   //  se usa?
            }
        }
    }, [navigate])


    return (
        
            store.isLoggedIn ? (

                // store.is_pharmacy ? (
                //     <Navigate to={store.urlPostLogin}/>   //  Nee to be changed in the case of pharmacy

                // ) : (

                    <Navigate to={store.urlPostLogin}/>   //  Nee to be changed in the case of pharmacy
                // )

            ) : (
            <div>
    
                <form onSubmit={handleSubmit} className=" form-group col-md-6 py-5 px-md-5">
                    <h1 className="text-center">THIS IS LOGÍN</h1>
                    <p id="errorMessage" className="p-3" style={{color: "red", borderRadius: "10px", border: "solid red 3px", display: "none"}}>The pass or user doesn't exists <a href="/register">Would you like to sign up?</a></p>
                    <p id="errorMessageRole" className="p-3" style={{color: "red", borderRadius: "10px", border: "solid red 3px", display: "none"}}>Your role is not correct <a href="/register">Would you like to create a new account?</a></p>
                    <div className="form-group form-outline mb-4">
                        <input type="email" id="form2Example1" className="form-control" 
                            value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <label className="form-label" htmlFor="form2Example1">Email address</label>
                    </div>
                    <div className="form-group form-outline mb-4">
                        <input type="password" id="form2Example2" className="form-control"
                            value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <label className="form-label" htmlFor="form2Example2">Password</label>
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary btn-block mb-4">
                            Sign in
                        </button>
                    </div>
                </form>
    
            </div>
            )
        
    )

    


}