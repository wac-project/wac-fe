import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ambulance-list-component',
  styleUrl: 'ambulance-list-component.css',
  shadow: true,
})
export class AmbulanceListComponent {
  render() {
    return (
      <Host>
        Správa ambulancií
      </Host>
    );
  }
}
