

/// REPORT GENERATION IN A SINGLE CODE........................

import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload, faPrint, faListUl } from '@fortawesome/free-solid-svg-icons';
import moment from "moment";

import "bootstrap/dist/css/bootstrap.min.css";
const config = require('./ApiConfig');

function AddUserForm() {
  // Adding new expenses daily by add expense
  const [expenses_date, setexpenses_date] = useState("");
  const [expenses_type, setexpenses_type] = useState("");
  const [expenses_amount, setexpenses_amount] = useState("");
  const [expenses_spentby, setexpenses_spentby] = useState("");
  const [remarks, setremarks] = useState("");
  const [error, setError] = useState("");

  const handleInsert = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${config.apiBaseUrl}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expenses_date,
          expenses_type,
          expenses_amount,
          expenses_spentby,
          remarks,
        }),
      });
      if (response.status === 201) {
        console.log("Data inserted successfully");
        // Optionally, you can update the data displayed on the page after insertion
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error("Error:", errorResponse.error);
        // Set error message state to display in your UI
        setError(errorResponse.error);
      } else {
        console.error("Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  return (
    <div className="newaddform">
      {error && <div className="error">{error}</div>}
      <form align="left" onSubmit={handleInsert} noValidate>
        <label>
          Date:
          <input
            type="date"
            name="expenses_date"
            value={expenses_date}
            onChange={(e) => setexpenses_date(e.target.value)}
            autoComplete="off"
          />
        </label>

        <label>
          Type:
          <input
            type="text"
            name="expenses_type"
            value={expenses_type}
            onChange={(e) => setexpenses_type(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label>
          Amount Spent:
          <input
            type="number"
            name="expenses_amount"
            value={expenses_amount}
            onChange={(e) => setexpenses_amount(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label>
          Spent By:
          <input
            type="text"
            name="expenses_spentby"
            value={expenses_spentby}
            onChange={(e) => setexpenses_spentby(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label>
          Remarks:
          <input
            type="num"
            name="remarks"
            value={remarks}
            onChange={(e) => setremarks(e.target.value)}
            autoComplete="off"
          />
        </label>
        <br />
        <button onClick={handleInsert}>Insert Data</button>
      </form>
    </div>
  );
}


function App() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [showDateInputs, setShowDateInputs] = useState(false); // Ensure this line is included
  const [endDate, setEndDate] = useState("");

  const dateFilterParams = {
    applyButton: true,
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      var dateAsString = cellValue;
      if (!dateAsString) return -1; // Handle null or undefined dates 
      var cellDate = new Date(dateAsString);
      cellDate.setHours(0, 0, 0, 0);

      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
    },
    browserDatePicker: true,
  };

  const toggleDateInputs = () => {
    setShowDateInputs(!showDateInputs);
  };


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (startRow, endRow) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}?startRow=${startRow}&endRow=${endRow}`
      );
      const jsonData = await response.json();
      setRowData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columnDefs = [
    {
      headerName: "Date",
      field: "expenses_date",
      editable: true,
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
      cellRenderer: (data) => {
        return moment(data.value).format("YYYY-MM-DD");
      },
      maxWidth: 350,
      minWidth: 350,
      checkboxSelection: true,
    },
    {
      headerName: "Type",
      field: "expenses_type",
      editable: true,
      cellStyle: { textAlign: "center" },
      maxWidth: 400,
      minWidth: 400,
    },
    {
      headerName: "Amount Spent",
      field: "expenses_amount",
      editable: true,
      aggFunc: (params) => {
        let total = 0;
        params.values.forEach((value) => (total += value));
        return total;
      },
      cellStyle: { textAlign: "right" },
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      },
      maxWidth: 350,
      minWidth: 350,
    },
    {
      headerName: "Spent By",
      field: "expenses_spentby",
      editable: true,
      cellStyle: { textAlign: "right" },
      maxWidth: 350,
      minWidth: 350,
    },

    {
      headerName: "Remarks",
      field: "remarks",
      editable: true,
      cellStyle: { textAlign: "right" },
      maxWidth: 400,
      minWidth: 400,
    },
    {
      headerName: "Keyfield",
      field: "Keyfield",
      hide: true,
      editable: true,
      cellStyle: { textAlign: "right" },
    },
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



  // Current report
  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate a report.");
      return;
    }

    const reportData = selectedRows.map((row) => {
      return {
        Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        Expenditure: row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Expenses_Report</title>");
    reportWindow.document.write("<style>");
    reportWindow.document.write(`
      .report-entry {
          margin-bottom: 20px; /* Adjust the space between each key-value pair */
      }
      .report-label {
          font-weight: bold;
          width: 500px;
          display: inline-block;
      }
      .report-value {
          width: calc(100% -500px);
          display: inline-block;
      }
      .report-button {
          margin-top: 20px;
      }
  `);
    reportWindow.document.write("</style></head><body>");
    reportWindow.document.write("<h1><u>Expense Report</u></h1>");

    // Display report data
    reportData.forEach((row) => {
      // Iterate over each property of the row
      Object.entries(row).forEach(([key, value]) => {
        // Write description and value on a single line
        reportWindow.document.write(`
              <div class="report-entry">
                  <span class="report-label">${key}: </span><span class="report-value">${value}</span>
              </div>
          `);
      });
      // Add a horizontal line after each report
      reportWindow.document.write("<hr>");
    });

    reportWindow.document.write(
      '<button class="report-button" onclick="window.print()">Print</button>'
    );
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
  };

  // Assuming you have a unique identifier for each row, such as 'id'
  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.expenses_date === params.data.expenses_date // Use your unique identifier here
    );
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

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected rows?"
    );
    if (!confirmDelete) {
      return;
    }

    const keyfieldsToDelete = selectedRows.map((row) => row.keyfield);

    try {
      const response = await fetch(`${config.apiBaseUrl}/deleteExpense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyfields: keyfieldsToDelete }),
      });

      if (response.status === 200) {
        console.log("Rows deleted successfully:", keyfieldsToDelete);
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

  const getFilterType = () => {
    if (startDate !== "" && endDate !== "") return "inRange";
    else if (startDate !== "") return "greaterThan";
    else if (endDate !== "") return "lessThan";
  };
  useEffect(() => {
    if (gridApi) {
      if (startDate !== "" && endDate !== "" && startDate > endDate) {
        alert("Start Date should be before End Date");
        setEndDate("");
      } else {
        var dateFilterComponent = gridApi.getFilterInstance("expenses_date");
        dateFilterComponent.setModel({
          type: getFilterType(),
          dateFrom: startDate ? startDate : endDate,
          dateTo: endDate,
        });
        gridApi.onFilterChanged();
      }
    }
  }, [startDate, endDate]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container-fluid">
      <h1 align="center" className="mt-4">Daily Expenses</h1>
      <div className="upper mt-4" style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <button className="Date" onClick={toggleDateInputs}>
            {showDateInputs ? "Hide Date Filter" : "Show Date Filter"}
          </button>
          {showDateInputs && (
            <div className="date-filter-container">
              <label className="date-label">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
              <label className="date-label">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </div>
          )}
        </div>
        <div className="button-container">
          <div className="dropdown d-md-none mt-1">
            <div
              className="btn btn-primary p-2 dropdown-toggle"
              type="button"
              onClick={toggleDropdown}
            >
              <FontAwesomeIcon icon={faListUl} />
            </div>
            {isOpen && (
              <ul className="dropdown-menu show ">
                <li className="dropdown-item" onClick={deleteSelectedRows}>
                  <FontAwesomeIcon icon={faTrash} style={{ color: "red" }} />
                </li>
                <li className="dropdown-item" onClick={exportClick}>
                  <FontAwesomeIcon icon={faDownload} style={{ color: "green" }} />
                </li>
                <li className="dropdown-item" onClick={generateReport}>
                  <FontAwesomeIcon icon={faPrint} style={{ color: "rgb(94, 191, 255)" }} />
                </li>
              </ul>
            )}
          </div>
          <div className="d-none d-md-flex justify-content-between">
            <button class="Delete" onClick={deleteSelectedRows}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 14" class="svgIcon bin-top">
                <g clip-path="url(#clip0_35_24)">
                  <path fill="black" d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"></path>
                </g>
                <defs>
                  <clipPath id="clip0_35_24">
                    <rect fill="white" height="14" width="69"></rect>
                  </clipPath>
                </defs>
              </svg>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 57" class="svgIcon bin-bottom">
                <g clip-path="url(#clip0_35_22)">
                  <path fill="black" d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z" ></path>
                </g>
                <defs>
                  <clipPath id="clip0_35_22">
                    <rect fill="white" height="57" width="69"></rect>
                  </clipPath>
                </defs>
              </svg>
            </button>
            <button class="Export" onClick={() => exportClick()}>
              <svg class="svgIcon" viewBox="0 0 384 512" width="50px" xmlns="http://www.w3.org/2000/svg">
                <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg>
              <span class="icon2"></span>
            </button>
            <button class="Print" onClick={generateReport}>
              <div class="printer">
                <div class="paper">
                  <svg viewBox="0 0 8 8" class="svg" fill="black">
                    <path fill="#0077FF" d="M6.28951 1.3867C6.91292 0.809799 7.00842 0 7.00842 0C7.00842 0 6.45246 0.602112 5.54326 0.602112C4.82505 0.602112 4.27655 0.596787 4.07703 0.595012L3.99644 0.594302C1.94904 0.594302 0.290039 2.25224 0.290039 4.29715C0.290039 6.34206 1.94975 8 3.99644 8C6.04312 8 7.70284 6.34206 7.70284 4.29715C7.70347 3.73662 7.57647 3.18331 7.33147 2.67916C7.08647 2.17502 6.7299 1.73327 6.2888 1.38741L6.28951 1.3867ZM3.99679 6.532C2.76133 6.532 1.75875 5.53084 1.75875 4.29609C1.75875 3.06133 2.76097 2.06018 3.99679 2.06018C4.06423 2.06014 4.13163 2.06311 4.1988 2.06905L4.2414 2.07367C4.25028 2.07438 4.26057 2.0758 4.27406 2.07651C4.81533 2.1436 5.31342 2.40616 5.67465 2.81479C6.03589 3.22342 6.23536 3.74997 6.23554 4.29538C6.23554 5.53084 5.23439 6.532 3.9975 6.532H3.99679Z"></path>
                    <path fill="#0055BB" d="M6.756 1.82386C6.19293 2.09 5.58359 2.24445 4.96173 2.27864C4.74513 2.17453 4.51296 2.10653 4.27441 2.07734C4.4718 2.09225 5.16906 2.07947 5.90892 1.66374C6.04642 1.58672 6.1743 1.49364 6.28986 1.38647C6.45751 1.51849 6.61346 1.6647 6.756 1.8235V1.82386Z"></path>
                  </svg>
                </div>
                <div class="dot"></div>
                <div class="output">
                  <div class="paper-out"></div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          groupIncludeTotalFooter="true"
          pagination={true}
          paginationAutoPageSize={true}
          rowSelection="multiple"
        />
      </div>
      <div align="center" className="mt-3">
        <button class="Update" onClick={saveEditedData}>
          <svg fill="none" height="24" viewBox="0 0 24 24" width="24" class="svg-icon">
            <g
              clip-rule="evenodd"
              fill-rule="evenodd"
              stroke="white"
              stroke-linecap="round"
              stroke-width="2"
            >
              <path
                d="m3 7h17c.5523 0 1 .44772 1 1v11c0 .5523-.4477 1-1 1h-16c-.55228 0-1-.4477-1-1z"
              ></path>
              <path
                d="m3 4.5c0-.27614.22386-.5.5-.5h6.29289c.13261 0 .25981.05268.35351.14645l2.8536 2.85355h-10z"
              ></path>
            </g>
          </svg>
          <span class="lable">Update</span>
        </button>
      </div>
    </div>
  );
}

export default App;