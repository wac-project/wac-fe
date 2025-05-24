// src/components/header-component/header-nav-component.tsx
import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'header-nav-component',
  styleUrl: 'header-nav-component.css',
  shadow: true,
})
export class HeaderNavComponent {
  @Prop() basePath: string = '';

  private navigate(path: string) {
    const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
    // pushState so AppComponent sees it
    window.history.pushState({}, '', absolute);
    // dispatch a popstate so AppComponent.updateView() runs
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    return (
      <Host>
        <header class="header">
          <div class="nav-container">
            <div class="brand">Informačný systém zdravotných výkonov</div>
            <nav class="menu">
              <ul>
                <li>
                  <a
                    // href="/ambulances"
                    class="nav-button"
                    onClick={e => {
                      e.preventDefault();
                      this.navigate('./ambulances');
                    }}
                  >
                    Ambulancie
                  </a>
                </li>
                <li>
                  <a
                    // href="/payments"
                    class="nav-button"
                    onClick={e => {
                      e.preventDefault();
                      this.navigate('./payments');
                    }}
                  >
                    Payments
                  </a>
                </li>
                <li>
                  <a
                    // href="/procedures"
                    class="nav-button"
                    onClick={e => {
                      e.preventDefault();
                      this.navigate('./procedures');
                    }}
                  >
                    Procedures
                  </a>
                </li>
                <li>
                  <a
                    // href="/logout"
                    class="nav-button"
                    onClick={e => {
                      e.preventDefault();
                      this.navigate('./logout');
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </Host>
    );
  }
}
