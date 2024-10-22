import { Tag } from '@/components/Tag';
import { Tag as TagType, TAGS } from "@/types";
import { useFilters } from '@/context/FilterContext';


type TagListProps = {
  tags: TagType[];
  handleOnClick?: (tag: TagType) => void;
  readonly?: boolean;
};

const TagList: React.FC<TagListProps> = ({ tags, handleOnClick = undefined, readonly = false }: TagListProps) => {

    return (
        <>
          {tags.map((tag, index) => (
            <Tag key={index} tag={tag} readonly={readonly} />
          ))}
        </>
    );
};

export default TagList;