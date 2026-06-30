import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault(); 
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), 
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Connection failed');
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.brandName}>WealthWise AI</div>
                <h2 className={styles.header}>Welcome back</h2>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <input 
                            className={styles.input} 
                            type="email" 
                            placeholder="Email Address" 
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                            required 
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input 
                            className={styles.input} 
                            type="password" 
                            placeholder="Password" 
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                            required 
                        />
                    </div>
                    <button type="submit" className={styles.button}>Login</button>
                </form>
                <div className={styles.linksContainer}>
                    <Link to="/forgot-password" className={styles.link}>Forgot Password?</Link>
                    <span className={styles.linkSeparator}> | </span>
                    <Link to="/register" className={styles.link}>Don't have an account? Sign up</Link>
                </div>
            </div>
        </div>
    );
};
export default Login;