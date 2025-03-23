import { newE2EPage } from '@stencil/core/testing';

describe('ambulance-list-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ambulance-list-component></ambulance-list-component>');

    const element = await page.find('ambulance-list-component');
    expect(element).toHaveClass('hydrated');
  });
});
