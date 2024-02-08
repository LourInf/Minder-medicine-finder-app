import React,  { useContext, useState, useEffect }  from "react"; //1. Import hook useContext
import { Context } from "../store/appContext.js"; //2. Import Context
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import "../../styles/searchBar.css"
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { SearchResultsList } from "./SearchResultsList.jsx";
import { useNavigate } from 'react-router-dom'

export const SearchBar = () =>{
    const  {store, actions } = useContext (Context); //3. destructuring store & actions
    const [input, setInput] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const [isMedicineSelected, setIsMedicineSelected] = useState(false);
    const [city, setCity] = useState("");
    const navigate = useNavigate();

    const handleMedicineChange = (value) => {
        setInput(value);
        actions.getMedicines(value);
        setSelectedItem("");
    };

    const handleMedicineKeyDown = (e) => {
        if (e.key === 'Enter') {
            setSelectedItem(""); 
        }
    };
   
    const handleMedicineSelect = (item) => {
        setInput(item.medicine_name);
        setSelectedItem(item);
        actions.clearMedicines()
        actions.getSelectedMedicine(item.medicine_name);
        localStorage.setItem('selectedMedicine', JSON.stringify(item))
        setIsMedicineSelected(true);
    };

    const clearSelectionMedicine = () => {
      setInput("");
      setSelectedItem("");
      actions.clearMedicines(); 
    };

    const handleCityChange = (e) => {
      const newCity = e.target.value;
      setCity(newCity); 
      actions.setSelectedCityName(newCity);
      localStorage.setItem('selectedCityName', JSON.stringify(newCity));
    };

    const handleCityKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (isMedicineSelected) {
          handleSearchResults();
      } else {
              alert('Por favor, seleccione una ciudad'); 
          }
      }
    };
    
  const handleSearchResults = () => {
      const selectedMedicine = JSON.parse(localStorage.getItem('selectedMedicine'));
      console.log('selectedMedicine:', selectedMedicine);
      console.log('city:', city);
      
      if (selectedMedicine && selectedMedicine.id && city) {
          navigate(`/results/${selectedMedicine.id}/${encodeURIComponent(store.selectedCityName)}`);
      } else {
          console.log("You must select both a medicine and a city.");
      }
  };

    const clearSelectionCity = () => {
      setCity("");
  };


    return(
            <div className="search-component">
            <Container className="search-form-container">
              <Row className="" >
                <Col className="" sm={12} md={5}>
                  <Form.Label htmlFor="medicamento" className="search-form-label">Medicamento</Form.Label>
                  <InputGroup className="mb-3 ">
                    <Form.Control onSubmit={(e)=> e.preventDefault()}
                      className="search-form-input"
                      placeholder="Busca tu medicamento"
                      aria-label="medicamento"
                      aria-describedby="medicamento"
                      value={input} onChange ={(e) =>handleMedicineChange(e.target.value)} onKeyDown={(e) => handleMedicineKeyDown(e)}
                    />
                    {input && (
                      <button className="btn-clear-selection" onClick={clearSelectionMedicine}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </InputGroup>
                  <SearchResultsList 
                    items={store.medicines} 
                    displayItem="medicine_name" 
                    onItemClick={handleMedicineSelect} />
                </Col>
                <Col sm={12} md={1}>
                  <div className="vertical-line d-none d-md-block"></div>
                  <div className="horizontal-line d-block d-md-none"></div>
                </Col>
                <Col className="" sm={12} md={5}>
                  <Form.Label htmlFor="localizacion" className="search-form-label">¿Dónde?</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      className="search-form-input"
                      placeholder=" Dirección, Ciudad o Código Postal "
                      aria-label="localizacion"
                      aria-describedby="localizacion"
                      value={city}
                      onChange={handleCityChange} 
                      onKeyDown={(e) => handleCityKeyDown(e)}
                      />
                      {city && (
                      <button className="btn-clear-selection" onClick={clearSelectionCity}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </InputGroup>
                </Col>
                <Col sm={12} md={1}>
                <Button variant="outline-secondary" className="search-form-button" type="button" onClick={handleSearchResults}>
                <FontAwesomeIcon icon={faSearch} />
                </Button>
                </Col>
              </Row> 
            </Container>
            </div>
    );
};