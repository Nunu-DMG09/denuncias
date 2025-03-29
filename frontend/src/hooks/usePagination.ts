import { useState } from "react";

export const usePagination = <T>(items: T[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const handleCurrentPage = (action: "next" | "prev") => {
        if (action === "next" && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        } else if (action === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const getVisiblePageNumbers = (): number[] => {
        return Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (currentPage <= 3) {
                pageNum = i + 1;
            }
            else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
            }
            else {
                pageNum = currentPage - 2 + i;
            }
            if (pageNum <= 0 || pageNum > totalPages) {
                return currentPage;
            }
            return pageNum;
        }).filter((value, index, self) => self.indexOf(value) === index); // Eliminar duplicados
    };
    const paginatedItems = items.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    return {
        paginatedItems,
        currentPage,
        totalPages,
        handleCurrentPage,
        handlePageChange,
        getVisiblePageNumbers,
    };
}