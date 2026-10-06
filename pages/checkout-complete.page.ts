import { expect, type Page } from '@playwright/test';

export class CheckoutCompletePage {
  readonly title;
  readonly successMessage;
  readonly backHomeButton;
  readonly pdfButton;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.successMessage = page.getByText('Thank you for your order!', { exact: true });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home', exact: true });
    this.pdfButton = page.getByRole('button', { name: 'Generate PDF order', exact: true });
  }

  async downloadReceipt() {
    await expect(
      this.pdfButton,
      'BLOCKER: Required "Generate PDF order" button is unavailable on the checkout completion page.',
    ).toBeVisible();
    await expect(
      this.pdfButton,
      'BLOCKER: Required "Generate PDF order" button is disabled.',
    ).toBeEnabled();

    // Promise.all registers the listener first and observes both promises if either fails.
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.pdfButton.click(),
    ]);
    return download;
  }
}
