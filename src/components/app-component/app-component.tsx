import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-component',
  styleUrl: 'app-component.css',
  shadow: true,
})
export class AppComponent {
  render() {
    return (
      <Host>
        <header-nav-component></header-nav-component>
        <ambulance-list-component></ambulance-list-component>
      </Host>
    );
  }
}
