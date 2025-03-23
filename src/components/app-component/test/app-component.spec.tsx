import { newSpecPage } from '@stencil/core/testing';
import { AppComponent } from '../app-component';

describe('app-component', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppComponent],
      html: `<app-component></app-component>`,
    });
    expect(page.root).toEqualHtml(`
      <app-component>
        <mock:shadow-root>
        <ambulance-list-component></ambulance-list-component>
        </mock:shadow-root>
      </app-component>
    `);
  });
});
