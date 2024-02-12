import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { Table, Button, Pagination, Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';
import "../../styles/availability.css";

export const Availability = () => {
  const { store, actions } = useContext(Context);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [filterPsum, setFilterPsum] = useState(true); // State to track if filter by distribution problems is selected
  const [availabilityFilter, setAvailabilityFilter] = useState(""); // State to hold the selected availability filter

	actions.removeUnnecessaryItems();


  // Fetch medicines with distribution problems
  useEffect(() => {
    actions.getMedicinesPsum();
    //actions.getMedicineAvailabilityForPharmacy();
  }, []); // Only run once on component mount

  // Fetch all medicines
  useEffect(() => {
    actions.getMedicinesAllDb(store.pharmacy_id);
  }, [store.pharmacy_id]);

    const allMedicines = store.medicinesAll[0] || [];

    // Filters
    const filteredMedicines = allMedicines.filter(medicine =>
      medicine.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterPsum || store.medicinesPsum.some(psumMedicine => psumMedicine.id === medicine.id))
       && (availabilityFilter === "" || medicine.availability_status === availabilityFilter)
    );


  // const getAvailabilityStatus = (medicineId) => {
  //   // Find availability data for the given medicineId
  //   const availability = store.medicinesAvailability.find(availability => availability.id === medicineId);
  //   console.log("Availability for medicine ID", medicineId, ":", availability ? availability.availability_status : "No disponible");
  //   // If availability data is found, return the availability status
  //   // Otherwise, return "No disponible"
  //   return availability ? availability.availability_status : "No disponible";
  // };

  // Calculate total pages for filtered medicines
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMedicines.slice(indexOfFirstItem, indexOfLastItem);

  // Function to check if a medicine has distribution problems
  const hasDistributionProblem = (medicineId) => {
    return store.medicinesPsum.some(medicine => medicine.id === medicineId);
  };
  
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

  const handleFilterClick = (status) => {
    setAvailabilityFilter(status);
  };


  // Generate pagination items
  const paginationItems = [];
  const pagesToShow = 10; 

  if (totalPages <= pagesToShow) {
    for (let number = 1; number <= totalPages; number++) {
      paginationItems.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
          {number}
        </Pagination.Item>,
      );
    }
  } else {
    const halfPagesToShow = Math.floor(pagesToShow / 2);
    let startPage = currentPage - halfPagesToShow;
    let endPage = currentPage + halfPagesToShow;

    if (startPage <= 0) {
      startPage = 1;
      endPage = pagesToShow;
    } else if (endPage > totalPages) {
      startPage = totalPages - pagesToShow + 1;
      endPage = totalPages;
    }

    for (let number = startPage; number <= endPage; number++) {
      paginationItems.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
          {number}
        </Pagination.Item>,
      );
    }
  }


  // text to display above the table based on the filterPsum state
  const availabilityText = filterPsum ? (
    <h4 className="m-3 text-center">Actualmente, <span className="text-danger fs-2 fw-bold">{store.totalMedicinesPsum}</span> medicamentos presentan problemas de suministro. Por favor, indique si su farmacia dispone de inventario</h4>
    ) : (
      <h3 className="m-3 text-center">Disponibilidad de medicamentos</h3>
    );


  return (
    <div className="main-container">
      
      <div className="filters-container d-flex flex-column align-items-center mb-3">
      {availabilityText}
        <div className="pills-menu-style d-flex justify-content-center">
          <Form.Check
            type="checkbox"
            id="filterPsum"
            label="Mostrar sólo los medicamentos con problemas de suministro"
            checked={filterPsum}
            onChange={() => setFilterPsum(!filterPsum)}
          />
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning ps-2 pt-1"/>
        <div className="mb-3">
      </div>
        
      </div>
      </div>
       
        <div className="filters-container d-flex flex-column align-items-center mb-3">
          <span className="filter-text mb-2">Filtros:</span> 
          <div className="pills-menu-style d-flex justify-content-center">
            <Badge pill bg="" className="badge-soft-success-avail mx-2 p-2" onClick={() => handleFilterClick('Disponible')} style={{ cursor: 'pointer' }}>Disponible</Badge>
            <Badge pill bg="" className="badge-soft-danger-avail mx-2 p-2" onClick={() => handleFilterClick('No Disponible')} style={{ cursor: 'pointer' }}>No Disponible</Badge>
            <Badge pill bg="" className="badge-soft-secondary-avail mx-2 p-2" onClick={() => setAvailabilityFilter('')} style={{ cursor: 'pointer' }}>Mostrar Todo</Badge>
          </div>
        </div>
   
      
      <div className="table-container hover-shadow">
      <Table table-style>
        <thead className="table-head-style">
          <tr>
            <th className="table-cell header" style={{ color: "#00c895", }}>Problema de suministro</th>
            <th className="table-cell header" style={{ color: "#3ab0a7", }}>Medicamento <Form.Control
              type="text"
              placeholder="Busca por su nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /></th>
            <th className="table-cell header" style={{ color: "#00a747", }}>Disponibilidad Actual</th>
            <th className="table-cell header" style={{ color: "#3ab0a7", }}>Actualizar Disponibilidad</th>
          </tr>
          </thead>
          <tbody className="table-body">
            {currentItems.map((medicine, index) => (
              <tr key={index}>
                 <td className="table-cell body-row cell-icon">{hasDistributionProblem(medicine.id) ? 
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning"/> : 
                   ""
                  }</td>
                <td className="table-cell body-row">{medicine.medicine_name}</td>
                <td className="table-cell body-row">{getStatusBadge(medicine.availability_status)}</td>
                <td className="table-cell body-row">
                {medicine.availability_status === 'Disponible' && (
                 <Button variant="" className="btn-not-available btn-sm" onClick={() => handleNotAvailable()}>Cambiar a No Disponible</Button> 
                )}
                {medicine.availability_status === 'No Disponible' && (
                <Button variant="" className="btn-available btn-sm" onClick={() => handleAvailable()}>Cambiar a Disponible</Button>
                )}
                {(medicine.availability_status !== 'Disponible' && medicine.availability_status !== 'No Disponible') && (
                <div className="btn-container-avail d-flex flex-row align-items-center mb-3">
                <Button variant="" className="btn-available btn-sm me-2" onClick={() => handleAvailable()}>Cambiar a Disponible</Button>
                <Button variant="" className="btn-not-available btn-sm" onClick={() => handleNotAvailable()}>Cambiar a No Disponible</Button>
                </div>
                )}
                    
                 
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
        <Pagination className="pagination-style d-flex justify-content-center">
          <Pagination.First onClick={() => setCurrentPage(1)} />
          <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} />
          {paginationItems}
          <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
        </Pagination>
    </div>
  );
};
