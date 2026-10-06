import { type Page } from '@playwright/test';

export class InventoryPage {
  readonly logo;
  readonly title;
  readonly item;
  readonly productName;
  readonly price;
  readonly addButton;
  readonly removeButton;
  readonly cartLink;
  readonly cartBadge;

  constructor(page: Page, productName: string) {
    this.logo = page.getByText('Swag Labs', { exact: true });
    this.title = page.getByTestId('title');
    this.item = page.getByTestId('inventory-item').filter({
      has: page.getByText(productName, { exact: true }),
    });
    this.productName = this.item.getByTestId('inventory-item-name');
    this.price = this.item.getByTestId('inventory-item-price');
    this.addButton = this.item.getByRole('button', { name: 'Add to cart', exact: true });
    this.removeButton = this.item.getByRole('button', { name: 'Remove', exact: true });
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async addToCart() {
    await this.addButton.click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
