import { newE2EPage } from '@stencil/core/testing';

describe('app-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-component></app-component>');

    const element = await page.find('app-component');
    expect(element).toHaveClass('hydrated');
  });
});
