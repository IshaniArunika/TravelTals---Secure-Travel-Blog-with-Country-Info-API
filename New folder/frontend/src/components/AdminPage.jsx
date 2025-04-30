import React, { useEffect, useState } from 'react';
import { fetchUsersWithUsage, updateUserPlan } from '../api/userApi';
import { fetchTotalApiKeyCount } from '../api/countryApi';  
import '../style/adminPage.css';
import { FaUsers, FaKey } from 'react-icons/fa';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [totalKeys, setTotalKeys] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await fetchUsersWithUsage();
        setUsers(usersData);

        const keyData = await fetchTotalApiKeyCount();
        setTotalKeys(keyData.totalApiKeys);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };

    loadData();
  }, []);

  const handlePlanChange = async (userId, newPlan) => {
    try {
      await updateUserPlan(userId, newPlan);
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, plan: newPlan } : user
        )
      );
    } catch (error) {
      alert('Failed to update user plan');
      console.error(error);
    }
  };

  return (
    <div className="admin-container">
      <h2>User API Usage Report</h2>

      <div className="dashboard-cards">
        <div className="card">
          <FaUsers className="icon" />
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>
        <div className="card">
          <FaKey className="icon" />
          <h3>{totalKeys}</h3>
          <p>API Keys Issued</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Daily Usage</th>
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
                  <td>
                    <select
                      value={user.plan}
                      onChange={(e) => handlePlanChange(user.id, e.target.value)}
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
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
