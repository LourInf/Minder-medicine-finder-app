import React,  { useContext, useState }  from "react"; //1. Import hook useContext
import { Context } from "../store/appContext.js"; //2. Import Context
import "../../styles/searchResultsList.css"

export const SearchResultsList = ({items, displayItem, onItemClick}) =>{
    const  {store, actions } = useContext (Context); //3. destructuring store & actions
    
    return(   
        <div className  ="search-results-list">
            {items.length > 0 && (
                <div className="list-group">
                    {items.map((item, index) => (
                        <button
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => onItemClick(item)}>
                            {item[displayItem]}
                        </button>
                        ))}
                </div>
            )}
         </div>        
            
        // Removed to make it reusable for medicines and city searches.
            //<div className  ="search-results-list">
            //      {store.medicines.length > 0 && (
            //     <div className="list-group">
            //         {store.medicines.map((item, index) => (
            //             <button
            //                 key={index}
            //                 className="list-group-item list-group-item-action"
            //                 onClick={() => onItemClick(item)}>
            //                 {item.medicine_name}
            //             </button>
            //         ))}
            //     </div>
            // )}
            // </div>
    );
};