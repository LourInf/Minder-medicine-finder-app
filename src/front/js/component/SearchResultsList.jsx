import React from "react";
import "../../styles/searchResultsList.css"

export const SearchResultsList = ({ items, displayItem, onItemClick }) => {

    return (
        <div className="search-results-list">
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
    );
};