"use client";
import { useState, useMemo, useCallback, useRef } from 'react';

// TypeScript Interface for our data
interface Expense {
  id: string;
  name: string;
  amount: number;
}
// 3. Child Component
// Note: We define the types for the props we are receiving
interface ItemProps {
  item: Expense;
  onDelete: (id: string) => void;
}


export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  // Refs for uncontrolled inputs (Performance: prevents re-renders on every keystroke)
  const nameRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  // 1. useMemo: Re-calculates total automatically when 'expenses' changes
  const total = useMemo(() => {
    console.log("Calculating total..."); // Check your console to see when this runs
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const addExpense = () => {
    const name = nameRef.current?.value;
    const amount = Number(amountRef.current?.value);

    if (name && amount > 0) {
      const newExpense: Expense = { id: crypto.randomUUID(), name, amount };
      setExpenses((prev) => [...prev, newExpense]);
      
      // Resetting inputs via Ref
      nameRef.current!.value = "";
      amountRef.current!.value = "";
    }
  };

  // 2. The Delete Function: To be "Lifted Up" from the child
  // We use useCallback to prevent this function from being recreated unnecessarily
  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Expense Tracker</h1>

        {/* Input Section */}
        <div className="space-y-3 mb-8">
          <input 
            ref={nameRef} 
            type="text" 
            placeholder="What did you buy?" 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input 
            ref={amountRef} 
            type="number" 
            placeholder="Amount ($)" 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button 
            onClick={addExpense}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Transaction
          </button>
        </div>

        {/* List Section with Conditional Rendering */}
        <h2 className="font-semibold text-gray-600 mb-3">History</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No transactions yet.</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {expenses.map((item) => (
              <ExpenseItem 
                key={item.id} 
                item={item} 
                onDelete={deleteExpense} 
              />
            ))}
          </ul>
        )}

        {/* Total Calculation Display */}
        <div className="flex justify-between items-center border-t pt-4">
          <span className="text-gray-600 font-medium">Total Balance:</span>
          <span className={`text-xl font-bold ${total > 0 ? 'text-green-600' : 'text-gray-800'}`}>
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </main>
  );
}

function ExpenseItem({ item, onDelete }: ItemProps) {
  return (
    <li className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 group">
      <div>
        <p className="text-sm font-medium text-gray-800">{item.name}</p>
        <p className="text-xs text-gray-500">${item.amount.toFixed(2)}</p>
      </div>
      <button 
        onClick={() => onDelete(item.id)}
        className="text-gray-400 hover:text-red-500 transition-colors text-sm font-bold p-2"
      >
        ✕
      </button>
    </li>
  );
}