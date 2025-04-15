const bcrypt = require('bcryptjs');
const UserDao = require('../dao/userDao');

class UserService {
    async createUser(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await UserDao.create(username, email, hashedPassword);
    }

    async getUserByEmail(email) {
        return await UserDao.findByEmail(email);
    }

    async getUserById(id) {
        return await UserDao.getById(id);
    }

    async getAllUsers() {
        return await UserDao.listAll();
    }

    async updateUserPlan(userId, plan) {
        const validPlans = ['free', 'paid'];
        if (!validPlans.includes(plan)) throw new Error('Invalid plan');
        const user = await this.getUserById(userId);
        if (!user) throw new Error('User not found');
        await UserDao.updatePlan(userId, plan);
        return { userId, plan };
    }
}

module.exports = new UserService();
