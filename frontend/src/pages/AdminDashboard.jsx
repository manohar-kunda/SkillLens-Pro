import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon, DocumentTextIcon, BriefcaseIcon, AcademicCapIcon,
  PlusIcon, TrashIcon, ArrowLeftIcon, ShieldCheckIcon, ChartBarIcon, Cog6ToothIcon
} from '@heroicons/react/24/outline';

const TABS = ['Overview', 'Users', 'Job Roles', 'Settings'];

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobMessage, setJobMessage] = useState({ type: '', text: '' });
  const [userSearch, setUserSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/dashboard'); return; }
    const fetchAll = async () => {
      try {
        const [s, u, j] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
          adminService.getJobRoles(),
        ]);
        setStats(s);
        setUsers(u);
        setJobRoles(j);
      } catch (e) {
        console.error('Admin data error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user, navigate]);

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await adminService.addJobRole(jobTitle, jobDesc);
      setJobMessage({ type: 'success', text: `"${jobTitle}" added successfully!` });
      setJobTitle('');
      setJobDesc('');
      const updated = await adminService.getJobRoles();
      setJobRoles(updated);
    } catch (err) {
      setJobMessage({ type: 'error', text: err.response?.data?.message || 'Error adding job role' });
    }
    setTimeout(() => setJobMessage({ type: '', text: '' }), 4000);
  };

  const handleDeleteRole = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminService.deleteJobRole(id);
      setJobRoles(prev => prev.filter(j => j.id !== id));
    } catch (e) {
      alert('Failed to delete job role');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Remove user "${name}"? This will delete all their data.`)) return;
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredRoles = jobRoles.filter(r =>
    r.title.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const STAT_CARDS = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: UsersIcon, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
    { label: 'Resumes Uploaded', value: stats.totalResumes, icon: DocumentTextIcon, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Job Roles', value: stats.totalJobs, icon: BriefcaseIcon, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Quizzes Taken', value: stats.totalQuizzesTaken, icon: AcademicCapIcon, color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
  ] : [];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Loading Admin Console…</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Top Bar */}
      <div style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-light)',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), #9333ea)',
            borderRadius: '0.75rem', width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ShieldCheckIcon style={{ width: '1.2rem', color: 'white' }} />
          </div>
          <div>
            <p style={{ fontWeight: '800', fontSize: '0.95rem', margin: 0 }}>SkillLens Admin</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontWeight: '600' }}>Control Panel</p>
          </div>
        </div>

        {/* Tab Nav */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-main)', padding: '0.35rem', borderRadius: '1rem' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0.45rem 1.1rem', border: 'none', borderRadius: '0.75rem',
              fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === tab ? 'var(--primary)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text-muted)',
            }}>{tab}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{
            padding: '0.5rem 1rem', border: '1px solid var(--border-light)',
            borderRadius: '0.75rem', background: 'transparent', cursor: 'pointer',
            fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}>
            <ArrowLeftIcon style={{ width: '0.9rem' }} /> User View
          </button>
          <button onClick={logout} style={{
            padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.75rem',
            cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem', color: '#EF4444'
          }}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        
        {/* ====== OVERVIEW TAB ====== */}
        {activeTab === 'Overview' && (
          <div className="animate-in">
            <div style={{ marginBottom: '2.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 0.25rem' }}>
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>
                Here's what's happening on SkillLens today.
              </p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="card" style={{ padding: '1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'center', border: `1px solid ${bg}` }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '1rem', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: '1.5rem', color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem' }}>{label}</p>
                    <p style={{ fontSize: '2rem', fontWeight: '900', color, margin: 0, lineHeight: 1 }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Manage Users', tab: 'Users', icon: UsersIcon, color: '#6366f1' },
                  { label: 'Add Job Role', tab: 'Job Roles', icon: BriefcaseIcon, color: '#10b981' },
                  { label: 'View Analytics', tab: 'Overview', icon: ChartBarIcon, color: '#f59e0b' },
                  { label: 'Settings', tab: 'Settings', icon: Cog6ToothIcon, color: '#ec4899' },
                ].map(({ label, tab, icon: Icon, color }) => (
                  <button key={label} onClick={() => setActiveTab(tab)} style={{
                    padding: '1.25rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)',
                    borderRadius: '1rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '0.75rem'
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                  >
                    <Icon style={{ width: '1.25rem', color }} />
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div className="card" style={{ padding: '2rem', marginTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Recent Users</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {['Name', 'Email', 'Role', 'Joined'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map(u => (
                      <tr key={u.id}>
                        <td style={{ padding: '1rem', fontWeight: '700' }}>{u.name}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{u.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase',
                            background: u.role === 'admin' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                            color: u.role === 'admin' ? '#EF4444' : '#6366f1'
                          }}>{u.role}</span>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====== USERS TAB ====== */}
        {activeTab === 'Users' && (
          <div className="animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontWeight: '900', margin: '0 0 0.25rem' }}>User Management</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{users.length} total users registered</p>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                style={{ maxWidth: '260px', height: '2.75rem' }}
              />
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-main)' }}>
                    {['ID', 'Name', 'Email', 'Role', 'Joined', 'Action'].map(h => (
                      <th key={h} style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={u.id} style={{ borderTop: '1px solid var(--border-light)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>#{u.id}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '700' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), #9333ea)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '0.8rem', fontWeight: '800', flexShrink: 0
                          }}>{u.name[0]?.toUpperCase()}</div>
                          {u.name}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{u.email}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase',
                          background: u.role === 'admin' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                          color: u.role === 'admin' ? '#EF4444' : '#6366f1'
                        }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {u.email !== 'manoharkunda5@gmail.com' && (
                          <button onClick={() => handleDeleteUser(u.id, u.name)} style={{
                            padding: '0.4rem 0.75rem', background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem',
                            color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                            fontWeight: '700', fontSize: '0.75rem'
                          }}>
                            <TrashIcon style={{ width: '0.9rem' }} /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found</div>
              )}
            </div>
          </div>
        )}

        {/* ====== JOB ROLES TAB ====== */}
        {activeTab === 'Job Roles' && (
          <div className="animate-in" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
            {/* Left: Roles List */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontWeight: '900', margin: '0 0 0.25rem' }}>Job Role Registry</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{jobRoles.length} roles configured</p>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter roles..."
                  value={roleSearch}
                  onChange={e => setRoleSearch(e.target.value)}
                  style={{ maxWidth: '220px', height: '2.75rem' }}
                />
              </div>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {filteredRoles.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No job roles yet. Add one →</div>
                ) : filteredRoles.map((role, i) => (
                  <div key={role.id} style={{
                    padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: i < filteredRoles.length - 1 ? '1px solid var(--border-light)' : 'none',
                    transition: 'background 0.2s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-main)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div>
                      <p style={{ fontWeight: '700', margin: '0 0 0.2rem' }}>{role.title}</p>
                      {role.description && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                          {role.description.slice(0, 80)}{role.description.length > 80 ? '…' : ''}
                        </p>
                      )}
                    </div>
                    <button onClick={() => handleDeleteRole(role.id, role.title)} style={{
                      width: '34px', height: '34px', borderRadius: '50%', border: 'none',
                      background: 'rgba(239,68,68,0.08)', color: '#EF4444',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginLeft: '1rem', transition: 'all 0.2s'
                    }}
                      title="Delete role"
                      onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
                    >
                      <TrashIcon style={{ width: '0.9rem' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Add Role Form */}
            <div className="card" style={{ padding: '2rem', position: 'sticky', top: '80px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlusIcon style={{ width: '1.25rem', color: '#10b981' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontWeight: '800' }}>Add New Role</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Appears instantly in search</p>
                </div>
              </div>
              <form onSubmit={handleAddJob} style={{ display: 'grid', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Role Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder="e.g. Blockchain Developer"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description (optional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={jobDesc}
                    onChange={e => setJobDesc(e.target.value)}
                    placeholder="What does this role involve?"
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <PlusIcon style={{ width: '1rem' }} /> Add to Registry
                </button>
                {jobMessage.text && (
                  <div style={{
                    padding: '0.9rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: '600',
                    background: jobMessage.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: jobMessage.type === 'success' ? '#10b981' : '#EF4444',
                    border: `1px solid ${jobMessage.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                  }}>
                    {jobMessage.text}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* ====== SETTINGS TAB ====== */}
        {activeTab === 'Settings' && (
          <div className="animate-in" style={{ maxWidth: '600px' }}>
            <h2 style={{ fontWeight: '900', marginBottom: '2rem' }}>Admin Settings</h2>
            <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Your Admin Account</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Logged in as administrator</p>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[['Name', user?.name], ['Email', user?.email], ['Role', 'Admin']].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</span>
                    <span style={{ fontWeight: '600' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Platform Info</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>System overview and health</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {stats && [
                  ['Total Users', stats.totalUsers],
                  ['Total Resumes', stats.totalResumes],
                  ['Job Roles Configured', stats.totalJobs],
                  ['Quizzes Completed', stats.totalQuizzesTaken],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '0.75rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)', margin: 0 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
