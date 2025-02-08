import React, { useMemo, useEffect, useState } from 'react'

import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar, GridRowModes, GridActionsCellItem, GridRowEditStopReasons, } from "@mui/x-data-grid";
import { tokens } from '../theme';
//import dlgData from '/Users/user/OneDrive/Desktop/DB project 2/DB project/server/newdlgData.json';
import Axios from 'axios';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';


export default function FullFeaturedCrudGrid() {
 
  const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
   
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await Axios.get('http://localhost:3000/delegates');
          
          setRows(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
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

    const handleDeleteClick = (id) => async () => {
      try {
        setRows((prevRows) => prevRows.filter((row) => row.dlgID !== id));
        
        await Axios.delete(`http://localhost:3000/delegates/${id}`);
    
        console.log(`Delegate with ID ${id} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting delegate with ID ${id}:`, error);
        setRows((prevRows) => [...prevRows]);
      }
    };     
  
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
      setRows(rows.map((row) => (row.dlgID === newRow.dlgID ? updatedRow : row)));
      await Axios.put(`http://localhost:3000/delegates/${newRow.dlgID}`, updatedRow)
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
      return updatedRow;
    };
  
    const handleRowModesModelChange = (newRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //const [rowId, setRowId] = useState(null)

  const columns = useMemo( () => [
    { field: "dlgID", headerName: "Delegate ID" },
    { field: "fName", headerName: "First Name" },
    { field: "lName", headerName: "Last Name", flex: 1, cellClassName: "name-column--cell", editable: true },
    { field: "dlgNB", headerName: "Phone Number", flex: 1, editable: true },
    { field: "dlgEmail", headerName: "Email Address", flex: 1, editable: true },
    { field: "dlgSchool", headerName: "School Name", flex: 1, editable: true },
    // { field: "dlgPin", headerName: "PIN", flex: 1, editable: true },
    // { field: "dlgClass", headerName: "Room", flex: 1, editable: true },
    { field: "dlgPGM", headerName: "Program of Interest", flex: 1, editable: true },
    { field: "level", headerName: "HS/MS", flex: 1, editable: true },
    { field: "lang", headerName: "Language", flex: 1, editable: true },
    { field: "dlgCampus", headerName: "Campus", flex: 1, editable: true },
    { field: "dlgAdv", headerName: "Advisor's ID", flex: 1, editable: true },
    { field: "tsClass", headerName: "TS Class", flex:1, editable:true },
    { field: "attendanceTS1", headerName: "TS1 Attendance", flex:1, editable:true },
    { field: "attendanceTS2", headerName: "TS2 Attendance", flex:1, editable:true },
    { field: "mcCommittee", headerName: "MC Committee", flex:1, editable:false },
    // { field: "mcCountry", headerName: "MC Country", flex:1, editable:false },
    { field: "mcAttendance", headerName: "MC Attendance", flex:1, editable:true },
    { field: "fcCommittee", headerName: "FC Committee", flex:1, editable:false },
   
    { field: "fcAttendance", headerName: "FC Attendance", flex:1, editable:true },
    { field: "countryRep", headerName: "Representation", flex:1, editable:false },
    // { field: "school", headerName: "Access Level", flex: 1, 
    // renderCell: ({ row: {school} }) =>{
    //   return(
    //     <Box
    //       width="60%"
    //       m="0 auto"
    //       p="5px"
    //       display="flex"
    //       justifyContent="center"
    //       backgroundColor={
    //         school === "admin" ? colors.greenAccent[600] : colors.greenAccent[700]
    //       }
    //       borderRadius="4px"
    //     >
    //       { school === "admin" && < AdminPanelSettingsOutlinedIcon />}
    //       { school === "manager" && < SecurityOutlinedIcon />}
    //       { school === "user" && < LockOpenOutlinedIcon />}
    //       <Typography color={colors.grey[100]} sx={{ ml:"5px" }}>
    //         {school}
    //       </Typography>
    //     </Box>
    //   )
    // } },
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
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    //{ field: 'action', headerName: 'Actions', type: 'actions', renderCell: (params) => ( <UserActions {...{params, rowId, setRowId}} /> ), },
    // [rowId] 
  ],
    //[rowId]
  );
  

  return (
    <Box>
      <h2 className="page-header">Delegates</h2>
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
          getRowId={(row) => row.dlgID}
          components={{ Toolbar: GridToolbar }}
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
                // dlgID: false,
                lang: false,
                dlgEmail: false,
                level: false,
                dlgNB: false,
                dlgID: false,
                tsclass: false,
                attendanceTS1: false,
                attendanceTS2: false,
                mcCommittee: false,
                // mcCountry: false,
                mcAttendance: false,
                fcCommittee: false,
                // fcCountry: false,
                fcAttendance: false,
                countryRep: false,
         

          
              },
            },
            pagination: {
              paginationModel: {
                pageSize: 25,
              }
            },
          }}
          //onCellEditStop={(params) => setRowId(params.id)}
        />
      </Box>
    </Box>
  )
}

