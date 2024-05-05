import React, { useState, useEffect } from 'react';
import './DashBoard.css';
import YearMonthFilter from './Filter';
import DoubleBarChart from './BarChart';
import { Paper } from '@mui/material';
import Radarchart from './Radar';
import { useUrBudget } from '../../contexts/budget';
import MonthCharts from './monthlyChart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { PieChart } from './PieChart';
import { schemeCategory10 } from 'd3-scale-chromatic';

function DashBoard() {
  const { allBudgets, Expenses, fetchUrCuurentMonthBudget, authStatus } = useUrBudget();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus) {
      const fetchData = async () => {
        try {
          await fetchUrCuurentMonthBudget();
        }
        catch (err) {
          alert('Something went wrong!!!')
        }
      };
      fetchData();
    }
    else {
      toast.error("Please login fisrt!!")
      navigate('/login')
    }
  }, [])


  const getBudgetForSelectedMonthYear = () => {
    const filteredBudgets = allBudgets.filter((budgetItem) => {
      return true
    });
    return filteredBudgets;
  };

  const calculateTotalExpenses = () => {
    const expensesByCategory = {};
    Expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === selectedYear && expenseDate.getMonth() + 1 === selectedMonth) {
        if (!expensesByCategory[expense.categoryName]) {
          expensesByCategory[expense.categoryName] = 0;
        }
        expensesByCategory[expense.categoryName] += expense.amount;
      }
    });
    return expensesByCategory;
  };

  const generateChartData = () => {
    const selectedBudgets = getBudgetForSelectedMonthYear();
    const expensesByCategory = calculateTotalExpenses();

    let totalBudget = 0;
    selectedBudgets.forEach((budgetItem) => {
      budgetItem.categories.forEach((category) => {
        totalBudget += category.allocatedAmount || getDefaultBudget(category.name);
      });
    });

    let totalExpenses = 0;
    Object.values(expensesByCategory).forEach((expense) => {
      totalExpenses += expense;
    });

    const expensesByDay = {};
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      expensesByDay[day] = 0;
    }

    Expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === selectedYear && expenseDate.getMonth() + 1 === selectedMonth) {
        const day = expenseDate.getDate();
        expensesByDay[day] += expense.amount;
      }
    });

    const chartData = [];

    selectedBudgets.forEach((budgetItem) => {
      budgetItem.categories.forEach((category) => {
        const categoryName = category.name;
        const budget = category.allocatedAmount || getDefaultBudget(categoryName);
        const expenses = expensesByCategory[categoryName] || 0;

        chartData.push({
          Category: categoryName,
          Budget: budget,
          Expenses: expenses,
          amt: expenses,
        });
      });
    });

    const dailyExpensesData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dailyExpensesData.push({
        Date: `${selectedYear}-${selectedMonth}-${day}`,
        Expense: expensesByDay[day],
      });
    }

    return { chartData, dailyExpensesData, totalBudget, totalExpenses };
  };

  const getDefaultBudget = (categoryName) => {
    const defaultBudgets = {
      Food: 150,
      Travel: 100,
      Insurance: 500,
      Others: 100,
    };
    return defaultBudgets[categoryName] || 0;
  };

  useEffect(() => {
    // Call any necessary functions when selectedYear or selectedMonth changes
  }, [selectedYear, selectedMonth]);

  const handleFilterChange = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const transformChartDataForPieChart = () => {
    const { chartData } = generateChartData();

    const labels = chartData.map(data => data.Category);
    const budgets = chartData.map(data => data.Budget);

    const colorScale = schemeCategory10;
    const pieChartData = {
      labels: labels,
      datasets: [{
        label: 'Budget For Categories',
        data: budgets,
        backgroundColor: labels.map((label, index) => colorScale[index % colorScale.length]),
        borderColor: colorScale,
        borderWidth: 1,
      }]
    };

    return pieChartData;
  };


  return (
    <div className="container">
      <div style={{ marginTop: '100px' }}>
        <YearMonthFilter onChange={handleFilterChange} />
      </div>
      <Paper style={{ width: '100%' }} elevation={3}>
        <div className="budgetContainer">
          <div>
            <h2 style={{ color: 'white' }}>Total Budget : ${generateChartData().totalBudget}</h2>
            <span></span>
          </div>
          <div>
            <h2 style={{ color: 'white' }}>Monthly Expense : ${generateChartData().totalExpenses}</h2>
          </div>
        </div>
      </Paper>
      <div className="chartsContainer">
        <h2 style={{ textAlign: 'center' }}>Budget Vs Expense</h2>
        <div className="charts">
          <DoubleBarChart data={generateChartData()} />
          <h2>Monthly Budget</h2>
          <PieChart data={transformChartDataForPieChart()} />
          <div>
            <Radarchart data={generateChartData()} />
          </div>
          <div>
            <h2 style={{ textAlign: 'center' }}>Monthly Expenses</h2>
            <MonthCharts data={generateChartData()} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
