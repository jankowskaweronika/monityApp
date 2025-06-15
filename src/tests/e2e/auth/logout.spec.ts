import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Logout Flow', () => {
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

    test('should successfully logout user', async () => {
        // Verify user is authenticated
        expect(await dashboardPage.isAuthenticated()).toBeTruthy();

        // Perform logout
        await dashboardPage.logout();

        // Wait for navigation to login page
        let currentUrl = '';
        for (let i = 0; i < 5; i++) {
            currentUrl = await loginPage.getCurrentUrl();
            if (currentUrl.match(/.*\/auth\/login/)) break;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        expect(currentUrl).toMatch(/.*\/auth\/login/);

        // Try to access dashboard
        await dashboardPage.goto();

        // Wait for authentication state to be updated
        let isAuthenticated = true;
        for (let i = 0; i < 5; i++) {
            isAuthenticated = await dashboardPage.isAuthenticated();
            if (!isAuthenticated) break;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Verify user is not authenticated
        expect(isAuthenticated).toBeFalsy();
        expect(await dashboardPage.authPrompt.isVisible()).toBeTruthy();
        expect(await dashboardPage.loginLink.isVisible()).toBeTruthy();
    });

    test('should not be able to add expense after logout', async () => {
        // Perform logout
        await dashboardPage.logout();

        // Try to access dashboard
        await dashboardPage.goto();

        // Verify add expense button is disabled
        expect(await dashboardPage.addExpenseButton.isDisabled()).toBeTruthy();

        // Try to open add expense modal (should not be possible)
        await dashboardPage.addExpenseButton.click();
        expect(await dashboardPage.addExpenseModal.isVisible()).toBeFalsy();
    });

    test('should maintain logout state after page refresh', async () => {
        // Perform logout
        await dashboardPage.logout();

        // Refresh the page
        await loginPage.reload();

        // Verify we're still on the login page
        const currentUrl = await loginPage.getCurrentUrl();
        expect(currentUrl).toMatch(/.*\/auth\/login/);

        // Try to access dashboard
        await dashboardPage.goto();

        // Verify user is still not authenticated
        expect(await dashboardPage.isAuthenticated()).toBeFalsy();
        expect(await dashboardPage.authPrompt.isVisible()).toBeTruthy();
    });
}); 