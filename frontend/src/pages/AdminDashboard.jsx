import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, ShieldAlert, Trash2, Shield, UserMinus, ShieldCheck, Loader } from 'lucide-react';
import { API_BASE_URL } from '../config';

const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUsersList(data);
      } else {
        throw new Error(data.message || 'Failed to load user directories');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (userId === user._id) {
      alert('You cannot demote or modify your own role!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('User role updated successfully');
        // Update local state
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        alert(data.message || 'Role modification failed');
      }
    } catch (err) {
      alert('Error updating user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user._id) {
      alert('You cannot delete your own admin account!');
      return;
    }

    if (window.confirm('WARNING: Are you sure you want to permanently delete this user? All their enrollment records will remain but their login credentials will be removed.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/users/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          alert('User deleted successfully');
          setUsersList((prev) => prev.filter((u) => u._id !== userId));
        } else {
          alert(data.message || 'Deletion failed');
        }
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <Loader size={36} className="animate-float" style={{ marginRight: '10px' }} />
        <span>Fetching directory schemas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>System Directory Blocked</h2>
        <p style={{ color: 'var(--danger)', marginTop: '10px' }}>{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back Home
        </button>
      </div>
    );
  }

  // Count helper metrics
  const totalUsers = usersList.length;
  const studentsCount = usersList.filter((u) => u.role === 'student').length;
  const instructorsCount = usersList.filter((u) => u.role === 'instructor').length;
  const adminsCount = usersList.filter((u) => u.role === 'admin').length;

  return (
    <div style={{ padding: '0 40px 60px 40px' }} className="animate-slide-up">
      {/* Header banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        padding: '24px 30px',
        borderRadius: 'var(--border-radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={28} color="var(--danger)" /> NextLearn Master Control Panel
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
            Promote user capabilities, audit registration rosters, and maintain system administration.
          </p>
        </div>
      </div>

      {/* Metrics Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '10px' }}>
            <Users size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{totalUsers}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Users</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '12px', borderRadius: '10px' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{studentsCount}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active Students</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--secondary)', padding: '12px', borderRadius: '10px' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{instructorsCount}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Instructors</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '10px' }}>
            <Shield size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{adminsCount}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Administrators</p>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-panel" style={{ padding: '30px', overflowX: 'auto' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>System User Directory</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <th style={{ padding: '12px 16px' }}>NAME</th>
              <th style={{ padding: '12px 16px' }}>EMAIL</th>
              <th style={{ padding: '12px 16px' }}>ROLE</th>
              <th style={{ padding: '12px 16px' }}>ROLE ACTION</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>REMOVE ACCOUNT</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((usr) => (
              <tr 
                key={usr._id} 
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', fontSize: '0.9rem', transition: 'background 0.2s' }}
                className="table-row-hover"
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '16px', fontWeight: '500' }}>{usr.name} {usr._id === user._id && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px' }}>YOU</span>}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{usr.email}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    fontWeight: '700',
                    color: usr.role === 'admin' ? 'var(--danger)' : usr.role === 'instructor' ? 'var(--secondary)' : 'var(--success)',
                    background: usr.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : usr.role === 'instructor' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '12px'
                  }}>
                    {usr.role}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <select
                    value={usr.role}
                    onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                    disabled={usr._id === user._id}
                    style={{
                      background: 'rgba(26, 34, 54, 0.8)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      cursor: usr._id === user._id ? 'not-allowed' : 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDeleteUser(usr._id)}
                    disabled={usr._id === user._id}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: usr._id === user._id ? 'var(--text-muted)' : 'var(--danger)',
                      cursor: usr._id === user._id ? 'not-allowed' : 'pointer',
                      padding: '6px',
                      borderRadius: '4px',
                      transition: 'background 0.2s',
                      opacity: usr._id === user._id ? 0.3 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (usr._id !== user._id) e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (usr._id !== user._id) e.currentTarget.style.background = 'transparent';
                    }}
                    title={usr._id === user._id ? 'Cannot delete yourself' : 'Delete user permanently'}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
