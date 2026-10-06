import { type Page } from '@playwright/test';

export class CartPage {
  readonly title;
  readonly items;
  readonly item;
  readonly productName;
  readonly price;
  readonly quantity;
  readonly removeButton;
  readonly continueShoppingButton;
  readonly checkoutButton;

  constructor(page: Page, productName: string) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.item = this.items.filter({
      has: page.getByText(productName, { exact: true }),
    });
    this.productName = this.item.getByTestId('inventory-item-name');
    this.price = this.item.getByTestId('inventory-item-price');
    this.quantity = this.item.getByTestId('item-quantity');
    this.removeButton = this.item.getByRole('button', { name: 'Remove', exact: true });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping', exact: true });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
