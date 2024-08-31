import { Box, Chip } from '@mui/material';
import { Tag } from '@/components/Tag';
import { Tag as TagType, TAGS } from "@/types";
import { useFilters } from '@/context/FilterContext';


type TagListProps = {
  tags: TagType[];
  handleOnClick?: (tag: TagType) => void;
  readonly?: boolean;
};

/// PROBABILMENTE SERVE SOLO PER READONLY
const TagList: React.FC<TagListProps> = ({ tags, handleOnClick = undefined, readonly = false }: TagListProps) => {

    return (
        // <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
        //   {tagList.map((tag, index) => (
        //     <Chip key={index} label={tag} color="primary" clickable={false} />
        //   ))}
        // </Box>
        <>
          {tags.map((tag, index) => (
            <Tag key={index} tag={tag} readonly={readonly} />
          ))}
        </>
    );
};

export default TagList;