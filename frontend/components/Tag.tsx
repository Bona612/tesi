import * as React from "react"
import { Badge } from "@/components/ui/badge";
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Tag as TagType, TAGS } from "@/types";



type TagProps = {
  tag: TagType;
  handleOnClick?: (tag: TagType) => void;
  readonly?: boolean;
};

function Tag({tag, handleOnClick, readonly = false}: TagProps) {
  return (
    <Badge
      key={`${tag}`}
      variant={"outline"}
      // className="border-orange-800 text-gray-900 text-lg mx-2 my-1 hover:cursor-pointer bg-orange-50 hover:scale-110 ease-in duration-200"
      // onClick={(e) => handleOnClick(tag)}
      className={cn(
        "border-black-800 text-gray-900 text-lg mx-2 my-1 bg-white-50 ease-in duration-200",
        { "hover:cursor-pointer hover:scale-110": !readonly }
      )}
      onClick={readonly ? undefined : (e) => handleOnClick && handleOnClick(tag)}
    >
      {tag}
    </Badge>
  )
}

export { Tag }