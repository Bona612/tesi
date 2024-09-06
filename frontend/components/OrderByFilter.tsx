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
};

const orders: OrderBy[] = [
    {
        name: "name",
        label: "Name"
    }
];

export function OrderByFilter({}: OrderByFilterProps) {
  const [open, setOpen] = React.useState(false)
  const { orderBy, setOrderBy } = useFilters();

  
  return (
    <div className="px-2 flex-shrink">
      <Select open={open} onOpenChange={setOpen}>
          <SelectTrigger open={open} className="w-[180px]">
              <SelectValue placeholder={orderBy.label} />
          </SelectTrigger>
          <SelectContent>
              <SelectGroup>
                  <SelectLabel>Order by</SelectLabel>
                  {orders.map((order) => (
                    <SelectItem key={order.name} value={order.label} onSelect={(value) => {
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