import { Component, Host, Prop, State, h } from '@stencil/core';

declare global {
  interface Window {
    navigation: any;
  }
}

@Component({
  tag: 'app-component',
  styleUrl: 'app-component',
  shadow: true,
})
export class AppComponent {
  @State() private relativePath = '';

  @Prop() basePath: string = '';
  @Prop() apiBase: string;

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || '/').pathname;

    const toRelative = (path: string) => {
      if (path.startsWith(baseUri)) {
        this.relativePath = path.slice(baseUri.length);
      } else {
        this.relativePath = '';
      }
    };

    window.navigation?.addEventListener('navigate', (ev: Event) => {
      if ((ev as any).canIntercept) {
        (ev as any).intercept();
      }
      let path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
    });

    toRelative(location.pathname);
  }

  render() {
    let element = 'ambulances';
    let ambulanceId = '@new';

    if (this.relativePath.startsWith('entry/')) {
      element = 'editor';
      ambulanceId = this.relativePath.split('/')[1];
    }

    const navigate = (path: string) => {
      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
      window.navigation.navigate(absolute);
    };

    switch (element) {
      case 'ambulances':
        return (
          <Host>
            <ambulance-list-component api-base={this.apiBase}
                                      onentry-clicked={(ev: CustomEvent<string>) => navigate('./entry/' + ev.detail)}>
            </ambulance-list-component>
          </Host>
        );
      case 'editor':
        return (
          <Host>
            <ambulance-editor-component ambulance-id={ambulanceId}
                                        api-base={this.apiBase}
                                        oneditor-closed={() => navigate('./list')}
            ></ambulance-editor-component>
          </Host>
        );
    }

  }
}
