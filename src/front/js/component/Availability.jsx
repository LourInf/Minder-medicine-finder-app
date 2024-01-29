import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js" 
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';


export const Availability = () => {
    const { store, actions } = useContext(Context);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(50);
    const [totalPages, setTotalPages] = useState(0);

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


    return (
    <div className="container">
        <h3 className="m-3 text-center">Estos medicamentos actualmente presentan problemas de suministro. Por favor, indique si su farmacia dispone de inventario:</h3>
        <p className="m-3 text-center">Total medicamentos con problemas de suministro: {store.totalMedicinesPsum}</p>
        
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
        {currentItems.map((medicine, index) => (
          <tr key={medicine.id}>
            <td>{indexOfFirstItem + index + 1}</td>
            <td>{medicine.medicine_name}</td>
            <td>fetch descripcion problema</td> {/* You should fetch and display the actual problem description here */}
            <td>
              <input type="checkbox" />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    <Pagination className="mt-4">{paginationItems}</Pagination>       
    </div>
  );
};

