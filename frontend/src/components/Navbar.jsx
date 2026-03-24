import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { 
    UserIcon, 
    DocumentTextIcon, 
    TrophyIcon, 
    ArrowRightOnRectangleIcon,
    SunIcon,
    MoonIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';


const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent scroll + signal other elements when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.style.overflow = 'auto';
            document.body.classList.remove('mobile-menu-open');
        }
        return () => {
            document.body.style.overflow = 'auto';
            document.body.classList.remove('mobile-menu-open');
        };
    }, [isMobileMenuOpen]);

    const authRoutes = ['/login', '/register'];
    if (!user || authRoutes.includes(pathname)) return null;

    const profileImg = user.profile_pic ? `${BASE_URL}${user.profile_pic}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

    return (
        <nav className="nav-main">
            <div className="container nav-container">
                <Link to="/dashboard" className="nav-logo">
                    <img src="/logo.png" alt="Skilllens Logo" style={{ height: '35px', marginRight: '10px' }} />
                    <span className="nav-logo-text">SkillLens</span>
                    <span className="nav-logo-dot">.</span>
                </Link>

                <div className="nav-links">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/quizzes" className="nav-link">Quizzes</Link>
                </div>

                <div className="nav-actions">
                    <div className="nav-profile-section" ref={dropdownRef}>
                        <div className="nav-profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <span className="nav-username">{user.name}</span>
                            <img src={profileImg} alt="Profile" className="nav-avatar" />
                        </div>

                        {dropdownOpen && (
                            <div className="nav-dropdown">
                                <div className="nav-dropdown-header">
                                    <strong>{user.name}</strong>
                                    <span className="nav-user-email">{user.email}</span>
                                </div>
                                <div style={{ height: '1px', background: 'var(--border-light)' }}></div>
                                <Link to="/profile" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <UserIcon style={{ width: '1.25rem' }} /> Profile
                                </Link>
                                <Link to="/resume-builder" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <DocumentTextIcon style={{ width: '1.25rem' }} /> Build Resume
                                </Link>
                                <Link to="/quizzes" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <TrophyIcon style={{ width: '1.25rem' }} /> Quiz
                                </Link>
                                <div style={{ height: '1px', background: 'var(--border-light)' }}></div>
                                <button onClick={handleLogout} className="nav-dropdown-item nav-logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <ArrowRightOnRectangleIcon style={{ width: '1.25rem' }} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    <button 
                        className="theme-toggle-btn" 
                        onClick={toggleTheme}
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.25rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            borderRadius: '50%',
                            transition: 'var(--transition)'
                        }}
                    >
                        {isDarkMode ? <SunIcon style={{ width: '1.5rem' }} /> : <MoonIcon style={{ width: '1.5rem' }} />}
                    </button>

                    <button className="nav-hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <XMarkIcon style={{ width: '2rem' }} /> : <Bars3Icon style={{ width: '2rem' }} />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-menu-overlay">
                    <Link to="/dashboard" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                    <Link to="/quizzes" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Quizzes</Link>
                    <Link to="/profile" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <UserIcon style={{ width: '1.5rem' }} /> Profile
                    </Link>
                    <Link to="/resume-builder" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <DocumentTextIcon style={{ width: '1.5rem' }} /> Resume Builder
                    </Link>
                    <button onClick={handleLogout} className="mobile-menu-link logout" style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                        <ArrowRightOnRectangleIcon style={{ width: '1.5rem' }} /> Sign Out
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
