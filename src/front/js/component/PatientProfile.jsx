import React,  { useContext, useState }  from "react"; 
import { Context } from "../store/appContext.js" 

export const PatientProfile = () => {
    const { store, actions } = useContext(Context);

    return (
    <div>
      <h1>Patient Profile</h1>
      
    </div>
  );
};


