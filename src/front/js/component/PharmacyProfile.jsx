import React,  { useContext, useState }  from "react"; 
import { Context } from "../store/appContext.js" 

export const PharmacyProfile = () => {
    const { store, actions } = useContext(Context);

    actions.removeUnnecessaryItems();

    return (
    <div>
      <h1>Pharmacy Profile</h1>
      
    </div>
  );
};


