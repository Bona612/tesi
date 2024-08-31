// import { OrderBy, OrderDirection, OrderDirectionEnum, Tag } from '@/types';
// import React, { createContext, useState, useContext, ReactNode } from 'react';

// interface CreationContextType {
//   tags: Tag[],
//   setTags: (tags: Tag[]) => void,
// }

// const CreationContext = createContext<CreationContextType | undefined>(undefined);

// export const CreationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [tags, setTags] = useState<Tag[]>([]);

//   const value = {
//     tags,
//     setTags,
//   };

//   return <CreationContext.Provider value={value}>{children}</CreationContext.Provider>;
// };

// export const useFilters = () => {
//   const context = useContext(CreationContext);
//   if (!context) {
//     throw new Error('useFilters must be used within a FilterProvider');
//   }
//   return context;
// };
