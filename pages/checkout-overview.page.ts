import { type Page } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly title;
  readonly items;
  readonly item;
  readonly productName;
  readonly price;
  readonly quantity;
  readonly subtotal;
  readonly tax;
  readonly total;
  readonly finishButton;
  readonly cancelButton;

  constructor(page: Page, productName: string) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.item = this.items.filter({
      has: page.getByText(productName, { exact: true }),
    });
    this.productName = this.item.getByTestId('inventory-item-name');
    this.price = this.item.getByTestId('inventory-item-price');
    this.quantity = this.item.getByTestId('item-quantity');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByRole('button', { name: 'Finish', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
  }

  async finish() {
    await this.finishButton.click();
  }
}
