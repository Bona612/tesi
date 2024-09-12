"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { useFilters } from "@/context/FilterContext";
import { OrderBy, OrderDirection, OrderDirectionEnum, Tag } from "@/types";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';



export function OrderDirectionFilter() {
    // const [isDescending, setIsDescending] = useState<boolean>(true);

    const { orderDirection, setOrderDirection } = useFilters();

    const handleOnClick = () => {
        setOrderDirection(orderDirection ? OrderDirectionEnum.asc : OrderDirectionEnum.desc);
    };

    return (
        <div className="px-2 flex-shrink">
            <Button variant="outline" size="icon" onClick={handleOnClick}>
                {orderDirection ? (
                    <ChevronDown className="h-4 w-4" />
                ) : (
                    <ChevronUp className="h-4 w-4" />
                )}
            </Button>
        </div> 
    );
}
