import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api, BASE_URL } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { 
    CameraIcon, 
    ArrowLeftIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        github_url: '',
        linkedin_url: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setProfile(res.data);
            setFormData({
                first_name: res.data.first_name || '',
                last_name: res.data.last_name || '',
                github_url: res.data.github_url || '',
                linkedin_url: res.data.linkedin_url || ''
            });
            // Sync global user state with latest data (pic, name, etc)
            updateUser(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/profile', formData);
            alert('Profile updated successfully!');
            setEditMode(false);
            fetchProfile();
        } catch (err) {
            alert('Update failed');
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('profilePic', file);

        try {
            await api.patch('/users/profile-pic', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Profile picture updated!');
            fetchProfile();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Upload failed. Please ensure the file is under 10MB and in a valid image format (JPG/PNG).';
            alert(errorMsg);
        }
    };

  if (loading) return (
    <div className="container animate-in" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <div className="skeleton" style={{ height: '200px', width: '200px', borderRadius: '50%', margin: '0 auto 2rem' }}></div>
      <div className="skeleton" style={{ height: '30px', width: '300px', margin: '0 auto 1rem' }}></div>
      <div className="skeleton" style={{ height: '20px', width: '200px', margin: '0 auto' }}></div>
    </div>
  );

  return (
    <div className="container animate-in" style={{ padding: '4rem 2rem', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <button 
            className="btn" 
            style={{ color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => navigate('/dashboard')}
        >
            <ArrowLeftIcon style={{ width: '1.25rem' }} /> Back to Dashboard
        </button>
        <span style={{ 
            color: 'var(--primary)', fontWeight: '900', letterSpacing: '0.1em', 
            fontSize: '0.8rem', textTransform: 'uppercase' 
        }}>Security & Identity</span>
      </div>

      <div className="card" style={{ padding: '4rem 3rem', background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Personal Profile</h1>
                <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Manage your digital identity and external professional links.</p>
            </div>
            <button className={`btn ${editMode ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setEditMode(!editMode)} style={{ padding: '0.75rem 2rem' }}>
                {editMode ? 'Cancel Edit' : 'Modify Account'}
            </button>
        </div>

        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '5rem',
            alignItems: 'start'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div style={{ 
                        position: 'absolute', inset: '-10px', borderRadius: '50%', 
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        zIndex: -1, opacity: 0.2, filter: 'blur(10px)'
                    }}></div>
                    <img 
                        src={profile?.profile_pic ? `${BASE_URL}${profile.profile_pic}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=200&background=6366f1&color=fff`} 
                        alt="Profile" 
                        style={{ 
                            width: '240px', height: '240px', borderRadius: '50%', 
                            objectFit: 'cover', border: '8px solid var(--bg-card)', 
                            boxShadow: 'var(--shadow-lg)' 
                        }}
                    />
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        style={{ 
                            position: 'absolute', bottom: '15px', right: '15px', 
                            background: 'var(--primary)', color: 'white', border: 'none', 
                            borderRadius: '50%', width: '56px', height: '56px', 
                            cursor: 'pointer', fontSize: '1.5rem', 
                            boxShadow: 'var(--shadow-md)', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        title="Upload New Avatar"
                    >
                        <CameraIcon style={{ width: '1.75rem' }} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
                <h2 style={{ marginTop: '2.5rem', fontSize: '1.75rem', marginBottom: '0.25rem' }}>{profile?.name}</h2>
                <span style={{ 
                    color: 'var(--primary)', fontWeight: '800', fontSize: '0.85rem', 
                    letterSpacing: '0.05em', textTransform: 'uppercase' 
                }}>{profile?.role}</span>
            </div>

            <div style={{ minWidth: '300px' }}>
                {editMode ? (
                    <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={formData.first_name}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                placeholder="e.g. Alex"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                placeholder="e.g. Thompson"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Github Profile</label>
                            <input 
                                type="url" 
                                className="form-control" 
                                value={formData.github_url}
                                onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                                placeholder="https://github.com/..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">LinkedIn Profile</label>
                            <input 
                                type="url" 
                                className="form-control" 
                                value={formData.linkedin_url}
                                onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>Commit Changes</button>
                    </form>
                ) : (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div style={infoRow}>
                            <span style={infoLabel}>Primary Email</span>
                            <span style={infoValue}>{profile?.email}</span>
                        </div>
                        <div style={infoRow}>
                            <span style={infoLabel}>Legal Name</span>
                            <span style={infoValue}>{profile?.first_name} {profile?.last_name || '(Not Specified)'}</span>
                        </div>
                        <div style={infoRow}>
                            <span style={infoLabel}>Github Ecosystem</span>
                            {profile?.github_url ? (
                                <a href={profile.github_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    Connected Profile <ArrowTopRightOnSquareIcon style={{ width: '1rem' }} />
                                </a>
                            ) : (
                                <span style={{ color: 'var(--text-muted)' }}>Not Linked</span>
                            )}
                        </div>
                        <div style={infoRow}>
                            <span style={infoLabel}>LinkedIn Network</span>
                            {profile?.linkedin_url ? (
                                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    Connected Profile <ArrowTopRightOnSquareIcon style={{ width: '1rem' }} />
                                </a>
                            ) : (
                                <span style={{ color: 'var(--text-muted)' }}>Not Linked</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const infoRow = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid var(--border-light)',
};

const infoLabel = {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const infoValue = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--text-main)'
};

export default Profile;
