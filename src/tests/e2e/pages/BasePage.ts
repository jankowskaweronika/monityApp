import { Page } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Wait for the page to be loaded and ready
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Get element by test ID
     */
    protected getByTestId(testId: string) {
        return this.page.locator(`[data-test-id="${testId}"]`);
    }

    /**
     * Wait for element to be visible
     */
    protected async waitForElement(testId: string) {
        await this.getByTestId(testId).waitFor({ state: 'visible' });
    }

    /**
     * Check if element is visible
     */
    protected async isElementVisible(testId: string): Promise<boolean> {
        return await this.getByTestId(testId).isVisible();
    }

    /**
     * Get current URL
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Reload the current page
     */
    async reload() {
        await this.page.reload();
        await this.waitForPageLoad();
    }
} 