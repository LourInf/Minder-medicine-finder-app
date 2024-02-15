import React from "react";
import { Pagination } from 'react-bootstrap';

const MAX_PAGES_DISPLAYED = 5; // Maximum number of pages displayed around the current page

export const CustomPagination = ({ totalPages, currentPage, onPageChange }) => {
  const firstPage = 1;
  const lastPage = totalPages;

  let startPage = Math.max(firstPage, currentPage - Math.floor(MAX_PAGES_DISPLAYED / 2));
  let endPage = Math.min(lastPage, startPage + MAX_PAGES_DISPLAYED - 1);

  // Adjust the start and end page if near the beginning or end
  if (currentPage < MAX_PAGES_DISPLAYED) {
    startPage = 1;
    endPage = Math.min(lastPage, MAX_PAGES_DISPLAYED);
  } else if (currentPage > lastPage - MAX_PAGES_DISPLAYED) {
    startPage = Math.max(firstPage, lastPage - MAX_PAGES_DISPLAYED + 1);
    endPage = lastPage;
  }

  const paginationItems = [];

  // Add the first page only if it's not included in the main range
  if (startPage > firstPage) {
    paginationItems.push(
      <Pagination.Item key="first" active={currentPage === firstPage} onClick={() => onPageChange(firstPage)}>
        {firstPage}
      </Pagination.Item>
    );

    // Ellipsis after the first page if necessary
    paginationItems.push(<Pagination.Ellipsis key="ellipsisStart" />);
  }

  // Page numbers
  for (let page = startPage; page <= endPage; page++) {
    paginationItems.push(
      <Pagination.Item key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
        {page}
      </Pagination.Item>
    );
  }

  // Ellipsis before the last page if necessary
  if (endPage < lastPage) {
    paginationItems.push(<Pagination.Ellipsis key="ellipsisEnd" />);
    
    // Add the last page only if it's not included in the main range
    paginationItems.push(
      <Pagination.Item key="last" active={currentPage === lastPage} onClick={() => onPageChange(lastPage)}>
        {lastPage}
      </Pagination.Item>
    );
  }

  return <Pagination className="justify-content-center">{paginationItems}</Pagination>;
};
