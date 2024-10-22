import { Tag } from '@/components/Tag';
import { Tag as TagType, TAGS } from "@/types";
import { useFilters } from '@/context/FilterContext';


type TagListProps = {
  tagList?: TagType[];
  handleOnClick?: (tag: TagType) => void;
  readonly?: boolean;
};


const TagListWithContext: React.FC<TagListProps> = ({ readonly = false }: TagListProps) => {
    const { tags, setTags } = useFilters();

    const updateTags = (tag: TagType) => {
      const newTags = tags.includes(tag)
          ? tags.filter((t) => t !== tag)
          : [...tags, tag];
      
      return newTags;
    }

    const handleOnClick = (tag: TagType) => {
        setTags(updateTags(tag));
    };


    return (
        <>
          {tags.map((tag, index) => (
            <Tag key={index} tag={tag} handleOnClick={handleOnClick} readonly={readonly} />
          ))}
        </>
    );
};

export default TagListWithContext;