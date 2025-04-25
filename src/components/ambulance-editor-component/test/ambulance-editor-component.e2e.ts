import { newE2EPage } from '@stencil/core/testing';

describe('ambulance-editor-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ambulance-editor-component></ambulance-editor-component>');

    const element = await page.find('ambulance-editor-component');
    expect(element).toHaveClass('hydrated');
  });
});
