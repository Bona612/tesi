"use client";

import React, { useContext, useRef, useEffect, useState, useCallback }  from "react";
import { Tag } from "./tag";
import { Badge } from "@/components/ui/badge";
// import { RecipeContext } from "@/context/recipe-context";

export default function TagsFilter() {
    const [visibleTags, setVisibleTags] = useState<string[]>([]);
    // const { dispatch } = useContext(RecipeContext);
    const tags: Array<string> = [
        "Tag1",
        "Tag2",
        "Tag3",
        "Tag4",
        "Tag5",
        "Tag6",
        "Tag7",
        "Tag8",
        "Tag9",
        "Tag10",
        "Tag11",
        "Tag12",
        "Tag13",
        "Tag14",
        "Tag15",
        "Tag16",
        "Tag17",
        "Tag18",
        "Tag19",
        "Tag20",
        "Tag21",
        "Tag22",
        "Tag23",
        "Tag24",
        "Tag25",
        "Tag26",
        "Tag27",
        "Tag28",
        "Tag29",
        "Tag30",
    ];
    const loadMoreThreshold = 50; // Threshold in pixels before loading more tags


    const containerRef = useRef<HTMLDivElement>(null);
    let startX = 0;
    let startScrollLeft = 0;
    let isDragging = false;
    

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        isDragging = true;
        startX = e.pageX - containerRef.current!.offsetLeft;
        startScrollLeft = containerRef.current!.scrollLeft;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current!.offsetLeft;
        const walk = (x - startX); // Adjust sensitivity as needed
        containerRef.current!.scrollLeft = startScrollLeft - walk;
    };

    const handleMouseUp = () => {
        isDragging = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
        startX = e.touches[0].pageX - containerRef.current!.offsetLeft;
        startScrollLeft = containerRef.current!.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
        const x = e.touches[0].pageX - containerRef.current!.offsetLeft;
        const walk = (x - startX); // Adjust sensitivity as needed
        containerRef.current!.scrollLeft = startScrollLeft - walk;
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("mousedown", handleMouseDown);
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseup", handleMouseUp);

        return () => {
            container.removeEventListener("mousedown", handleMouseDown);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("touchstart", handleTouchStart);
        container.addEventListener("touchmove", handleTouchMove);

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    useEffect(() => {
        // Function to handle scroll event
        const handleScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            // Calculate whether user has scrolled to the end
            const scrolledToEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - loadMoreThreshold;
            // console.log(container.scrollLeft + container.clientWidth)
            // console.log(container.scrollWidth)

            // console.log("pre-if: ")
            // console.log(scrolledToEnd)
            // console.log(visibleTags.length)
            // console.log("<")
            // console.log(tags.length)
            // Load more tags if scrolled to the end and there are more tags to load
            if (scrolledToEnd && visibleTags.length < tags.length) {
                console.log("loaded")
                const remainingTags = tags.slice(visibleTags.length, visibleTags.length + 5); // Load 5 tags at a time
                setVisibleTags(prevTags => [...prevTags, ...remainingTags]);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [visibleTags, tags]);

    // Initially load first 15 tags
    useEffect(() => {
        setVisibleTags(tags.slice(0, 15));
    }, []);


    const handleOnClick = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        tag: string
    ) => {
        e.preventDefault();
        // dispatch({
        //   type: "SELECTED_TAG",
        //   payload: {
        //     selectedTag: tag,
        //   },
        // });
    };


    return (
        <div ref={containerRef} className="flex overflow-x-auto whitespace-nowrap hide-scrollbar">
            {visibleTags.map((tag, idx) => (
                <Tag
                key={`${tag}-${idx}`}
                variant={"outline"}
                className="border-orange-800 text-gray-900 text-lg mx-2 my-1 hover:cursor-pointer bg-orange-50 hover:scale-110 ease-in duration-200"
                onClick={(e) => handleOnClick(e, tag)}
                >
                {tag}
                </Tag>
            ))}
        </div>
    );
}