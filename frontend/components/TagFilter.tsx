"use client";

import React, { useContext, useRef, useEffect, useState, useCallback }  from "react";
// import { Tag } from "@/components/Tag";
// import { RecipeContext } from "@/context/recipe-context";

import { useMediaQuery }from "@/hooks/useMediaQuery"
import { Button } from "@/components/ui/button"
import {
    Check
} from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// import { OPTIMIZED_FONT_PROVIDERS } from "next/dist/shared/lib/constants"
import { Tag, TAGS } from "@/types";
import { cn } from "@/lib/utils";
import { useFilters } from "@/context/FilterContext";



type TagFilterProps = {
    handleOnClick?: (tag: Tag) => void;
};


export function TagFilter({}: TagFilterProps) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    // const [selectedTags, setSelectedTags] = React.useState<Tag | null>(null)

    const containerRef = useRef<HTMLDivElement>(null);
    const { tags, setTags } = useFilters();

    const updateTags = (tag: Tag) => {
        const newTags = tags.includes(tag)
            ? tags.filter((t) => t !== tag)
            : [...tags, tag];
        
        return newTags;
    }

    const handleOnClick = (tag: Tag) => {
        setTags(updateTags(tag));
    };


    return (
        <div className="px-2 shrink">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto md:min-w-[150px] justify-start">
                        Tag
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full md:w-auto md:min-w-[200px] p-0" align="start">
                    <StatusList tags={tags} handleOnClick={handleOnClick} />
                </PopoverContent>
            </Popover>
        </div>
    )
    // if (isDesktop) {
    //     return (
    //         <div className="px-2 shrink">
    //             <Popover open={open} onOpenChange={setOpen}>
    //                 <PopoverTrigger asChild>
    //                     <Button variant="outline" className="w-full md:w-auto md:min-w-[150px] justify-start">
    //                         Tag
    //                     </Button>
    //                 </PopoverTrigger>
    //                 <PopoverContent className="w-full md:w-auto md:min-w-[200px] p-0" align="start">
    //                     <StatusList tags={tags} handleOnClick={handleOnClick} />
    //                 </PopoverContent>
    //             </Popover>
    //         </div>
    //     )
    // }

    // return (
    //     <div className="px-2 shrink">
    //         <Drawer open={open} onOpenChange={setOpen}>
    //             <DrawerTrigger asChild>
    //                 <Button variant="outline" className="w-[150px] justify-start">
    //                     Tag
    //                 </Button>
    //             </DrawerTrigger>
    //             <DrawerContent>
    //                 <div className="mt-4 border-t">
    //                     <StatusList tags={tags} handleOnClick={handleOnClick} />
    //                 </div>
    //             </DrawerContent>
    //         </Drawer>
    //     </div>
    // )
}

function StatusList({
    tags,
    handleOnClick,
    // setOpen,
    // setSelectedTags,
}: {
    tags: Tag[],
    handleOnClick: (tag: Tag) => void
    // setOpen: (open: boolean) => void
    // setSelectedTags: (tags: Tag | null) => void
}) {
    return (
        <Command>
            <CommandInput placeholder="Tag..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {TAGS.map((tag, idx) => (
                        <CommandItem
                            key={tag}
                            value={tag}
                            onSelect={(value) => {
                                handleOnClick(tag)
                                // setSelectedTags(
                                // tags.find((priority) => priority.name === value) || null
                                // )
                            }}
                        >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                tags.includes(tag)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {tag}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}