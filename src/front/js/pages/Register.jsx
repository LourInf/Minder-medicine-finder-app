import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Navigate, useNavigate } from "react-router-dom";



export const Register = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [is_pharmacy, setIs_pharmacy] = useState(false);
    const [name, setName] = useState("");
    const [pharmacy_name, setPharmacy_name] = useState("");
    const [soe_number, setSoe_number] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [is24, setIs24] = useState(false);
    const [phone, setPhone] = useState("");
    const [workingHours, setWorkingHours] = useState("");
    const [existingEmail, setExistingEmail] = useState(false);
    const navigate = useNavigate();


    const checkExistingEmail = async (emailToCheck) => {

        console.log(`Qué es email -> ${emailToCheck}`);

        const url = process.env.BACKEND_URL + `/api/getPatient/${emailToCheck}`;

        try {
            const msg = document.querySelector("#errorExistingEmail");
            const btnSubmit = document.querySelector("#send");
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setExistingEmail(true);
                msg.style.display = "block";
                btnSubmit.disabled = true;
            } else {
                setExistingEmail(false);
                msg.style.display = "none";
                btnSubmit.disabled = false;
            }


        } catch (error) {
            console.error("Error checking if the email already exist");
            setExistingEmail(false);
        }


    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const msg = document.querySelector("#errorMessage");
        const msgAllDone = document.querySelector("#allDoneMessage");
        const btnSubmit = document.querySelector("#send");
        if(!existingEmail){
            const url = process.env.BACKEND_URL + "/api/signup";
            console.log(url);
            const options = {
                method: "POST",
                body: JSON.stringify({ email, password, is_pharmacy, name }),
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
                btnSubmit.disabled = true;
                msgAllDone.style.display = "block";
                setTimeout(() => {
                    window.location.href = "/login"
                }, 2000)
            } else {
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
        

    }

    const checkEmail = async (v) => {
        console.log(`ESTO ES EMAIL DEL INPUT -> ${v}`);
        setEmail(v);
        await checkExistingEmail(v);
    }




    useEffect(() => {
        const userLogged = JSON.parse(localStorage.getItem("userLogged"));
        if (userLogged) {
            if (userLogged.expire < new Date().getTime()) {
                localStorage.removeItem("userLogged");
            } else {
                navigate("/patientHome");
            }
        }
    }, [navigate])



    return (
        store.isLoggedIn ? <Navigate to="/login" /> :
            <div>

                <form onSubmit={handleSubmit} className="form-group col-md-6 py-5 px-md-5">
                    <h1 className="text-center">THIS IS REGISTER</h1>
                    <p id="allDoneMessage" className="p-3" style={{ color: "green", borderRadius: "10px", border: "solid green 3px", display: "none" }}>Register completed</p>
                    <p id="errorMessage" className="p-3" style={{ color: "red", borderRadius: "10px", border: "solid red 3px", display: "none" }}>Error during the register of new user</p>
                    <p id="errorExistingEmail" className="p-3" style={{ color: "orange", borderRadius: "10px", border: "solid red 3px", display: "none" }}>This User already exist <a href="/login">Would you like to login?</a></p>
                    {/* <p id="errorAlreadyExists" className="p-3" style={{ color: "brown", borderRadius: "10px", border: "solid red 3px", display: "none" }}></a></p> */}
                    <div className="form-outline mb-4">
                        <input type="email" id="registerForm1" className="form-control"
                            value={email} onChange={async (e) => await checkEmail(e.target.value)} required />
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

                            <div className="form-outline mb-4">
                                <input type="text" id="registerForm5" className="form-control"
                                    value={pharmacy_name} onChange={(e) => setPharmacy_name(e.target.value)} required />
                                <label className="form-label" htmlFor="registerForm5">Pharmacy name</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="text" id="registerForm6" className="form-control"
                                    value={soe_number} onChange={(e) => setSoe_number(e.target.value)} required />
                                <label className="form-label" htmlFor="registerForm6">SOE number</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="text" id="registerForm7" className="form-control"
                                    value={address} onChange={(e) => setAddress(e.target.value)} required />
                                <label className="form-label" htmlFor="registerForm7">Address</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="text" id="registerForm8" className="form-control"
                                    value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
                                <label className="form-label" htmlFor="registerForm8">Latitude</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="text" id="registerForm9" className="form-control"
                                    value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
                                <label className="form-label" htmlFor="registerForm9">Longitude</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="checkbox" id="registerForm10" className="form-check-input"
                                    onChange={(e) => setIs24(e.target.checked)} checked={is24} />
                                <label className="form-label" htmlFor="registerForm3">Is 24 hours?</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="text" id="registerForm11" className="form-control"
                                    value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                <label className="form-label" htmlFor="registerForm11">Phone</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="text" id="registerForm12" className="form-control"
                                    value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} required />
                                <label className="form-label" htmlFor="registerForm12">Working hours</label>
                            </div>



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