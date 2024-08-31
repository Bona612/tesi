"use client"


import * as React from "react"

// import { useMediaQuery } from "@/hooks/use-media-query"
// import { Button } from "@/components/ui/button"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useFilters } from "@/context/FilterContext"
import { OrderBy } from "@/types"


type OrderByFilterProps = {
    // orders: OrderBy[],
    // handleOrderByChange: () => void,
};

const orders: OrderBy[] = [
    {
        by: "name",
        label: "Name"
    }
];

export function OrderByFilter({}: OrderByFilterProps) {
  const [open, setOpen] = React.useState(false)
  const { orderBy, setOrderBy } = useFilters();


  return (
    <div className="px-2 flex-shrink">
      <Select>
          <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Order by" />
          </SelectTrigger>
          <SelectContent>
              <SelectGroup>
                  <SelectLabel>Order by</SelectLabel>
                  {orders.map((order) => (
                    <SelectItem key={order.by} value={order.by} onSelect={(value) => {
                      setOrderBy(order)
                      setOpen(false)}}
                    >
                      {order.label}
                    </SelectItem>
                  ))}
              </SelectGroup>
          </SelectContent>
      </Select>
    </div>
  )
}