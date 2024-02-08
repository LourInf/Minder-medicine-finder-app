import React, { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageRole, setErrorMessageRole] = useState("");
    const navigate = useNavigate();

    // redirect users based on their role if already logged in:
    useEffect(() => {
        if (store.isLoggedIn) {
            let redirectTo = store.isPharmacy ? '/pharmacy' : '/patient';
            redirectTo = store.urlPostLogin.includes("result") ? store.urlPostLogin : redirectTo
            navigate(redirectTo);
            actions.resetUrlPostLogin();
        
        }
    }, [store.isLoggedIn, store.isPharmacy, navigate]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${process.env.BACKEND_URL}/api/login/`;
        const options = {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json" 
            },
        };
        console.log(options);

            const response = await fetch(url, options);
            console.log(response);

            if (response.ok) {
                const data = await response.json();

                
                if (data.is_pharmacy === true || data.is_pharmacy === false) {

                    let userLogged = {};

                    if(data.is_pharmacy){   //  pharmacy
                            
                        await actions.getPharmacyId(data.user_id);    //  Save in store the id of the pharmacy
                        console.log("Esto es pharmacy_id -> ",store.pharmacy_id);

                        const currentTime = new Date();
                        userLogged = {
                            "token": data.token,
                            "user_id": data.user_id,
                            "pharmacy_id": store.pharmacy_id,
                            "email": data.email,
                            "is_pharmacy": data.is_pharmacy,
                            "expire": currentTime.getTime() + 3600000,
                        };
                        console.log("Esto es userLogged -> ",userLogged)


                    }else{               //  patient

                        await actions.getPatientId(data.user_id);
                        console.log("Esto es patient_id -> ",store.patient_id);


                        const currentTime = new Date();
                        userLogged = {
                            "token": data.token,
                            "user_id": data.user_id,
                            "patient_id": store.patient_id,
                            "email": data.email,
                            "is_pharmacy": data.is_pharmacy,
                            "expire": currentTime.getTime() + 3600000,
                        };
                        console.log("Esto es userLogged -> ",userLogged)


                    }

                    actions.login(userLogged);  //  Petará?
                    localStorage.setItem("userLogged", JSON.stringify(userLogged));
                    let redirectTo = data.is_pharmacy ? '/pharmacy' : '/patient';
                    navigate(redirectTo);


                } else {
                    setErrorMessageRole("Your role is not correct. Would you like to create a new account?");
                }
            } else {
                setErrorMessage("Login failed. The password or user doesn't exists.");
            }
    };


    return (
        <div>
            <form onSubmit={handleSubmit} className="form-group col-md-6 py-5 px-md-5">
                <h1 className="text-center">Login</h1>
                {errorMessage && <p className="p-3" style={{color: "red", borderRadius: "10px", border: "solid red 3px"}}>{errorMessage}</p>}
                {errorMessageRole && <p className="p-3" style={{color: "red", borderRadius: "10px", border: "solid red 3px"}}>{errorMessageRole}</p>}
                <div className="form-group form-outline mb-4">
                    <input type="email" id="form2Example1" className="form-control"
                        value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
                </div>
                <div className="form-group form-outline mb-4">
                    <input type="password" id="form2Example2" className="form-control"
                        value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>
            </form>
        </div>
    );
};
