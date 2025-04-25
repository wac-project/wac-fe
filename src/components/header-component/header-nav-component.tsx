import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'header-nav-component',
  styleUrl: 'header-nav-component.css',
  shadow: true,
})
export class HeaderNavComponent {
  render() {
    return (
      <Host>
        <header class="header">
          <div class="nav-container">
            <div class="brand">Informačný systém zdravotných výkonov</div>
            <nav class="menu">
              <ul>
                <li><a href="/ambulances" class="nav-button">Ambulancie</a></li>
                <li><a href="/about" class="nav-button">Logout</a></li>
              </ul>
            </nav>
          </div>
        </header>
      </Host>
    );
  }
}
