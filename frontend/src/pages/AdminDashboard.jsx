import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobMessage, setJobMessage] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers()
        ]);
        setStats(statsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Admin fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await adminService.addJobRole(jobTitle, jobDesc);
      setJobMessage('Job role added successfully!');
      setJobTitle('');
      setJobDesc('');
    } catch (err) {
      setJobMessage(err.response?.data?.message || 'Error adding job role');
    }
  };

  if (loading) return (
    <div className="container animate-in" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <div className="skeleton" style={{ height: '40px', width: '300px', margin: '0 auto 4rem' }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
        {[1, 2, 3, 4].map(i => <div key={i} className="card" style={{ height: '140px' }}></div>)}
      </div>
      <div className="skeleton" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );

  return (
    <div className="container animate-in" style={{ padding: '4rem 2rem', maxWidth: '1400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5rem' }}>
        <div>
          <span style={{ 
              color: 'var(--primary)', fontWeight: '900', letterSpacing: '0.1em', 
              fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' 
          }}>System Administration</span>
          <h1 style={{ fontSize: '3rem', margin: 0, letterSpacing: '-0.02em' }}>Command Center</h1>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button className="btn" style={{ fontWeight: '700', color: 'var(--text-muted)' }} onClick={() => navigate('/dashboard')}>
            Student View
          </button>
          <button className="btn btn-primary" onClick={logout} style={{ background: 'var(--danger)', color: 'white' }}>
            Terminate Session
          </button>
        </div>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.1)' }}>
            <span style={statLabel}>Total Intelligence Nodes</span>
            <p style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)', margin: '0.5rem 0' }}>{stats.totalUsers}</p>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', opacity: 0.5 }}>Active Registered Users</span>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.1)' }}>
            <span style={statLabel}>Data Extractions</span>
            <p style={{ fontSize: '3rem', fontWeight: '900', color: '#10B981', margin: '0.5rem 0' }}>{stats.totalResumes}</p>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', opacity: 0.5 }}>Successful Resume Passes</span>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.1)' }}>
            <span style={statLabel}>Career Vectors</span>
            <p style={{ fontSize: '3rem', fontWeight: '900', color: '#EF4444', margin: '0.5rem 0' }}>{stats.totalJobs}</p>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', opacity: 0.5 }}>Configured Job Matrices</span>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.1)' }}>
            <span style={statLabel}>Simulations Run</span>
            <p style={{ fontSize: '3rem', fontWeight: '900', color: '#F59E0B', margin: '0.5rem 0' }}>{stats.totalQuizzesTaken}</p>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', opacity: 0.5 }}>Completed AI Interviews</span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
        
        {/* User Intelligence Table */}
        <div className="card" style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem' }}>User Directory</h2>
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '800' }}>{users.length} TOTAL</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem' }}>Identity</th>
                  <th style={{ padding: '1rem' }}>Protocol</th>
                  <th style={{ padding: '1rem' }}>Rank</th>
                  <th style={{ padding: '1rem' }}>Registry Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ transition: 'background 0.2s' }}>
                    <td style={{ padding: '1.25rem 1rem', fontWeight: '700', borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}>{u.name}</td>
                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontWeight: '500' }}>{u.email}</td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                       <span style={{ 
                           padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase',
                           background: u.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)', 
                           color: u.role === 'admin' ? '#EF4444' : 'var(--primary)' 
                        }}>
                         {u.role}
                       </span>
                    </td>
                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Matrix Expansion (Add Job) */}
        <div className="card" style={{ padding: '3rem', alignSelf: 'start' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Expansion Protocol</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontWeight: '500' }}>Initialize new job roles and requirements into the global matrix.</p>
          <form onSubmit={handleAddJob} style={{ display: 'grid', gap: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Role Designation</label>
              <input 
                type="text" 
                className="form-control" 
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Kernel Engineer"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Functional Description</label>
              <textarea 
                className="form-control" 
                rows="4"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Detail the core functional requirements..."
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem' }}>
              Commit to Registry
            </button>
            {jobMessage && (
                <div className={`alert ${jobMessage.includes('success') ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1rem' }}>
                    {jobMessage}
                </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
};

const statLabel = {
    fontSize: '0.7rem',
    fontWeight: '900',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'block'
};

export default AdminDashboard;
