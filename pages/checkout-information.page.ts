import { type Page } from '@playwright/test';

export class CheckoutInformationPage {
  readonly title;
  readonly firstName;
  readonly lastName;
  readonly postalCode;
  readonly continueButton;

  constructor(page: Page) {
    this.title = page.getByTestId('title');
    this.firstName = page.getByPlaceholder('First Name', { exact: true });
    this.lastName = page.getByPlaceholder('Last Name', { exact: true });
    this.postalCode = page.getByPlaceholder('Zip/Postal Code', { exact: true });
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  }

  async fillInformation(customer: { firstName: string; lastName: string; postalCode: string }) {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }
}
