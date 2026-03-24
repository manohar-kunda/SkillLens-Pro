import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, 'student');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
            <img src="/logo.png" alt="Skilllens Logo" style={styles.logo} />
            <h1 style={styles.title}>Join SkillLens</h1>
            <p style={styles.subtitle}>Start your professional transformation</p>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              style={styles.input} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              style={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                style={{...styles.input, paddingRight: '2.5rem'}} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon style={styles.icon} />
                ) : (
                  <EyeIcon style={styles.icon} />
                )}
              </button>
            </div>
          </div>
          
          <button type="submit" style={styles.button}>
            Create Account
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at bottom right, #6366f1, #4f46e5, #0b0f19)',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '3rem',
        borderRadius: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '460px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 1,
    },
    header: {
        marginBottom: '2.5rem',
    },
    logo: {
        height: '70px',
        marginBottom: '1.5rem',
        filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.4))',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '900',
        margin: 0,
        background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.04em',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: '0.75rem',
        fontSize: '1rem',
        fontWeight: '500',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    inputGroup: {
        textAlign: 'left',
    },
    label: {
        display: 'block',
        fontSize: '0.75rem',
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '0.5rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
    },
    input: {
        width: '100%',
        padding: '0.9rem 1.25rem',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '1rem',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        outline: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
    },
    passwordWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    toggleButton: {
        position: 'absolute',
        right: '1rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        padding: 0,
        transition: 'color 0.2s',
    },
    icon: {
        width: '1.25rem',
        height: '1.25rem',
    },
    button: {
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        color: 'white',
        padding: '1.1rem',
        borderRadius: '1rem',
        border: 'none',
        fontSize: '1.1rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '1.25rem',
        transition: 'all 0.3s',
        boxShadow: '0 15px 30px -10px rgba(99, 102, 241, 0.6)',
    },
    error: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#f87171',
        padding: '1rem',
        borderRadius: '0.75rem',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        fontWeight: '600',
    },
    footer: {
        marginTop: '2rem',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.95rem',
    },
    link: {
        color: '#818cf8',
        textDecoration: 'none',
        fontWeight: '700',
        marginLeft: '0.4rem',
    }
};

export default Register;
