import * as React from "react"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"
import { Tag as TagType } from "@/types";



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