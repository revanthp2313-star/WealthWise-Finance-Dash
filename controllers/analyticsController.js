const Expense = require('../models/Expense');
const User = require('../models/User');
const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const { startDate, endDate } = req.query; 
        let dateFilter = { user: userId };
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate), 
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) 
            };
        }
        const expenses = await Expense.find(dateFilter).sort({ createdAt: -1 });
        const user = await User.findById(userId);
        const totalSpending = expenses.reduce((acc, exp) => acc + exp.amount, 0);
        const categoryBreakdown = expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});
        const topExpenses = [...expenses]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 3);
        return res.status(200).json({
            totalSpending,
            totalTransactions: expenses.length,
            categoryBreakdown,
            topExpenses, 
            monthlyBudget: user ? user.monthlyBudget : 0
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        return res.status(500).json({ message: 'Failed to fetch analytics' });
    }
};
const getMonthlyComparison = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        const [thisMonthExpenses, lastMonthExpenses] = await Promise.all([
            Expense.find({ user: userId, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } }),
            Expense.find({ user: userId, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } })
        ]);
        const thisMonthTotal = thisMonthExpenses.reduce((acc, exp) => acc + exp.amount, 0);
        const lastMonthTotal = lastMonthExpenses.reduce((acc, exp) => acc + exp.amount, 0);
        const thisMonthCategories = thisMonthExpenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});
        const lastMonthCategories = lastMonthExpenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});
        const totalChange = lastMonthTotal === 0 ? 100 : Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100);
        const categories = {};
        const allCategoryKeys = new Set([...Object.keys(thisMonthCategories), ...Object.keys(lastMonthCategories)]);
        allCategoryKeys.forEach(cat => {
            const tm = thisMonthCategories[cat] || 0;
            const lm = lastMonthCategories[cat] || 0;
            const change = lm === 0 ? 100 : Math.round(((tm - lm) / lm) * 100);
            categories[cat] = {
                thisMonth: tm,
                lastMonth: lm,
                change
            };
        });
        res.status(200).json({
            thisMonthTotal,
            lastMonthTotal,
            totalChange,
            categories
        });
    } catch (error) {
        console.error("Monthly Comparison Error:", error);
        res.status(500).json({ message: 'Failed to fetch comparison' });
    }
};
module.exports = { getAnalytics, getMonthlyComparison };