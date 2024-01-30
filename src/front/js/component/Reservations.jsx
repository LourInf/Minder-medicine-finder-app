import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js" 

export const Reservations = () => {
  const { store, actions } = useContext(Context);

    return (
      <div className="container">
        <h3 className="m-3 text-center">Reservas:</h3>
        <p className="m-3 text-center">Total reservas: </p>
              
      </div>
    );
  };