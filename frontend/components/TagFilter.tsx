"use client";

import React, { useRef }  from "react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tag, TAGS } from "@/types";
import { cn } from "@/lib/utils";
import { useFilters } from "@/context/FilterContext";



type TagFilterProps = {
    handleOnClick?: (tag: Tag) => void;
};


export function TagFilter({}: TagFilterProps) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

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
}

function StatusList({
    tags,
    handleOnClick
}: {
    tags: Tag[],
    handleOnClick: (tag: Tag) => void
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