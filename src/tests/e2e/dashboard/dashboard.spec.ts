import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Dashboard Flow', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        
        // Login before each test
        await loginPage.goto();
        await loginPage.login('test@example.com', 'password123');
        
        // Wait for navigation to complete and dashboard to load
        await dashboardPage.goto();

        // Wait for authentication state to be ready
        let isAuthenticated = false;
        for (let i = 0; i < 5; i++) {
            isAuthenticated = await dashboardPage.isAuthenticated();
            if (isAuthenticated) break;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (!isAuthenticated) {
            throw new Error('Failed to authenticate before test');
        }
    });

    test('should display dashboard elements for authenticated user', async () => {
        // Wait for all dashboard elements to be visible with increased timeout
        await Promise.all([
            dashboardPage.title.waitFor({ state: 'visible', timeout: 15000 }),
            dashboardPage.periodSummaryCard.waitFor({ state: 'visible', timeout: 15000 }),
            dashboardPage.expensesChartCard.waitFor({ state: 'visible', timeout: 15000 }),
            dashboardPage.recentExpensesCard.waitFor({ state: 'visible', timeout: 15000 }),
            dashboardPage.addExpenseButton.waitFor({ state: 'visible', timeout: 15000 })
        ]);

        // Verify dashboard elements are visible
        expect(await dashboardPage.title.isVisible()).toBeTruthy();
        expect(await dashboardPage.periodSummaryCard.isVisible()).toBeTruthy();
        expect(await dashboardPage.expensesChartCard.isVisible()).toBeTruthy();
        expect(await dashboardPage.recentExpensesCard.isVisible()).toBeTruthy();
        expect(await dashboardPage.addExpenseButton.isVisible()).toBeTruthy();
    });

    test('should add new expense', async () => {
        // Wait for the add expense button to be enabled
        await dashboardPage.addExpenseButton.waitFor({ state: 'visible', timeout: 10000 });
        
        const testExpense = {
            amount: '100.50',
            categoryId: '1', // Assuming category ID 1 exists
            date: new Date().toISOString().split('T')[0],
            description: 'Test expense'
        };

        // Add new expense
        await dashboardPage.addExpense(testExpense);

        // Wait for the expense list to update
        await dashboardPage.expensesList.waitFor({ state: 'visible', timeout: 10000 });
        
        // Get the first expense item (most recent)
        const firstExpense = await dashboardPage.expensesList.locator('[data-test-id^="expense-item-"]').first();
        await firstExpense.waitFor({ state: 'visible', timeout: 10000 });
        
        const dataTestId = await firstExpense.getAttribute('data-test-id');
        const expenseId = dataTestId ? dataTestId.replace('expense-item-', '') : null;
        
        if (expenseId) {
            const expenseDetails = await dashboardPage.getExpenseDetails(expenseId);
            expect(expenseDetails.description).toBe(testExpense.description);
            expect(expenseDetails.amount).toContain(testExpense.amount);
        } else {
            throw new Error('Could not find expense ID');
        }
    });

    test('should refresh dashboard data', async () => {
        // Get initial data
        const initialExpensesCount = await dashboardPage.expensesList.locator('[data-test-id^="expense-item-"]').count();

        // Refresh dashboard
        await dashboardPage.refreshDashboard();

        // Verify data was refreshed
        const newExpensesCount = await dashboardPage.expensesList.locator('[data-test-id^="expense-item-"]').count();
        expect(newExpensesCount).toBe(initialExpensesCount);
    });

    test('should show loading state when refreshing', async () => {
        // Start refresh
        const refreshPromise = dashboardPage.refreshDashboard();
        
        // Wait a bit for the loading state to appear
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verify loading state
        expect(await dashboardPage.expensesLoading.isVisible()).toBeTruthy();
        
        // Wait for refresh to complete
        await refreshPromise;
        
        // Verify loading state is gone
        expect(await dashboardPage.expensesLoading.isVisible()).toBeFalsy();
    });

    test('should cancel adding new expense', async () => {
        // Open add expense modal
        await dashboardPage.openAddExpenseModal();
        expect(await dashboardPage.addExpenseModal.isVisible()).toBeTruthy();

        // Fill some data
        await dashboardPage.fillExpenseForm({
            amount: '50.00',
            categoryId: '1',
            date: new Date().toISOString().split('T')[0],
            description: 'Cancelled expense'
        });

        // Cancel the form
        await dashboardPage.cancelExpenseButton.click();

        // Verify modal is closed
        expect(await dashboardPage.addExpenseModal.isVisible()).toBeFalsy();
    });
}); 