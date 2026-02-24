/*import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Barc = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5500/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();

      // Aggregate data by expenses_spentby and sum up expenses_amount
      const aggregatedData = aggregateData(jsonData);

      setData(aggregatedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to aggregate data by expenses_spentby
  const aggregateData = (originalData) => {
    const aggregatedData = [];
    const map = new Map();
    originalData.forEach((item) => {
      const { expenses_spentby, expenses_amount } = item;
      if (map.has(expenses_spentby)) {
        map.set(expenses_spentby, map.get(expenses_spentby) + expenses_amount);
      } else {
        map.set(expenses_spentby, expenses_amount);
      }
    });
    map.forEach((value, key) => {
      aggregatedData.push({ expenses_spentby: key, expenses_amount: value });
    });
    return aggregatedData;
  };

  return (
    <div>
      <h1>Expenditure</h1>
      <BarChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="expenses_spentby" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="expenses_amount" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default Barc;
*/



import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const config = require('./ApiConfig');

const Barc = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();

      // Aggregate data by expenses_spentby and sum up expenses_amount
      const aggregatedData = aggregateData(jsonData);

      setData(aggregatedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to aggregate data by expenses_spentby
  const aggregateData = (originalData) => {
    const aggregatedData = [];
    const map = new Map();
    originalData.forEach((item) => {
      const { expenses_spentby, expenses_amount } = item;
      if (map.has(expenses_spentby)) {
        map.set(expenses_spentby, map.get(expenses_spentby) + expenses_amount);
      } else {
        map.set(expenses_spentby, expenses_amount);
      }
    });
    map.forEach((value, key) => {
      aggregatedData.push({ expenses_spentby: key, expenses_amount: value });
    });
    return aggregatedData;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Expenditure</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <div style={{ width: '40%' }}>
          <h2>Pie Chart</h2>
          <PieChart width={400} height={400}>
            <Pie data={data} dataKey="expenses_amount" nameKey="expenses_spentby" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div style={{ width: '45%' }}>
          <h2>Doughnut Chart</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="expenses_amount"
                nameKey="expenses_spentby"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Barc;



















/*
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';

const Dashboard = () => {
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5500/'); // Assuming your API endpoint is /api/expenses
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setExpensesData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Extracting data for charts
  const expensesTypes = expensesData.map((expense) => expense.expenses_type);
  const expensesAmounts = expensesData.map((expense) => expense.expenses_amount);

  // Data for Bar Chart
  const barChartData = {
    labels: expensesTypes,
    datasets: [
      {
        label: 'Expenses Amount (INR)',
        data: expensesAmounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  // Data for Pie Chart
  const pieChartData = {
    labels: expensesTypes,
    datasets: [
      {
        data: expensesAmounts,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
        ],
      },
    ],
  };

  return (
    <div>
      <h1>Expenses Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ width: '50%' }}>
          <h2>Bar Chart</h2>
          <Bar
            data={barChartData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
        <div style={{ width: '50%' }}>
          <h2>Pie Chart</h2>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
*/