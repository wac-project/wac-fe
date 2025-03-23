import { newSpecPage } from '@stencil/core/testing';
import { AmbulanceListComponent } from '../ambulance-list-component';

describe('ambulance-list-component', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AmbulanceListComponent],
      html: `<ambulance-list-component></ambulance-list-component>`,
    });
    expect(page.root).toEqualHtml(`
      <ambulance-list-component>
        <mock:shadow-root>
        Správa ambulancií
        </mock:shadow-root>
      </ambulance-list-component>
    `);
  });
});
