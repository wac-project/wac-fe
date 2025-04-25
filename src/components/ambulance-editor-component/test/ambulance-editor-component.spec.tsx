import { newSpecPage } from '@stencil/core/testing';
import { AmbulanceEditorComponent } from '../ambulance-editor-component';

describe('ambulance-editor-component', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AmbulanceEditorComponent],
      html: `<ambulance-editor-component></ambulance-editor-component>`,
    });
    expect(page.root).toEqualHtml(`
      <ambulance-editor-component>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ambulance-editor-component>
    `);
  });
});
