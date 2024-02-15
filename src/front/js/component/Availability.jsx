import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { Table, Button, Badge, Form, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';
import { CustomPagination } from "./CustomPagination.jsx";
import "../../styles/availability.css";

export const Availability = () => {
  const { store, actions } = useContext(Context);
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1); //for page state
  const [filterPsum, setFilterPsum] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term

  actions.removeUnnecessaryItems();

  // Fetch all medicines based on the current filter status
  useEffect(() => {
    console.log(`Fetching medicines with status: ${filterStatus}, page: ${currentPage}, psum: ${filterPsum}, search: ${searchTerm}`);
    actions.getMedicinesAllDb(filterStatus, currentPage, filterPsum, searchTerm);
  }, [filterStatus, currentPage, filterPsum, searchTerm]);


  //1. To bring from store all data available inside medicinesAll to my component to later access it to render it in the table using map. 
  const allMedicines = store.medicinesAll || [];
  const paginationInfo = store.paginationInfo || {};


  const getStatusBadge = (status) => {
    switch (status) {
      case 'Disponible':
        return <Badge pill bg="" className="badge-soft-success-avail p-2">Disponible</Badge>;
      case 'No disponible':
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
      //Re-fetch the medicines list to get the updated statuses
      actions.getMedicinesAllDb(filterStatus, currentPage);
    } else {
      console.error(`Failed to change status to "Disponible" for medicineId: ${medicineId}`);
    }
  };

  const handleNotAvailable = async (medicineId) => {
    console.log(`handleNotAvailable called for medicineId: ${medicineId}`);
    console.log(`Changing status to: "No disponible" for medicineId: ${medicineId}`);
    const success = await actions.updateMedicineAvailability(store.pharmacy_id, medicineId, "NOT_AVAILABLE");

    if (success) {
      console.log(`Status changed to "No disponible" for medicineId: ${medicineId}`);
      // Re-fetch the medicines list to get the updated statuses
      actions.getMedicinesAllDb(filterStatus, currentPage);
    } else {
      console.error(`Failed to change status to "No disponible" for medicineId: ${medicineId}`);
    }
  };


  const handleFilterClick = (status) => {
    setFilterStatus(status); // filter status update which will trigger the useEffect to refetch medicines
    setCurrentPage(1);
  }
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const availabilityText = filterPsum ? (
    <h4 className="m-3 text-center">Actualmente, <span className="text-danger fs-2 fw-bold">{store.totalMedicinesPsum}</span> medicamentos presentan problemas de suministro.</h4>
    ) : (
      <h3 className="m-3 text-center"></h3>
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
            onChange={(e) => setFilterPsum(e.target.checked)}
          />
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-warning ps-2 pt-1"
          />
        </div>
      </div>
      <div className="filters-container d-flex flex-column align-items-center mb-3">
        <span className="filter-text mb-2">Filtros:</span>
        <div className="pills-menu-style d-flex justify-content-center">
          <Badge pill bg="" className="badge-soft-success-avail filter-badge mx-2 p-2" onClick={() => handleFilterClick('Disponible')} style={{ cursor: 'pointer' }}>Disponible</Badge>
          <Badge pill bg="" className="badge-soft-danger-avail filter-badge mx-2 p-2" onClick={() => handleFilterClick('No disponible')} style={{ cursor: 'pointer' }}>No disponible</Badge>
          <Badge pill bg="" className="badge-soft-secondary-avail filter-badge mx-2 p-2" onClick={() => handleFilterClick('')} style={{ cursor: 'pointer' }}>Mostrar Todo</Badge>
        </div>
      </div>


      <div className="table-container hover-shadow">
        <Table className="table-style">
          <thead className="table-head-style">
            <tr>
              <th className="table-cell header" style={{ color: "#00c895" }}>Problema de suministro</th>
              <th className="table-cell header" style={{ color: "#3ab0a7" }}>Medicamento <Form.Control
                type="text"
                placeholder="Busca por su nombre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2"
              /></th>
              <th className="table-cell header" style={{ color: "#00a747" }}>Disponibilidad Actual</th>
              <th className="table-cell header" style={{ color: "#3ab0a7" }}>Actualizar Disponibilidad</th>
            </tr>
          </thead>
          {/* 2. by mapping allMedicines we create a row for each medicine and we render the properties we want */}
          <tbody className="table-body">
            {allMedicines.map((medicine, index) => {
              const key = `${medicine.medicine_id}-${index}`;
              return (

                <tr key={key}>
                  <td className="table-cell body-row cell-icon">
                    {medicine.has_psum ? <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning" /> : ""}
                  </td>
                  <td className="table-cell body-row">{medicine.medicine_name}</td>
                  <td className="table-cell body-row">{getStatusBadge(medicine.availability_status)}</td>
                  <td className="table-cell body-row">
                    {medicine.availability_status === 'Disponible' ? (
                      <Button variant="" className="btn-not-available btn-sm" onClick={() => handleNotAvailable(medicine.medicine_id)}>Cambiar a: No disponible</Button>
                    ) : (
                      <Button variant="" className="btn-available btn-sm" onClick={() => handleAvailable(medicine.medicine_id)}>Cambiar a: Disponible</Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      <CustomPagination
        totalPages={paginationInfo.totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {/* <Pagination className="justify-content-center">
        {Array.from({ length: paginationInfo.totalPages }, (_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination> */}
    </div>
  );
};