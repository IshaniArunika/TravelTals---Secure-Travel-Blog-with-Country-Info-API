import React, { useEffect, useState } from 'react';
import { fetchUsersWithUsage } from '../api/userApi';
import '../style/adminPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsersWithUsage();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users with usage:', err);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="admin-container">
      <h2>User API Usage Report</h2>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="8">No users found</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.plan}</td>
                  <td>{user.usageCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
