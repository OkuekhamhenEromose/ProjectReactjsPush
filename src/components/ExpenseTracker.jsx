//  

import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';

const ExpenseTrackerApp = ({ onBackToHome }) => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', amount: 3000, category: 1, description: 'Salary', date: new Date('2024-10-01') },
    { id: 2, type: 'expense', amount: 150, category: 2, description: 'Grocery shopping', date: new Date('2024-10-05') },
    { id: 3, type: 'expense', amount: 50, category: 3, description: 'Gas', date: new Date('2024-10-07') },
    { id: 4, type: 'expense', amount: 80, category: 4, description: 'Netflix & Spotify', date: new Date('2024-10-10') },
  ]);
  
  const [budget, setBudget] = useState(2500);
  const [categories] = useState([
    { id: 1, name: 'Income', icon: '💵', color: 'bg-green-100 text-green-700' },
    { id: 2, name: 'Food', icon: '🍔', color: 'bg-orange-100 text-orange-700' },
    { id: 3, name: 'Transport', icon: '🚗', color: 'bg-blue-100 text-blue-700' },
    { id: 4, name: 'Entertainment', icon: '🎮', color: 'bg-purple-100 text-purple-700' },
    { id: 5, name: 'Shopping', icon: '🛍️', color: 'bg-pink-100 text-pink-700' },
    { id: 6, name: 'Bills', icon: '📄', color: 'bg-red-100 text-red-700' },
  ]);

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: 2,
    description: ''
  });

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) return;
    
    const transaction = {
      id: Date.now(),
      date: new Date(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    };
    
    setTransactions(prev => [transaction, ...prev]);
    setNewTransaction({ type: 'expense', amount: '', category: 2, description: '' });
    setShowAddTransaction(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getCategoryTotals = () => {
    return categories.filter(c => c.id !== 1).map(category => {
      const total = transactions
        .filter(t => t.category === category.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...category,
        total,
        percentage: budget > 0 ? (total / budget) * 100 : 0
      };
    });
  };

  const getMonthlySummary = () => {
    const currentMonth = new Date().getMonth();
    const monthlyTransactions = transactions.filter(
      t => new Date(t.date).getMonth() === currentMonth
    );
    
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      balance: income - expenses,
      budgetRemaining: budget - expenses
    };
  };

  const summary = getMonthlySummary();
  const categoryTotals = getCategoryTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToHome}
              className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Projects</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">💰 Expense Tracker</h1>
          </div>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Add Transaction
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Income</span>
              <span className="text-2xl">💵</span>
            </div>
            <p className="text-2xl font-bold text-green-600">${summary.income.toFixed(2)}</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Expenses</span>
              <span className="text-2xl">💸</span>
            </div>
            <p className="text-2xl font-bold text-red-600">${summary.expenses.toFixed(2)}</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Balance</span>
              <span className="text-2xl">💰</span>
            </div>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${summary.balance.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Budget Left</span>
              <span className="text-2xl">🎯</span>
            </div>
            <p className={`text-2xl font-bold ${summary.budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${summary.budgetRemaining.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Breakdown */}
          <div className="lg:col-span-1 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Category Breakdown</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Monthly Budget</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-4">
              {categoryTotals.map(category => (
                <div key={category.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </span>
                    <span className="text-sm font-bold">${category.total.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${category.percentage > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(category.percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{category.percentage.toFixed(1)}% of budget</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
            
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No transactions yet</p>
              ) : (
                transactions.map(transaction => {
                  const category = categories.find(c => c.id === transaction.category);
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${category?.color || 'bg-gray-100'} flex items-center justify-center text-2xl`}>
                          {category?.icon || '💵'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {category?.name || 'Income'} • {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Transaction</h3>
              <button onClick={() => setShowAddTransaction(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'expense', category: 2})}
                    className={`flex-1 py-2 rounded-lg font-medium ${newTransaction.type === 'expense' ? 'bg-red-100 text-red-700 border-2 border-red-300' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Expense
                  </button>
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'income', category: 1})}
                    className={`flex-1 py-2 rounded-lg font-medium ${newTransaction.type === 'income' ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  disabled={newTransaction.type === 'income'}
                >
                  {categories.filter(c => newTransaction.type === 'income' ? c.id === 1 : c.id !== 1).map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  placeholder="Enter description..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddTransaction(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addTransaction}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTrackerApp;