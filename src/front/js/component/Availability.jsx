import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { Table, Button, Pagination, Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';

export const Availability = () => {
  const { store, actions } = useContext(Context);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [filterPsum, setFilterPsum] = useState(true); // State to track if filter by distribution problems is selected
  const [availabilityFilter, setAvailabilityFilter] = useState(null); // State to hold the selected availability filter

  // Fetch all medicines
  useEffect(() => {
    actions.getMedicinesAllDb();
  }, [actions]);

  // Fetch medicines with distribution problems
  useEffect(() => {
    actions.getMedicinesPsum();
    actions.getMedicineAvailabilityForPharmacy();
  }, []); // Only run once on component mount

  const getAvailabilityStatus = (medicineId) => {
    // Find availability data for the given medicineId
    const availability = store.medicinesAvailability.find(availability => availability.id === medicineId);
    console.log("Availability for medicine ID", medicineId, ":", availability ? availability.availability_status : "No disponible");
    // If availability data is found, return the availability status
    // Otherwise, return "No disponible"
    return availability ? availability.availability_status : "No disponible";
  };

  // Assuming medicinesAll is correctly populated with an array of medicines
  const allMedicines = store.medicinesAll[0] || [];

/// Filter medicines based on search term, distribution problems, and availability filter
const filteredMedicines = allMedicines.filter(medicine =>
  (medicine.medicine_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
  (!filterPsum || store.medicinesPsum.some(psumMedicine => psumMedicine.id === medicine.id)) &&
  (availabilityFilter === null || getAvailabilityStatus(medicine.id) === availabilityFilter)
);

console.log("Filtered Medicines:", filteredMedicines);

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

  

   // Handle filter selection
   const handleFilterSelection = (availability) => {
    setAvailabilityFilter(availability === availabilityFilter ? null : availability);
  };


  // Generate pagination items
  const paginationItems = [];
  const pagesToShow = 5; // Adjust as needed

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

  // Define the text to display above the table based on the filterPsum state
const availabilityText = filterPsum ? (
  <div>
    <h3 className="m-3 text-center">Estos medicamentos actualmente presentan <span className="text-danger fw-bold">problemas de suministro</span>. Por favor, indique si su farmacia dispone de inventario:</h3>
    <p className="m-3 text-center">Total medicamentos con problemas de suministro: <span className="text-danger fs-2 fw-bold">{store.totalMedicinesPsum}</span></p>
  </div>
) : (
  <h3 className="m-3 text-center">Disponibilidad de medicamentos</h3>
);


  return (
    <div className="container">
      {availabilityText}

      <Form.Check
        type="checkbox"
        id="filterPsum"
        label="Ver solo los medicamentos con problemas de suministro"
        checked={filterPsum}
        onChange={() => setFilterPsum(!filterPsum)}
      />

       <div className="mb-3">
        
        <Form.Group controlId="formSearch">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning"/>
          <Form.Control
            type="text"
            placeholder="Search by medicine name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <div className="mt-3">
          
          <Badge pill className="p-2" bg={availabilityFilter === "Disponible" ? "success" : "secondary"} onClick={() => handleFilterSelection("Disponible")}>
            Disponible
          </Badge>{' '}
          <Badge pill className="p-2" bg={availabilityFilter === "No disponible" ? "danger" : "secondary"} onClick={() => handleFilterSelection("No disponible")}>
            No disponible
          </Badge>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Con problema de suministro</th>
            <th>Disponibilidad Actual</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((medicine, index) => (
            <tr key={index}>
              <td>{medicine.medicine_name}</td>
              <td>{hasDistributionProblem(medicine.id) ? 
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning"/> : 
                  <FontAwesomeIcon icon={faCheck} />
                }</td>
                <td> <Badge pill bg={getAvailabilityStatus(medicine.id) === "Disponible" ? "success" : "danger"}>
                  {getAvailabilityStatus(medicine.id)}
                </Badge>
              </td>
              <td>
                <Button variant="primary">Action</Button> {/* Placeholder for actual action */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.First onClick={() => setCurrentPage(1)} />
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} />
        {paginationItems}
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
      </Pagination>
    </div>
  );
};
