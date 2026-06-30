import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './Login.module.css';
const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/auth/resetpassword/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Connection failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.brandName}>WealthWise AI</div>
                <h2 className={styles.header}>Reset Password</h2>
                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.error} style={{color: '#10b981'}}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input 
                            className={styles.input} 
                            type="password" 
                            placeholder="New Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            minLength="6"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input 
                            className={styles.input} 
                            type="password" 
                            placeholder="Confirm New Password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            minLength="6"
                        />
                    </div>
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
                <div className={styles.linksContainer}>
                    <Link to="/login" className={styles.link}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};
export default ResetPassword;
