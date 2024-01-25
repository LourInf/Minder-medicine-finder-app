import React,  { useContext, useState }  from "react"; //1. Import hook useContext
import { Context } from "../store/appContext.js"; //2. Import Context
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import "../../styles/searchBar.css"
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { SearchResultsList } from "./SearchResultsList.jsx";

export const SearchBar = () =>{
    const  {store, actions } = useContext (Context); //3. destructuring store & actions
    const [input, setInput] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
      
    const handleInputChange = (value) => {
        setInput(value);
        actions.getMedicines(value);
        // Reset selected item when input changes
        setSelectedItem(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            actions.getMedicines(input);
            // Reset selected item when Enter key is pressed
            setSelectedItem(null);
        }
    };
   
    const handleItemClick = (item) => {
        // Set the selected item when clicked
        setSelectedItem(item);
    };
    
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
                  </InputGroup>
                  <SearchResultsList/>
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
                      placeholder="Ciudad, Dirección o Farmacia "
                      aria-label="localizacion"
                      aria-describedby="localizacion"
                    />
                  </InputGroup>
                </Col>
                <Col sm={12} md={1}>
                <Button variant="outline-secondary" className="search-form-button" type="button" onClick={() => actions.getMedicines(input)}>
                <FontAwesomeIcon icon={faSearch} />
                </Button>
                </Col>
              </Row> 
            </Container>
    );
};