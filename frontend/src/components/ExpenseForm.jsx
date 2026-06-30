import { useState, useEffect } from 'react';
import styles from './ExpenseForm.module.css';
const ExpenseForm = ({ onExpenseAdded, expenseToEdit, clearEdit }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setAmount(expenseToEdit.amount);
      setCategory(expenseToEdit.category);
    } else {
      setTitle('');
      setAmount('');
      setCategory('');
    }
  }, [expenseToEdit]);
  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!title || !amount || !category) return alert("Please fill all fields!");
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      const method = expenseToEdit ? 'PUT' : 'POST';
      const url = expenseToEdit
        ? `http://localhost:5000/api/expenses/${expenseToEdit._id}`
        : 'http://localhost:5000/api/expenses';
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title, amount: Number(amount), category })
      });
      if (res.ok) {
        setTitle('');
        setAmount('');
        setCategory('');
        setStatus({ type: 'success', message: expenseToEdit ? 'Expense updated!' : 'Expense added!' });
        if (expenseToEdit) clearEdit(); 
        if (onExpenseAdded) onExpenseAdded();
      }
    } catch (err) {
      setStatus({ type: 'error', message: expenseToEdit ? 'Failed to update expense' : 'Failed to add expense' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };
  return (
    <div className={styles.formContainer}>
      <h3 className={styles.header}>{expenseToEdit ? 'Edit Expense' : 'Add New Expense'}</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>TITLE</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Morning Coffee"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>AMOUNT (₹)</label>
          <input
            type="number"
            className={styles.input}
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>CATEGORY</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.input}
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting} style={{ flex: 1 }}>
            {isSubmitting ? 'Processing...' : (expenseToEdit ? 'Update Expense' : 'Add Expense')}
          </button>
          {expenseToEdit && (
            <button type="button" className={styles.cancelBtn} onClick={clearEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
      {status?.message && (
        <div className={`${styles.message} ${status?.type === 'error' ? styles.error : styles.success}`}>
          {status.message}
        </div>
      )}
    </div>
  );
};
export default ExpenseForm;