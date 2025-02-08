import React, {  useMemo, useEffect, useState } from 'react'

import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar, GridRowModes, GridActionsCellItem, GridRowEditStopReasons, } from "@mui/x-data-grid";
import { tokens } from '../theme';
// import { mockDataBeirutTs1 } from '../data/mockData';
import Axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Attendance from '../pages/Attendance';

const Sessions = ({ classValue, tsValue, campusValue, mcValue, fcValue }) => {

    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
  
    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const response = await Axios.get('http://localhost:3000/beiruttxt');
         
    //       setRows(response.data);
    //       console.log('Fetched Data:', response.data);
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //     }
    //   };
  
    //   fetchData();
    // }, []);      

    

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Simulating data fetching
          if(tsValue === 'ts1'){
            const response = await Axios.get(`http://localhost:3000/beiruttxt/${classValue}/${campusValue}/delegates1`);
            // const response = { data: [{ dlgID: 1, fName: 'John', lName: 'Doe', attendanceTS1: true },
            //  {  dlgID: 2, fName: 'Jane', lName: 'Doe', attendanceTS1: false },
            //  { dlgID: 3, fName: 'hiba', lName: 'Doe', attendanceTS1: false }] };
            // setRows(prevRows => {
              // Use a Set to keep track of unique IDs
              // const idSet = new Set(prevRows.map(row => row.dlgID));
              // // Filter out rows with IDs already present
              // const newRows = response.data.filter(row => !idSet.has(row.dlgID));
              // Concatenate new rows with existing rows
              // return [...prevRows, ...newRows];});
            setRows(response.data);
            console.log('Fetched Data:', response.data);
          } else if(tsValue === 'ts2'){
            const response = await Axios.get(`http://localhost:3000/beiruttxt/${classValue}/${campusValue}/delegates2`);
            setRows(response.data);
            console.log('Fetched Data:', response.data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [classValue, campusValue]);
    
    const handleRowEditStop = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
      }
    };
  
    const handleEditClick = (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
  
    const handleSaveClick = (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
  
    // const handleDeleteClick = (id) => () => {
    //   setRows(rows.filter((row) => row.dlgID !== id));
    // };
  
    const handleCancelClick = (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
  
      const editedRow = rows.find((row) => row.dlgID === id);
      if (editedRow.isNew) {
        setRows(rows.filter((row) => row.dlgID !== id));
      }
    };
  
    const processRowUpdate = async (newRow) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.fName === newRow.fName ? updatedRow : row)));
      if(tsValue === 'ts1'){
        await Axios.put(`http://localhost:3000/beiruttxt/${newRow.fName}/${classValue}/${campusValue}/delegates1`, updatedRow)
        .then((response) => {
          // Handle the response if needed
          console.log('Update successful:', response.data);
        })
        .catch((error) => {
          console.error('Error updating delegate:', error);
          // Optionally, revert the local state if the server update fails
          setRows((prevRows) =>
            prevRows.map((row) => (row.fName === newRow.fName ? newRow : row))
          );
        });
      } else if(tsValue === 'ts2'){
        await Axios.put(`http://localhost:3000/beiruttxt/${newRow.fName}/${classValue}/${campusValue}/delegates2`, updatedRow)
        .then((response) => {
          // Handle the response if needed
          console.log('Update successful:', response.data);
        })
        .catch((error) => {
          console.error('Error updating delegate:', error);
          // Optionally, revert the local state if the server update fails
          setRows((prevRows) =>
            prevRows.map((row) => (row.dlgID === newRow.dlgID ? newRow : row))
          );
        });
      } 
      // } else if(mcValue === 'mc'){
      //   await Axios.put(`http://localhost:3000/beiruttxt/${classValue}/delegates3`, updatedRow)
      //   .then((response) => {
      //     // Handle the response if needed
      //     console.log('Update successful:', response.data);
      //   })
      //   .catch((error) => {
      //     console.error('Error updating delegate:', error);
      //     // Optionally, revert the local state if the server update fails
      //     setRows((prevRows) =>
      //       prevRows.map((row) => (row.dlgID === newRow.dlgID ? newRow : row))
      //     );
      //   });
      // } else if(fcValue === 'fc'){
      //   await Axios.put(`http://localhost:3000/beiruttxt/${classValue}/delegates3`, updatedRow)
      //   .then((response) => {
      //     // Handle the response if needed
      //     console.log('Update successful:', response.data);
      //   })
      //   .catch((error) => {
      //     console.error('Error updating delegate:', error);
      //     // Optionally, revert the local state if the server update fails
      //     setRows((prevRows) =>
      //       prevRows.map((row) => (row.dlgID === newRow.dlgID ? newRow : row))
      //     );
      //   });
      // } 
      return updatedRow;
    };
  
    const handleRowModesModelChange = (newRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const columns = [
    // { field: "dlgID", headerName: "Delegate ID" },
    { field: "fName", headerName: "First Name", flex: 1 },
    { field: "lName", headerName: "Last Name", flex: 1, cellClassName: "name-column--cell", },
    { field: "attendanceTS1", headerName: "Attendance", flex: 1, type: "boolean", editable: true  },
    // { field: "pm", headerName: "No", flex: 1, type: "boolean", editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          // <GridActionsCellItem
          //   icon={<DeleteIcon />}
          //   label="Delete"
          //   onClick={handleDeleteClick(id)}
          //   color="inherit"
          // />,
        ];
      },
    },
  ]

  return (
    <Box>
      <h2 className="page-header"></h2>
      {/* <Header title="TEAM" subtitle="Managing the team members" /> */}
      <Box sx={{
        "& .MuiDataGrid-root":{
        border: "none",
        color: "var(--txt-color)"
        },
        "& .MuiDataGrid-columnHeaders":{
          backgroundColor: "var(--main-color)",
          color: "#ffff"
          },
        // "& .MuiDataGrid-columnHeaders":{
        //   color: "#edb119"
        //   },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text":{
          color: "var(--txt-color)"
          },
          "& .MuiDataGrid-booleanCell":{
            color: `var(--txt-color) !important`
          },
          "& .MuiTablePagination-root":{
            color: "var(--txt-color)"
          },
          "& .MuiSvgIcon-root":{
            color: "var(--txt-color)"
          }
      }}>
        <DataGrid 
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row)=> row.dlgID}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                // Hide columns id and age, the other columns will remain visible
              

              },
            },
            // pagination: {
            //   paginationModel: {
            //     pageSize: 5,
            //   }
            // },
          }}
        />
      </Box>
    </Box>
  )
}

export default Sessions
