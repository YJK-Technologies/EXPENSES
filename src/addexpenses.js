import React, { useState, useEffect } from "react";
import "./expenses.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const config = require('./ApiConfig');

function Expenses() {
  const [expenses_date, setexpenses_date] = useState("");
  const [expenses_type, setexpenses_type] = useState("");
  const [expenses_amount, setexpenses_amount] = useState("");
  const [expenses_spentby, setexpenses_spentby] = useState("");
  const [remarks, setremarks] = useState("");
  const [error, setError] = useState("");
  const [drop, setDrop] = useState([]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/get`)
      .then((data) => data.json())
      .then((val) => setDrop(val));
  }, []);

  const handleInsert = async () => {
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
      if (response.status === 200) {
        toast.success("Data inserted successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      toast.error('Error inserting data: ' + error.message);
    }
  };

  return (
    <div className="exp-main">
      <div className="exp-container">
        <div className="justify-content-center">
          <div className="text-center">
            <header className="mb-3">
              <h1 className="exp-display-3">
                Expenses Sheet
              </h1>
            </header>
            {error && <div className="error">{error}</div>}
          </div>
          <div className="expenses">
            <div className="pt-2 mb-4">
              <div className="exp-form-floating">
                <label htmlFor="amt" className="exp-form-labels">Expenses</label>
                <input
                  id="amt"
                  className="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  required
                  value={expenses_amount}
                  onChange={(e) => setexpenses_amount(e.target.value)}
                />
              </div>

              <div className="exp-form-floating">
                <label htmlFor="by" className="exp-form-labels">Expense Spent by</label>
                <input
                  id="by"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  value={expenses_spentby}
                  onChange={(e) => setexpenses_spentby(e.target.value)}
                />
              </div>

              <div className="exp-form-floating">
                <label htmlFor="date" className="exp-form-labels">Date</label>
                <input
                  id="date"
                  className="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required
                  value={expenses_date}
                  onChange={(e) => setexpenses_date(e.target.value)}
                />
              </div>
              
              <div className="exp-form-floating">
                <label htmlFor="type" className="exp-form-labels">Expense Types</label>
                <select
                  name="type"
                  id="type"
                  className="exp-input-field form-control"
                  required
                  value={expenses_type}
                  onChange={(e) => setexpenses_type(e.target.value)}
                  autoComplete="off"
                >
                  <option value="">Select Expense Type</option>
                  {drop.map((option, index) => (
                    <option key={index} value={option.expenses_type}>{option.expenses_type}</option>
                  ))}
                </select>
              </div>

              <div className="exp-form-floating">
                <label htmlFor="remarks" className="exp-form-labels">Remarks</label>
                  <textarea
                  id="Remarks"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  value={remarks}
                  onChange={(e) => setremarks(e.target.value)}
                />
              </div>

              
             
            </div>
            <button className="Save" onClick={handleInsert}>
              <div class="svg-wrapper-1">
                <div class="svg-wrapper">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path
                      d="m19,21H5c-1.1,0-2-.9-2-2V5c0-1.1.9-2,2-2h11l5,5v11c0,1.1-.9,2-2,2Z"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      data-path="box"
                    ></path>
                    <path
                      d="M7 3L7 8L15 8"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      data-path="line-top"
                    ></path>
                    <path
                      d="M17 20L17 13L7 13L7 20"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      data-path="line-bottom"
                    ></path>
                  </svg>
                </div>
              </div>
              <span>Save</span>
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Expenses;
