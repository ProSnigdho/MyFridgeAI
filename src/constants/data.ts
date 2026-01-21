export const COLORS = {
  primary: '#2ecc71',
  secondary: '#f39c12',
  danger: '#e74c3c',
  background: '#F8F9FB',
  card: '#FFFFFF',
  text: '#1A1C1E',
  gray: '#8C8C8C',
};

export const MOCK_INVENTORY = [
  { id: '1', name: 'Fresh Tomatoes', qty: '6 pcs', expiry: '2 days', progress: 0.3, color: COLORS.danger },
  { id: '2', name: 'Farm Eggs', qty: '12 pcs', expiry: '8 days', progress: 0.8, color: COLORS.primary },
  { id: '3', name: 'Whole Milk', qty: '1 Liter', expiry: '4 days', progress: 0.5, color: COLORS.secondary },
];

export const MOCK_RECIPES = [
  { id: '1', title: 'Tomato Pasta', match: '95%', time: '15m', color: '#FFEAA7' },
  { id: '2', title: 'Veggie Salad', match: '80%', time: '10m', color: '#D1F2EB' },
  { id: '3', title: 'Egg Fried Rice', match: '75%', time: '20m', color: '#EAECEE' },
];