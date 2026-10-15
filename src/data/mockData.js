/**
 * Synthetic mock data for SecureBank - AITHOS AI Privacy Sandbox
 * Strictly fictional: No real banking APIs, live account credentials, or real PII.
 * Currency: INR (₹)
 */

export const DEMO_CREDENTIALS = {
  primary: {
    email: 'alex.morgan@securebank.in',
    password: 'SecureBank@2026',
    customerName: 'Alex Morgan',
    role: 'Primary Account Holder'
  },
  secondary: {
    email: 'evaluator@securebank.in',
    password: 'AithosSandbox#2026',
    customerName: 'AITHOS Evaluation Agent',
    role: 'Evaluator Sandbox Mode'
  }
};

export const INITIAL_USER_PROFILE = {
  id: 'usr_sec_8492',
  name: 'Alex Morgan',
  greetingName: 'Alex',
  email: 'alex.morgan@securebank.in',
  phone: '+91 98201 48293',
  address: 'Tower B, 14th Floor, Horizon Residences, BKC, Mumbai 400051',
  accountNumberMasked: '•••• •••• •••• 8492',
  accountNumberLast4: '8492',
  routingNumberMasked: '•••• 8492',
  routingNumberLast4: '8492',
  ifscCode: 'SECB0008492',
  accountType: 'Privilege Savings (NetBanking Tier)',
  tier: 'Platinum Privilege',
  memberSince: 'September 2021',
  kycStatus: 'Verified (Full e-KYC Sandbox)',
  currency: 'INR',
  currencySymbol: '₹'
};

export const INITIAL_ACCOUNT_METRICS = {
  availableBalance: 485250.00,
  availableBalanceChange: '+4.8%',
  monthlyIncome: 185000.00,
  monthlyIncomeChange: '+12.4%',
  monthlyExpenses: 78420.00,
  monthlyExpensesChange: '-4.2%',
  netCashFlow: 106580.00,
  savingsGoal: 600000.00,
  currentSavings: 520000.00,
  currency: 'INR',
  currencySymbol: '₹'
};

// 20 realistic fictional records in INR with stable IDs
export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1001',
    date: '2026-10-15',
    merchant: "Nature's Basket Gourmet",
    category: 'Groceries',
    amount: 3450.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'Weekly organic produce and pantry order'
  },
  {
    id: 'tx-1002',
    date: '2026-10-14',
    merchant: 'Apple Services India',
    category: 'Technology',
    amount: 299.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'iCloud+ 2TB storage subscription'
  },
  {
    id: 'tx-1003',
    date: '2026-10-14',
    merchant: 'Tech Innovations Pvt Ltd - Salary',
    category: 'Income',
    amount: 145000.00,
    type: 'credit',
    status: 'settled',
    paymentMethod: 'NEFT Direct Credit',
    description: 'Monthly payroll compensation'
  },
  {
    id: 'tx-1004',
    date: '2026-10-13',
    merchant: 'Blue Tokai Coffee Roasters',
    category: 'Food & Dining',
    amount: 480.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'UPI AutoPay ••8492',
    description: 'Artisan cold brew and roast beans'
  },
  {
    id: 'tx-1005',
    date: '2026-10-12',
    merchant: 'Amazon India Marketplace',
    category: 'Shopping',
    amount: 2850.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'Home ergonomic desk accessories'
  },
  {
    id: 'tx-1006',
    date: '2026-10-11',
    merchant: 'Cult.fit Fitness & Wellness',
    category: 'Health & Fitness',
    amount: 2400.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Recurring NACH Mandate',
    description: 'Monthly elite fitness membership'
  },
  {
    id: 'tx-1007',
    date: '2026-10-10',
    merchant: 'IndiGo Airlines Flight',
    category: 'Travel & Transit',
    amount: 8920.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'Roundtrip BOM to BLR flight reservation'
  },
  {
    id: 'tx-1008',
    date: '2026-10-09',
    merchant: 'Reliance Fresh Supermarket',
    category: 'Groceries',
    amount: 1840.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'Household dairy and fresh vegetables'
  },
  {
    id: 'tx-1009',
    date: '2026-10-08',
    merchant: 'Adani Electricity Mumbai',
    category: 'Utilities',
    amount: 3150.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'BBPS NetBanking Pay',
    description: 'Monthly residential electricity bill'
  },
  {
    id: 'tx-1010',
    date: '2026-10-07',
    merchant: 'Swiggy Gourmet Dining',
    category: 'Food & Dining',
    amount: 780.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'UPI AutoPay ••8492',
    description: 'Mediterranean dinner bowl order'
  },
  {
    id: 'tx-1011',
    date: '2026-10-06',
    merchant: 'Freelance Architectural Advisory',
    category: 'Income',
    amount: 40000.00,
    type: 'credit',
    status: 'settled',
    paymentMethod: 'RTGS Client Inflow',
    description: 'Project milestone design review fee'
  },
  {
    id: 'tx-1012',
    date: '2026-10-05',
    merchant: 'Flipkart Electronics',
    category: 'Shopping',
    amount: 4290.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'Noise cancelling studio headphones'
  },
  {
    id: 'tx-1013',
    date: '2026-10-04',
    merchant: 'Uber Premier Transit',
    category: 'Travel & Transit',
    amount: 640.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'City airport transfer'
  },
  {
    id: 'tx-1014',
    date: '2026-10-03',
    merchant: 'Netflix India Subscription',
    category: 'Entertainment',
    amount: 649.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'Premium Ultra HD 4-screen monthly plan'
  },
  {
    id: 'tx-1015',
    date: '2026-10-03',
    merchant: 'Indian Oil Retail Fuel',
    category: 'Travel & Transit',
    amount: 2500.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'XP95 premium automotive fuel refill'
  },
  {
    id: 'tx-1016',
    date: '2026-10-02',
    merchant: 'Third Wave Coffee Roasters',
    category: 'Food & Dining',
    amount: 350.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'UPI AutoPay ••8492',
    description: 'Pour over coffee and French croissant'
  },
  {
    id: 'tx-1017',
    date: '2026-10-02',
    merchant: 'Apollo 24|7 Healthcare',
    category: 'Health & Fitness',
    amount: 1120.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'Prescription wellness supplements'
  },
  {
    id: 'tx-1018',
    date: '2026-10-01',
    merchant: 'Spotify India Premium',
    category: 'Entertainment',
    amount: 179.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'Family lossless streaming subscription'
  },
  {
    id: 'tx-1019',
    date: '2026-10-01',
    merchant: 'BookMyShow Cinema Club',
    category: 'Entertainment',
    amount: 950.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'IMAX laser cinema evening tickets'
  },
  {
    id: 'tx-1020',
    date: '2026-09-30',
    merchant: 'MakeMyTrip Resort Weekend',
    category: 'Travel & Transit',
    amount: 12400.00,
    type: 'debit',
    status: 'cleared',
    paymentMethod: 'Virtual Debit ••8492',
    description: 'Lonavala villa weekend reservation'
  }
];

export const SPENDING_BY_CATEGORY = [
  { category: 'Travel & Transit', amount: 24460.00, color: '#2563eb', percentage: 31.2 },
  { category: 'Shopping', amount: 7140.00, color: '#3b82f6', percentage: 9.1 },
  { category: 'Groceries', amount: 5290.00, color: '#10b981', percentage: 6.7 },
  { category: 'Health & Fitness', amount: 3520.00, color: '#06b6d4', percentage: 4.5 },
  { category: 'Utilities', amount: 3150.00, color: '#f59e0b', percentage: 4.0 },
  { category: 'Food & Dining', amount: 1610.00, color: '#6366f1', percentage: 2.1 },
  { category: 'Entertainment', amount: 1778.00, color: '#8b5cf6', percentage: 2.3 },
  { category: 'Technology', amount: 299.00, color: '#64748b', percentage: 0.4 }
];

export const CATEGORY_OPTIONS = [
  'All Categories',
  'Groceries',
  'Food & Dining',
  'Technology',
  'Shopping',
  'Health & Fitness',
  'Travel & Transit',
  'Utilities',
  'Entertainment',
  'Income'
];

/**
 * Format currency in Indian Rupees format (₹ xx,xx,xxx.xx)
 */
export function formatINR(val) {
  if (val === undefined || val === null || isNaN(val)) return '₹0.00';
  return '₹' + Number(val).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
