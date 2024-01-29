import React,  { useContext, useState }  from "react"; //1. Import hook useContext
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
    const [selectedItem, setSelectedItem] = useState(null);
    const [city, setCity] = useState("");
    const navigate = useNavigate();
    
    const handlePharmacies = () => {
      actions.getPharmacies(city);
    };
  
    const handleKeyPress = (e) => {
      if (e.key== 'Enter') {
        handlePharmacies();
      }
    };

    const handleInputChange = (value) => {
        setInput(value);
        actions.getMedicines(value);
        setSelectedItem(null);   // Reset selected item
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            actions.getMedicines(input);
            setSelectedItem(null); 
        }
    };
   
    const handleItemClick = (item) => {
        setInput(item.medicine_name);
        setSelectedItem(item);
        actions.getMedicines("");
        // For Results: we update the store with the selected medicine
        actions.getSelectedMedicine(item.medicine_name);
        // save selected medicine in session storage
        sessionStorage.setItem('selectedMedicine', JSON.stringify(item));
    };

    // clear selected item
    const clearSelection = () => {
      setInput('');
      setSelectedItem(null);
  };

  const handleSearchResults = () => {
    if (selectedItem && selectedItem.id) {
        navigate(`/results?medicineId=${selectedItem.id}`);   // QUESTION: is it ok to use useNavigate with query parameters for this? (like /results?medicineId=100&locationId=200) or should I use useParams and a route path like /results/medicine/:medicineId/location/:locationId?
        
      } else {
        console.log("No ha seleccionado ningun medicamento");
    }
}

    
    return(
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
                      value={input} onChange ={(e) =>handleInputChange(e.target.value)} onKeyDown={(e) => handleKeyDown(e)}
                    />
                    {input && (
                      <button className="btn-clear-selection" onClick={clearSelection}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </InputGroup>
                  <SearchResultsList onItemClick={handleItemClick} />
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
                      onChange={(e) => setCity(e.target.value)} 
                      onKeyDown={handleKeyPress}
                    />
                  </InputGroup>
                </Col>
                <Col sm={12} md={1}>
                <Button variant="outline-secondary" className="search-form-button" type="button" onClick={handleSearchResults}>
                <FontAwesomeIcon icon={faSearch} />
                </Button>
                </Col>
              </Row> 
            </Container>
    );
};