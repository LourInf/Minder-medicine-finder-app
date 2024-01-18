import React,  { useContext, useState }  from "react"; //1. Import hook useContext
import { Context } from "../store/appContext.js"; //2. Import Context
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import "../../styles/searchBar.css"


export const SearchBar = () =>{
    const  {store, actions } = useContext (Context); //3. destructuring store & actions
    const [input, setInput] = useState("");
      

    const handleChange = (value) => {
        setInput(value);
   actions.getMedicines(value);
    };
   
    

    
    return(
        <div className="container">
            <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Busca tu medicamento..." aria-label="Barra Busqueda medicamento"
            value={input} onChange ={(e) =>handleChange(e.target.value)}
            />
            <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="button"><FontAwesomeIcon icon={faSearch} /></button>
            </div>
            </div>

        </div>
    )
}
