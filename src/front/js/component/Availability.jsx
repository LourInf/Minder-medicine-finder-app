import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { Table, Button, Pagination, Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';
import "../../styles/availability.css";

export const Availability = () => {
  const { store, actions } = useContext(Context);
 
	actions.removeUnnecessaryItems();


  // Fetch all medicines
  useEffect(() => {
    actions.getMedicinesAllDb();
  }, []);

  //1. To bring from store all data available inside medicinesAll to my component to later access it to render it in the table using map. 
  const allMedicines = store.medicinesAll || [];

//FOR DEBUFFING ONLY:
// useEffect(() => {
//   console.log("Store medicinesAll:", store.medicinesAll); // This will show you the complete structure of medicinesAll
//   if (store.medicinesAll.length > 0 && Array.isArray(store.medicinesAll[0])) {
//     console.log('First medicine object:', store.medicinesAll[0][0]);
//   } else {
//     console.log('medicinesAll may not be an array of arrays, check the structure');
//   }
// }, [store.medicinesAll]);


  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Disponible':
        return <Badge pill bg="" className="badge-soft-success-avail p-2">Disponible</Badge>;
      case 'No Disponible':
        return <Badge pill bg="" className="badge-soft-danger-avail p-2">No disponible</Badge>;
      default:
        return <Badge pill bg="" className="badge-soft-warning-avail p-2">Desconocido</Badge>;
    }
  };

  const handleAvailable = async (medicineId) => {
    console.log(`handleAvailable called for medicineId: ${medicineId}`);
    console.log(`Changing status to: "Disponible" for medicineId: ${medicineId}`);
    const success = await actions.updateMedicineAvailability(store.pharmacy_id, medicineId, "AVAILABLE");
    
    if (success) {
      console.log(`Status changed to "Disponible" for medicineId: ${medicineId}`);
      // Re-fetch the medicines list to get the updated statuses
      actions.getMedicinesAllDb();
    } else {
      console.error(`Failed to change status to "Disponible" for medicineId: ${medicineId}`);
    }
  };
  
  const handleNotAvailable = async (medicineId) => {
    console.log(`handleNotAvailable called for medicineId: ${medicineId}`);
    console.log(`Changing status to: "No Disponible" for medicineId: ${medicineId}`);
    const success = await actions.updateMedicineAvailability(store.pharmacy_id, medicineId, "NOT_AVAILABLE");
    
    if (success) {
      console.log(`Status changed to "No Disponible" for medicineId: ${medicineId}`);
      // Re-fetch the medicines list to get the updated statuses
      actions.getMedicinesAllDb();
    } else {
      console.error(`Failed to change status to "No Disponible" for medicineId: ${medicineId}`);
    }
  };


  const handleFilterClick = (status) => {
    setAvailabilityFilter(status);
    
  };


  return (
    <div className="main-container">
      
      <div className="filters-container d-flex flex-column align-items-center mb-3">
      <h4 className="m-3 text-center">Actualmente, <span className="text-danger fs-2 fw-bold">NUMBER</span> medicamentos presentan problemas de suministro. Por favor, indique si su farmacia dispone de inventario</h4>
        <div className="pills-menu-style d-flex justify-content-center">
          {/* <Form.Check
            type="checkbox"
            id="filterPsum"
            label="Mostrar sólo los medicamentos con problemas de suministro"
            checked=""
            onChange=""
          /> */}
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning ps-2 pt-1"/>
        <div className="mb-3">
      </div>
        
      </div>
      </div>
       
        <div className="filters-container d-flex flex-column align-items-center mb-3">
          <span className="filter-text mb-2">Filtros:</span> 
          <div className="pills-menu-style d-flex justify-content-center">
            <Badge pill bg="" className="badge-soft-success-avail filter-badge mx-2 p-2" onClick={() => handleFilterClick('Disponible')} style={{ cursor: 'pointer' }}>Disponible</Badge>
            <Badge pill bg="" className="badge-soft-danger-avail filter-badge mx-2 p-2" onClick={() => handleFilterClick('No Disponible')} style={{ cursor: 'pointer' }}>No Disponible</Badge>
            <Badge pill bg="" className="badge-soft-secondary-avail filter-badge mx-2 p-2" onClick={() => setAvailabilityFilter('')} style={{ cursor: 'pointer' }}>Mostrar Todo</Badge>
          </div>
        </div>
   
      
      <div className="table-container hover-shadow">
          <Table className="table-style"> {/* If table-style is a class, use className to assign it */}
          <thead className="table-head-style">
            <tr>
              <th className="table-cell header" style={{ color: "#00c895" }}>Problema de suministro</th>
              <th className="table-cell header" style={{ color: "#3ab0a7" }}>Medicamento</th>
              <th className="table-cell header" style={{ color: "#00a747" }}>Disponibilidad Actual</th>
              <th className="table-cell header" style={{ color: "#3ab0a7" }}>Actualizar Disponibilidad</th>
            </tr>
          </thead>
          {/* 2. by mapping allMedicines we create a row for each medicine and we render the properties we want */}
          <tbody className="table-body">
            {allMedicines.map((medicine, index) => {
               const key = `${medicine.id}-${index}`;
               return (

              <tr key={key}> 
                <td className="table-cell body-row cell-icon">
                  {medicine.has_psum ? <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning" /> : ""}
                </td>
                <td className="table-cell body-row">{medicine.medicine_name}</td>
                <td className="table-cell body-row">{getStatusBadge(medicine.availability_status)}</td>
                <td className="table-cell body-row">
                  {medicine.availability_status === 'Disponible' ? (
                    <Button variant="" className="btn-not-available btn-sm" onClick={() => handleNotAvailable(medicine.id)}>Cambiar a No Disponible</Button>
                  ) : (
                    <Button variant="" className="btn-available btn-sm" onClick={() => handleAvailable(medicine.id)}>Cambiar a Disponible</Button>
                  )}
                </td>
              </tr>
            )
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
