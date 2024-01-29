import React,  { useContext, useState }  from "react"; 
import { Context } from "../store/appContext.js" 


export const Availability = () => {
    const { store, actions } = useContext(Context);

    return (
    <div>
      <h1>Availability</h1>
      
    </div>
  );
};

