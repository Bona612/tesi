import { Box, Chip } from '@mui/material';
import { Tag } from '@/components/Tag';
import { Tag as TagType, TAGS } from "@/types";
import { useFilters } from '@/context/FilterContext';


type TagListProps = {
  tagList?: TagType[];
  handleOnClick?: (tag: TagType) => void;
  readonly?: boolean;
};


/// PROBABILMENTE SERVE PER TUTTI I CASI IN CUI I TAG SONO CLICCABILI
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
        // <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
        //   {tagList.map((tag, index) => (
        //     <Chip key={index} label={tag} color="primary" clickable={false} />
        //   ))}
        // </Box>
        <>
          {tags.map((tag, index) => (
            <Tag key={index} tag={tag} handleOnClick={handleOnClick} readonly={readonly} />
          ))}
        </>
    );
};

export default TagListWithContext;