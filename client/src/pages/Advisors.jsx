import * as React from 'react';
import { useState, useEffect } from 'react';

import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar, GridRowModes, GridActionsCellItem, GridRowEditStopReasons, } from "@mui/x-data-grid";
import { tokens } from '../theme';
// import { mockDataAdv } from '../data/mockData';
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
          const response = await Axios.get('http://localhost:3000/advisors');
          
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
        setRows((prevRows) => prevRows.filter((row) => row.advID !== id));
        
        await Axios.delete(`http://localhost:3000/advisors/${id}`);
    
        console.log(`Advisor with ID ${id} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting advisor with ID ${id}:`, error);
        setRows((prevRows) => [...prevRows]);
      }
    };
  
    const handleCancelClick = (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
  
      const editedRow = rows.find((row) => row.advID === id);
      if (editedRow.isNew) {
        setRows(rows.filter((row) => row.advID !== id));
      }
    };
  
    const processRowUpdate = async (newRow) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.advID === newRow.advID ? updatedRow : row)));
      await Axios.put(`http://localhost:3000/advisors/${newRow.advID}`, updatedRow)
      .then((response) => {
        // Handle the response if needed
        console.log('Update successful:', response.data);
      })
      .catch((error) => {
        console.error('Error updating advisor:', error);
        // Optionally, revert the local state if the server update fails
        setRows((prevRows) =>
          prevRows.map((row) => (row.advID === newRow.advID ? newRow : row))
        );
      });
      return updatedRow;
    };
  
    const handleRowModesModelChange = (newRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "advID", headerName: "Advisor ID" },
    { field: "fName", headerName: "First Name", editable: true },
    { field: "lName", headerName: "Last Name", flex: 1, cellClassName: "name-column--cell", editable: true },
    { field: "advNB", headerName: "Phone Number", flex: 1, editable: true },
    { field: "advEmail", headerName: "Email Address", flex: 1, editable: true },
    { field: "advSchool", headerName: "School Name", flex: 1, editable: true },
    { field: "mainAdv", headerName: "Main Advisor", flex: 1, editable: true },
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
  ];

  return (
    <Box>
      <h2 className="page-header">Advisors</h2>
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
          getRowId={(row) => row.advID}
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
                advID: false,
              },
            },
            pagination: {
              paginationModel: {
                pageSize: 25,
              }
            },
          }}
        />
      </Box>
    </Box>
  )
}
