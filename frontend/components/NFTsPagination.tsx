import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFilters } from '@/context/FilterContext';
import { useMediaQueries } from '@/hooks/useMediaQuery';



interface NFTsPaginationProps {
    n_pages: number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onFetchMore: () => void;
}


export default function NFTsPagination({n_pages, onChange, onFetchMore}: NFTsPaginationProps) {
    const [pagesToShow, setPagesToShow] = useState<number>(0);
    const [text, setText] = useState<boolean>(true);
    const {page, setPage} = useFilters();

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()


    const screenSize = useMediaQueries()

    useEffect(() => {
        // Update the state variable based on screen size
        if (screenSize === 'small') {
            setPagesToShow(1);
            setText(false);
        }
        else {
            setPagesToShow(5);
            setText(true);
        }
    }, [screenSize]);


    const handlePrevious = () => {
        if (page > 1) {
            setPage(page - 1);
            onFetchMore();
        }
    };
    
    const handleNext = () => {
        if (page < n_pages) {
            setPage(page + 1);
            onFetchMore();
        }
    };
    
    const handlePageChange = (page: number) => {
        setPage(page);
        onFetchMore();
    };

    const createQueryString = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        return params.toString();
    };

    
    
    // Generate pagination items
    const renderPaginationItems = () => {
        const items = [];

        // Add previous button if not on the first page
        if (page > 1) {
            items.push(
                <PaginationItem key="prev">
                    <PaginationPrevious href={`${pathname}?${createQueryString('page', (page - 1).toString())}`} onClick={handlePrevious} text={text} />
                </PaginationItem>
            );
        }

        // Determine range of pages to show
        let startPage = 1;
        let endPage = n_pages;
    
        if (n_pages > 7) {
            if (page <= 4) {
                endPage = 5;
            } else if (page + 3 >= n_pages) {
                startPage = n_pages - 4;
            } else {
                startPage = page - 2;
                endPage = page + 2;
            }
            if (page <= Math.ceil(pagesToShow / 2)) {
                endPage = pagesToShow;
            } else if (page + Math.floor(pagesToShow / 2) >= n_pages) {
                startPage = n_pages - pagesToShow + 1;
            } else {
                startPage = page - Math.floor(pagesToShow / 2);
                endPage = page + Math.floor(pagesToShow / 2);
            }

            if (startPage > 1) {
                items.push(
                    <PaginationItem key="1">
                        <PaginationLink
                            href={`${pathname}?${createQueryString('page', '1')}`}
                            isActive={page === 1}
                            onClick={() => handlePageChange(1)}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>
                );
                if (startPage > 2) {
                    items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                    );
                }
            }

            for (let page = startPage; page <= endPage; page++) {
                items.push(
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={`${pathname}?${createQueryString('page', page.toString())}`}
                            isActive={page === page}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (endPage < n_pages - 1) {
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            if (endPage < n_pages) {
                items.push(
                    <PaginationItem key={n_pages}>
                        <PaginationLink
                            href={`${pathname}?${createQueryString('page', n_pages.toString())}`}
                            isActive={page === n_pages}
                            onClick={() => handlePageChange(n_pages)}
                        >
                            {n_pages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } 
        else {
            for (let page = 1; page <= n_pages; page++) {
                items.push(
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={`${pathname}?${createQueryString('page', page.toString())}`}
                            isActive={page === page}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }
    
        // Add next button if not on the last page
        if (page < n_pages) {
            items.push(
                <PaginationItem key="next">
                <PaginationNext href={`${pathname}?${createQueryString('page', (page + 1).toString())}`} onClick={handleNext} text={text} />
                </PaginationItem>
            );
        }
        
    
        return items;
    };


    return (
        <div className="nfts-pagination">
            <Pagination>
                <PaginationContent>
                    {renderPaginationItems()}
                </PaginationContent>
            </Pagination>
        </div>
    )
}