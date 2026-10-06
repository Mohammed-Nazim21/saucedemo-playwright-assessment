import { expect } from "@playwright/test";

// Integer cents keep the displayed-money comparison exact.
export function amountInCents(text: string): number {
  const match = text.match(/\$(\d+)\.(\d{2})$/);

  expect(
    match,
    `Expected a dollar amount with two decimal places: ${text}`,
  ).not.toBeNull();

  return Number(match![1]) * 100 + Number(match![2]);
}
