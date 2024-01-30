import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom";



export const Register = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [is_pharmacy, setIs_pharmacy] = useState(false)
    const [name, setName] = useState("");


    // setEmailLogin("test");
    // setPasswordLogin("pass");


    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = process.env.BACKEND_URL + "/api/signup";
        console.log(url);
        const options = {
            method: "POST",
            body: JSON.stringify({ email, password, is_pharmacy, name}),
            headers: {
                "Content-Type": "application/json"
            }
        };
        console.log(options);
        // try{
            const response = await fetch(url, options);
            console.log(response);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const msg = document.querySelector("#allDoneMessage");
                const btn = document.querySelector("#send");
                btn.disabled = true;
                msg.style.display = "block";
                setTimeout(() => {
                    window.location.href = "/login"
                }, 2000)
            } else {
                const msg = document.querySelector("#errorMessage");
                msg.style.display = "block";
                setTimeout(() => {
                    msg.style.display = "none";
                }, 6000)
                console.log(" Falló...", response.status, response.statusText)
            }
        // }catch(error){
        //     console.log("An error has ocurred -> ",error)
        // }
        


    }



    return (
        store.isLoggedIn ? <Navigate to="/login" /> :
            <div>

                <form onSubmit={handleSubmit} className="form-group col-md-6 py-5 px-md-5">
                    <h1 className="text-center">THIS IS REGISTER</h1>
                    <p id="allDoneMessage" className="p-3" style={{ color: "green", borderRadius: "10px", border: "solid green 3px", display: "none" }}>Register completed</p>
                    <p id="errorMessage" className="p-3" style={{color: "red", borderRadius: "10px", border: "solid red 3px", display: "none"}}>Error during the register of new user</p>
                    <div className="form-outline mb-4">
                        <input type="email" id="registerForm1" className="form-control"
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <label className="form-label" htmlFor="registerForm1">Email address</label>
                    </div>
                    <div className="form-outline mb-4">
                        <input type="password" id="registerForm2" className="form-control"
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <label className="form-label" htmlFor="registerForm2">Password</label>
                    </div>
                    <div className="form-outline mb-4">
                        <input type="checkbox" id="registerForm3" className="form-check-input"
                            onChange={(e) => setIs_pharmacy(e.target.checked)} checked={is_pharmacy} />
                        <label className="form-label" htmlFor="registerForm3">Is pharmcy?</label>
                    </div>

                    {!is_pharmacy && (
                        <div className="form-outline mb-4">
                            <h3>You are a patient</h3>
                            <input type="text" id="registerForm4" className="form-control"
                                value={name} onChange={(e) => setName(e.target.value)} required />
                            <label className="form-label" htmlFor="registerForm4">Name</label>
                        </div>
                    )}

                    {is_pharmacy && (

                        <div>
                            <h3>You are a pharmacy</h3>
                        </div>

                    )}

                    <div>
                        <button id="send" type="submit" className="btn btn-primary btn-block mb-4">
                            Sign up
                        </button>
                    </div>
                </form>

            </div>

    )


}