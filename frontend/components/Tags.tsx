

// PROBABILMENTE DA LEVARE


// import * as React from 'react';
// import Chip from '@mui/material/Chip';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';
// import Stack from '@mui/material/Stack';
// import Checkbox from '@mui/material/Checkbox';
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';



// const tagsArrayTitle: string[] = [
//     'The Godfather',
//     'Pulp Fiction'
// ];




// // export default function Tags() {
// //   return (
// //     // <Stack spacing={3} sx={{ width: 500 }}>
// //       <Autocomplete
// //         multiple
// //         id="tags-standard"
// //         options={tagsArray}
// //         getOptionLabel={(option) => option.title}
// //         defaultValue={[]}
// //         renderInput={(params) => (
// //           <TextField
// //             {...params}
// //             variant="standard"
// //             label="Multiple values"
// //             placeholder="Favorites"
// //           />
// //         )}
// //       />
// //     // </Stack>
// //   )
// // }

// interface Tag {
//     title: string;
//     id: number;
// }
// const tagsArray: Tag[] = [
//     { title: 'The Godfather', id: 1 },
//     { title: 'Pulp Fiction', id: 2 },
// ];

// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;

// async function getTagsTitles(option: Tag): Promise<string> {
//     'use server';
//     return option.title;
// }

// async function createInvoiceSync(option: Tag): string {
//     'use server'
//     function getPromiseResultSync<T>(promise: Promise<T>): T {
//         let result: T;
//         let error: any;
//         let done = false;
      
//         promise.then((res) => {
//           result = res;
//           done = true;
//         }).catch((err) => {
//           error = err;
//           done = true;
//         });
      
//         // Busy-wait loop
//         while (!done) {
//           require('deasync').runLoopOnce();
//         }
      
//         if (error) {
//           throw error;
//         }
      
//         return result!;
//     }

//     let result = "";
//     try {
//         const result = getPromiseResultSync(getTagsTitles(option));
//         console.log(result); // "Hello, world!"
//       } catch (error) {
//         console.error("An error occurred:", error);
//       }

//     // // Call the asynchronous function synchronously
//     // const result = await getTagsTitles(option).then((result) => {
//     //     return result;
//     // });
//     return result;
// }





// export default function BasicChips() {
//   return (
//     <Stack direction="row" spacing={1}>
//       <Chip label="Chip Filled" />
//       <Chip label="Chip Outlined" variant="outlined" />
//     </Stack>
//   );
// }



// export default function Tags() {
//   return (
//     <Autocomplete
//       multiple
//       id="checkboxes-tags-demo"
//       options={tagsArray}
//       disableCloseOnSelect
//       getOptionLabel={async (option) => {
//         'use server';
//         return option.title;
//       }}
//       renderOption={(props, option, { selected }) => (
//         <li {...props}>
//           <Checkbox
//             icon={icon}
//             checkedIcon={checkedIcon}
//             style={{ marginRight: 8 }}
//             checked={selected}
//           />
//           {option.title}
//         </li>
//       )}
//       style={{ width: 500 }}
//       renderInput={(params) => (
//         <TextField {...params} label="Checkboxes" placeholder="Favorites" />
//       )}
//     />
//   );
// }