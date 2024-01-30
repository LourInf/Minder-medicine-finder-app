import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js" 
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';


export const Availability = () => {
  const { store, actions } = useContext(Context);

  // useState to track filters
  const [medicineNameFilter, setMedicineNameFilter] = useState("");
  const [problemTypeFilter, setProblemTypeFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all"); // "all" => no filter

  // useState to track pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(0);

  // useState to track medicines' availability
  const [medicineAvailability, setMedicineAvailability] = useState({});

  const updateMedicineAvailability = (medicineId, isChecked) => {
    setMedicineAvailability({
      ...medicineAvailability,
      [medicineId]: isChecked,
    });
    
    // Call action to update availability in the backend
    actions.updateMedicineAvailability(medicineId, isChecked);

  };

  useEffect(() => {
    setTotalPages(Math.ceil(store.medicinesPsum.length / itemsPerPage));
  }, [store.medicinesPsum, itemsPerPage]);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = store.medicinesPsum.slice(indexOfFirstItem, indexOfLastItem);

  const paginationItems = [];
      for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
          <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageClick(number)}>
            {number}
          </Pagination.Item>,
        );
      }

  const applyFilters = () => {
      const filteredItems = store.medicinesPsum.filter((medicine) => {
        const nameMatch = medicine.medicine_name.toLowerCase().includes(medicineNameFilter.toLowerCase());
        const problemTypeMatch = problemTypeFilter === "" || medicine.problem_type.toLowerCase() === problemTypeFilter.toLowerCase();
        const availabilityMatch = availabilityFilter === "all" || (availabilityFilter === "disponible" && medicine.is_available) || (availabilityFilter === "no_disponible" && !medicine.is_available);
          return nameMatch && problemTypeMatch && availabilityMatch;
        });
      return filteredItems;
    };

    const filteredItems = applyFilters();
      
    return (
      <div className="container">
        <h3 className="m-3 text-center">Estos medicamentos actualmente presentan problemas de suministro. Por favor, indique si su farmacia dispone de inventario:</h3>
        <p className="m-3 text-center">Total medicamentos con problemas de suministro: {store.totalMedicinesPsum}</p>
        
        {/* Filters */}
        <div className="d-flex justify-content-between mb-3">
          <div className="mb-3 mr-3">
            <input type="text" placeholder="Buscar por nombre de medicamento" value={medicineNameFilter} onChange={(e) => setMedicineNameFilter(e.target.value)}/>
          </div>
          <div className="mb-3 mr-3">
            <select value={problemTypeFilter} onChange={(e) => setProblemTypeFilter(e.target.value)}>
              <option value="">Todos los tipos de problema</option>
              <option value="problema1">Problema 1</option>
              <option value="problema2">Problema 2</option>
            </select>
          </div>
          <div className="mb-3">
            <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
              <option value="all">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="no_disponible">No Disponible</option>
            </select>
          </div>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Medicamento</th>
              <th>Problema activo</th>
              <th>Disponibilidad</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.slice(indexOfFirstItem, indexOfLastItem).map((medicine, index) => (
              <tr key={medicine.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{medicine.medicine_name}</td>
                <td>fetch descripcion problema</td> {/* You should fetch and display the actual problem description here */}
                <td>
                  <input type="checkbox" checked={medicine.is_available} onChange={() => actions.updateMedicineAvailability(medicine.id, !medicine.is_available)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination className="mt-4">{paginationItems}</Pagination>       
      </div>
    );
  };