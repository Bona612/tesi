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
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
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
import { TagFilter } from "./TagFilter";
import { OrderByFilter } from "./OrderByFilter";
import { FloatingButton } from "./FloatingButton";
import { OrderDirectionFilter } from "./OrderDirectionFilter";
import { useFilters } from "@/context/FilterContext";



type TagFilterProps = {
    isDesktop: boolean,
};


export function Filters({isDesktop}: TagFilterProps) {
    // const [open, setOpen] = React.useState(false)
    const { tags, setTags } = useFilters();
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);


    const updateTags = (tag: Tag) => {
        const newTags = tags.includes(tag)
            ? tags.filter((t) => t !== tag)
            : [...tags, tag];
        
        return newTags;
    }

    const handleOnClick = (tag: Tag) => {
        setTags(updateTags(tag));
    };


    useEffect(() => {
        console.log("isDrawerOpen: ", isDrawerOpen);
    }, [isDrawerOpen])

    function handleDrawerOpen() {
        setIsDrawerOpen(true);
    }

    function handleDrawerClose() {
        setIsDrawerOpen(false);
    }
    


    if (isDesktop) {
        return (
            <div className="flex">
                <TagFilter />
                <OrderByFilter />
                <OrderDirectionFilter />
            </div>
        )
    }


    return (
        <div>
            <Drawer onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild onClick={handleDrawerOpen}>
                    <FloatingButton className={cn(isDrawerOpen ? 'hidden' : '')}>Filters</FloatingButton>
                </DrawerTrigger>
                <DrawerContent>
                    <div>
                        <DrawerHeader>
                            <DrawerTitle>Filters</DrawerTitle>
                            {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
                        </DrawerHeader>
                        <div className="mt-4 border-t">
                            <TagFilter />
                            {/* <StatusList tags={tags} handleOnClick={handleOnClick} /> */}
                            <OrderByFilter />
                            <OrderDirectionFilter />
                        </div>
                        <DrawerFooter>
                            <DrawerClose asChild onClick={handleDrawerClose}>
                                <Button>Save</Button>
                            </DrawerClose>
                            <DrawerClose asChild onClick={handleDrawerClose}>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
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