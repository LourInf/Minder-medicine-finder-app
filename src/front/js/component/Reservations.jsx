import React,  { useContext, useState }  from "react"; 
import { Context } from "../store/appContext.js" 

export const Reservations = () => {
    const { store, actions } = useContext(Context);
  
    return (
    <div>
      <h1>Reservations</h1>
      
    </div>
  );
};

