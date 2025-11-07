// Simple in-memory mock database of transactions
const mockTransactions = [
  { 
    id: 'TXN1001', 
    userId: 'USER123', 
    amount: -150.00, 
    description: 'Amazon Purchase', 
    date: '2024-01-15', 
    status: 'completed',
    category: 'shopping'
  },
  { 
    id: 'TXN1002', 
    userId: 'USER123', 
    amount: -50.00, 
    description: 'Starbucks Coffee', 
    date: '2024-01-14', 
    status: 'completed',
    category: 'food'
  },
  { 
    id: 'TXN1003', 
    userId: 'USER123', 
    amount: 2000.00, 
    description: 'Salary Deposit', 
    date: '2024-01-10', 
    status: 'completed',
    category: 'income'
  },
  { 
    id: 'TXN1004', 
    userId: 'USER123', 
    amount: -25.99, 
    description: 'Netflix Subscription', 
    date: '2024-01-05', 
    status: 'pending',
    category: 'entertainment'
  },
];

function findTransactionByDescription(description) {
  return mockTransactions.filter(tx => 
    tx.description.toLowerCase().includes(description.toLowerCase())
  );
}

function findTransactionById(transactionId) {
  return mockTransactions.find(tx => tx.id === transactionId.toUpperCase());
}

function getRecentTransactions(userId, limit = 5) {
  return mockTransactions
    .filter(tx => tx.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

function getTransactionsByDateRange(userId, startDate, endDate) {
  return mockTransactions.filter(tx => 
    tx.userId === userId && 
    new Date(tx.date) >= new Date(startDate) && 
    new Date(tx.date) <= new Date(endDate)
  );
}

module.exports = {
  findTransactionByDescription,
  findTransactionById,
  getRecentTransactions,
  getTransactionsByDateRange,
  mockTransactions // for debugging
};