import React,  { useContext, useState }  from "react"; //1. Import hook useContext
import { Context } from "../store/appContext.js"; //2. Import Context
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import "../../styles/searchBar.css"


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
        <div className="container">
            <form className="input-wrapper input-group mb-3" onSubmit={(e)=> e.preventDefault()}>
            <input type="text" className="input-field form-control" placeholder="Busca tu medicamento..." aria-label="Barra Busqueda medicamento"
            value={input} onChange ={(e) =>handleInputChange(e.target.value)} onKeyDown={(e) => handleKeyDown(e)}/>
            <div className="input-group-append">
                <button className="btn-search btn btn-outline-secondary" type="button" onClick={() => actions.getMedicines(input)}><FontAwesomeIcon icon={faSearch} /></button>
            </div>
            </form>
            
            <div className  ="search-results-list">
                {selectedItem ? (
                    // Render only the selected item
                    <div className="search-result-item" onClick={() => handleItemClick(null)}>
                        <p>{selectedItem.medicine_name}</p>
                    </div>
                ) : (
                    // Render the list of items
                    <ul>
                        {store.medicines.map((item, index) => (
                            <div key={index} className="search-result-item" onClick={() => handleItemClick(item)}>
                                <p>{item.medicine_name}</p>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};