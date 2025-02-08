import React, { useState } from 'react'

import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar, GridRowModes, GridActionsCellItem, GridRowEditStopReasons, } from "@mui/x-data-grid";
import { tokens } from '../theme';
import { mockDataByblosTs1 } from '../data/mockData';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

export default function FullFeaturedCrudGrid() {

    const [rows, setRows] = useState(mockDataByblosTs1);
    const [rowModesModel, setRowModesModel] = useState({});
  
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
  
    const handleDeleteClick = (id) => () => {
      setRows(rows.filter((row) => row.id !== id));
    };
  
    const handleCancelClick = (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
  
      const editedRow = rows.find((row) => row.id === id);
      if (editedRow.isNew) {
        setRows(rows.filter((row) => row.id !== id));
      }
    };
  
    const processRowUpdate = (newRow) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    };
  
    const handleRowModesModelChange = (newRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell", },
    { field: "am", headerName: "AM", flex: 1, type: "boolean", editable: true  },
    { field: "pm", headerName: "PM", flex: 1, type: "boolean", editable: true },
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
  ]

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
                id: false,
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
