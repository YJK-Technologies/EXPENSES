/*import React from "react";

const ReportPage = ({ selectedData }) => {
  // Check if selectedData is undefined or not an array
  if (!Array.isArray(selectedData)) {
    return <div>No data available for report</div>;
  }

  return (
    <div className="report-container">
      <h1>Report</h1>
      {selectedData.map((item, index) => (
        <div key={index} className="report-item">
          <p>Date: {item.expenses_date}</p>
          <p>Type: {item.expenses_type}</p>
          <p>Amount Spent: {item.expenses_amount}</p>
          <p>Spent By: {item.expenses_spentby}</p>
          <p>Remarks: {item.remarks}</p>
        </div>
      ))}
      <div className="print-button">
        <button onClick={() => window.print()}>Print</button>
      </div>
    </div>
  );
};

export default ReportPage;
*/
/*
//ReportPage.js
import React from "react";

const ReportPage = ({ selectedData }) => {
  // Check if selectedData is undefined or not an array
  if (!Array.isArray(selectedData) || selectedData.length === 0) {
    return <div>No data available for report</div>;
  }

  return (
    <div className="report-container">
      <h1>Report</h1>
      {selectedData.map((item, index) => (
        <div key={index} className="report-item">
          <p>Date: {item.expenses_date}</p>
          <p>Type: {item.expenses_type}</p>
          <p>Amount Spent: {item.expenses_amount}</p>
          <p>Spent By: {item.expenses_spentby}</p>
          <p>Remarks: {item.remarks}</p>
        </div>
      ))}
      <div className="print-button">
        <button onClick={() => window.print()}>Print</button>
      </div>
    </div>
  );
};

export default ReportPage;
*/
/*
import React from "react";
import moment from "moment";

const ReportGenerator = ({ selectedRows }) => {
  const generateReport = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate a report.");
      return;
    }

    const reportData = selectedRows.map((row) => {
      return {
        Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        "Amount Spent": row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write(
      "<html><head><title>Data Report</title></head><body>"
    );
    reportWindow.document.write("<h1>Expenses Report</h1>");
    reportWindow.document.write("<table border='1'><thead><tr>");
    Object.keys(reportData[0]).forEach((key) => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write("</tr></thead><tbody>");
    reportData.forEach((row) => {
      reportWindow.document.write("<tr>");
      Object.values(row).forEach((value) => {
        reportWindow.document.write(`<td>${value}</td>`);
      });
      reportWindow.document.write("</tr>");
    });
    reportWindow.document.write("</tbody></table></body></html>");
    reportWindow.document.close();
  };

  return (
    <div>
      <button onClick={generateReport}>Generate Report</button>
    </div>
  );
};

export default ReportGenerator;
*/
import React, { useEffect } from 'react';
import moment from 'moment';

const ReportPage = ({ selectedDate, selectedRows }) => {
  useEffect(() => {
    generateReport(selectedRows);
  }, []); // Ensure report is generated when component mounts

  const generateReport = (selectedRows) => {
    // Generate report based on selected rows and date
    // You can use selectedRows and selectedDate to generate the report
    const reportData = selectedRows.map(row => {
      return {
        Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        "Amount Spent": row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks
      };
    });

    const reportWindow = window.open('', '_blank');
    reportWindow.document.write('<html><head><title>Expenses_Report</title></head><body>');
    reportWindow.document.write('<h1>Expense Report</h1>');
    reportWindow.document.write('<table border="1"><thead><tr>');
    Object.keys(reportData[0]).forEach(key => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write('</tr></thead><tbody>');
    reportData.forEach(row => {
      reportWindow.document.write('<tr>');
      Object.values(row).forEach(value => {
        reportWindow.document.write(`<td>${value}</td>`);
      });
      reportWindow.document.write('</tr>');
    });
    reportWindow.document.write('</tbody></table></body></html>');
    reportWindow.document.close();
  };

  return (
    <div>Generating report...</div>
  );
};

export default ReportPage;
