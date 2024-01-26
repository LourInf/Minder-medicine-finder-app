import React,  { useContext, useState }  from "react"; //1. Import hook useContext
import { Context } from "../store/appContext.js"; //2. Import Context
import "../../styles/searchResultsList.css"

export const SearchResultsList = ({onItemClick}) =>{
    const  {store, actions } = useContext (Context); //3. destructuring store & actions
    // const [selectedItem, setSelectedItem] = useState(null);
      
   
    // const handleItemClick = (item) => {
    //     // Set the selected item when clicked
    //     setSelectedItem(item);
    // };
    
    return(           
            <div className  ="search-results-list">
                 {store.medicines.length > 0 && (
                <div className="list-group">
                    {store.medicines.map((item, index) => (
                        <button
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => onItemClick(item)}>
                            {item.medicine_name}
                        </button>
                    ))}
                </div>
            )}
            </div>
    );
};