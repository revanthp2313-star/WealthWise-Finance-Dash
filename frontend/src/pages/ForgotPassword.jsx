import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/forgotpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Password reset email sent. Please check your inbox.');
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
                <h2 className={styles.header}>Forgot Password</h2>
                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.error} style={{color: '#10b981'}}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input 
                            className={styles.input} 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <div className={styles.linksContainer}>
                    <Link to="/login" className={styles.link}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};
export default ForgotPassword;
