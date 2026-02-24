//Apptwo.js
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
//import "./Apptwo.css"
const config = require('./ApiConfig');

function AddUserForm() {
  const [empno, setempno] = useState('');
  const [ename, setename] = useState('');
  const [job, setjob] = useState('');    
  const [mgr, setmgr] = useState('');
  const [hiredate, sethiredate] = useState('');
  const [salary, setSalary] = useState('');
  const [comm, setcomm] = useState('');
  const [deptno, setdeptno] = useState('');

  const handleInsert = async () => {
    if (!empno || !ename || !job || !mgr || !hiredate || !salary || !deptno) {
      alert("Please fill in all fields before inserting data.");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ empno, ename, job, mgr, hiredate, salary, comm, deptno }),
      });

      if (response.status === 201) {
        console.log('Data inserted successfully');
        // Optionally, you can update the data displayed on the page after insertion
      } else {
        console.error('Failed to insert data');
      }
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  return (
    <div className="theform">
      <form align="left">
        <label>
          Emp No:
          <input type="number" name="empno" value={empno} onChange={(e) => setempno(e.target.value)} />
        </label>
        <label>
          Name:
          <input type="text" name="ename" value={ename} onChange={(e) => setename(e.target.value)} />
        </label>
        <label>
          Job:
          <input type="text" name="job" value={job} onChange={(e) => setjob(e.target.value)} />
        </label>
        <label>
          Manager no:
          <input type="number" name="mgr" value={mgr} onChange={(e) => setmgr(e.target.value)} />
        </label>
        <label>
          Hire Date:
          <input type="date" name="hiredate" value={hiredate} onChange={(e) => sethiredate(e.target.value)} />
        </label>
        <label>
          Salary:
          <input type="number" name="salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
        </label>
        <label>
          Commission:
          <input type="number" name="comm" value={comm} onChange={(e) => setcomm(e.target.value)} />
        </label>
        <label>
          Dept No:
          <input type="number" name="deptno" value={deptno} onChange={(e) => setdeptno(e.target.value)} />
        </label>
        <br />
        <button onClick={handleInsert}>Insert Data</button>
      </form>
    </div>
  );
}

function Apptwo() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editedData, setEditedData] = useState([]);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (startRow, endRow) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}?startRow=${startRow}&endRow=${endRow}`);
      const jsonData = await response.json();
      setRowData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columnDefs = [
   // { headerCheckboxSelection:false, checkboxSelection: true },
    { headerName: "New Emp No", field: "empno", editable: true ,  checkboxSelection: true},
    { headerName: "E'Name", field: "ename", editable: true },
    { headerName: "JOB", field: "job", editable: true },
    { headerName: "Manager Number", field: "mgr", editable: true },
   // { headerName: "Hire_Date", field: "hiredate", editable: true },
    { headerName: "SALARY", field: "salary", editable: true },
    { headerName: "Commission", field: "comm", editable: true },
    { headerName: "Dept No", field: "deptno", editable: true },
  ];

  const defaultColDef = {
    sortable: true,
    editable: true,
    flex: 1,
    filter: true,
    floatingFilter: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const exportClick = () => {
    gridApi.exportDataAsExcel();
  };

const onCellValueChanged = (params) => {
  const updatedRowData = [...rowData];
  const rowIndex = updatedRowData.findIndex((row) => row.empno === params.data.empno);
  if (rowIndex !== -1) {
    updatedRowData[rowIndex][params.colDef.field] = params.newValue;
    setRowData(updatedRowData);

    // Add the edited row data to the state
    setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
  }
};

const saveEditedData = async () => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/UpdExpensesDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ editedData }),
    });

    if (response.status === 200) {
      console.log("Data saved successfully!");
    } else {
      console.error("Failed to save data");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      alert("Please select at least one row to delete.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete the selected rows?");
    if (!confirmDelete) {
      return;
    }

    const empnosToDelete = selectedRows.map((row) => row.empno);

    try {
      const response = await fetch(`${config.apiBaseUrl}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empnos: empnosToDelete }),
      });

      if (response.status === 200) {
        console.log("Rows deleted successfully:", empnosToDelete);
        fetchData(); // Fetch updated data after deletion
      } else {
        console.error("Failed to delete rows");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
    }
  };

  const onPaginationPageRequested = (params) => {
    const startRow = params.startRow;
    const endRow = params.endRow;

    // Fetch data for the requested page
    fetchData(startRow, endRow);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 350, width: "100%" }}>
      <h1>TRANSACTIONs</h1>
      <div align="right">
        <button onClick={() => setShowAddUserForm(true)}>ADD USER</button>
        <button onClick={deleteSelectedRows}>DELETE SELECTED</button>
        <button onClick={() => exportClick()}>EXPORT</button>
      </div>
      {showAddUserForm && <AddUserForm />}
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
       onCellValueChanged={onCellValueChanged}
        pagination={true}
        paginationPageSize={5}
        onPaginationPageRequested={onPaginationPageRequested}
        rowSelection="multiple" 
       
      />
        <div align="center">
       <button onClick={saveEditedData}>SAVE</button>
       </div>
    </div>
  );
}

export default Apptwo;

/*
  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex((row) => row.empno === params.data.empno);
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      saveDataToServer(updatedRowData[rowIndex]);
    }
  };

  const saveDataToServer = async (updatedRow) => {
    try {
      const response = await fetch("http://localhost:5500/up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRow),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
*/