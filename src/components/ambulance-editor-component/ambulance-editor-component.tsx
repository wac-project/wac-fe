import { Component, Host, h, EventEmitter, Event, Prop, State } from '@stencil/core';
import { Ambulance, AmbulanceManagementApi, Configuration } from '../../api/ambulance';

@Component({
  tag: 'ambulance-editor-component',
  styleUrl: 'ambulance-editor-component.css',
  shadow: true,
})

export class AmbulanceEditorComponent {
  @Prop() ambulanceId: string;
  @Prop() apiBase: string;

  @Event({ eventName: 'editor-closed' }) editorClosed: EventEmitter<string>;

  @State() entry: Ambulance;
  @State() errorMessage: string;
  @State() isValid: boolean;

  private formElement: HTMLFormElement;

  async componentWillLoad() {
    this.getAmbulanceAsync();
  }

  private async getAmbulanceAsync(): Promise<Ambulance> {
    console.log(this.ambulanceId);
    if (this.ambulanceId === '@new') {
      this.isValid = false;
      this.entry = {
        id: '@new',
        name: '',
        location: '',
        driverName: '',
      };
      return this.entry;
    }
    if (!this.ambulanceId) {
      this.isValid = false;
      return undefined;
    }
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const ambulanceApi = new AmbulanceManagementApi(configuration);

      const response = await ambulanceApi.getAmbulanceByIdRaw({ ambulanceId: this.ambulanceId });

      if (response.raw.status < 299) {
        this.entry = await response.value();
        this.isValid = true;
      } else {
        this.errorMessage = `Cannot retrieve ambulance with id ${this.ambulanceId}: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve ambulance with id ${this.ambulanceId}: ${err.message || 'unknown'}`;
    }
    return undefined;
  }

  render() {
    if (this.errorMessage) {
      return (
        <Host>
          <div class="error">{this.errorMessage}</div>
        </Host>
      );
    }
    return (
      <Host>
        <form ref={el => this.formElement = el}>
          <md-filled-text-field label="Názov ambulancie"
                                required value={this.entry?.name}
                                oninput={(ev: InputEvent) => {
                                  if (this.entry) {
                                    this.entry.name = this.handleInputEvent(ev);
                                  }
                                }}>
            <md-icon slot="leading-icon">person</md-icon>
          </md-filled-text-field>

          <md-filled-text-field label="Adresa"
                                required value={this.entry?.location}
                                oninput={(ev: InputEvent) => {
                                  if (this.entry) {
                                    this.entry.location = this.handleInputEvent(ev);
                                  }
                                }}>
            <md-icon slot="leading-icon">fingerprint</md-icon>
          </md-filled-text-field>

          <md-filled-text-field label="Adresa"
                                required value={this.entry?.driverName}
                                oninput={(ev: InputEvent) => {
                                  if (this.entry) {
                                    this.entry.driverName = this.handleInputEvent(ev);
                                  }
                                }}>
            <md-icon slot="leading-icon">fingerprint</md-icon>
          </md-filled-text-field>

        </form>

        <md-divider inset></md-divider>

        <div class="actions">
          <md-filled-tonal-button id="delete" disabled={!this.entry}
                                  onClick={() => this.deleteEntry()}>
            <md-icon slot="icon">delete</md-icon>
            Zmazať
          </md-filled-tonal-button>
          <span class="stretch-fill"></span>
          <md-outlined-button id="cancel"
                              onClick={() => this.editorClosed.emit('cancel')}>
            Zrušiť
          </md-outlined-button>
          <md-filled-button id="confirm" disabled={!this.isValid}
                            onClick={() => this.updateEntry()}
          >
            <md-icon slot="icon">save</md-icon>
            Uložiť
          </md-filled-button>
        </div>
      </Host>
    );
  }

  private handleInputEvent(ev: InputEvent): string {
    const target = ev.target as HTMLInputElement;
    // check validity of elements
    this.isValid = true;
    for (let i = 0; i < this.formElement.children.length; i++) {
      const element = this.formElement.children[i];
      if ('reportValidity' in element) {
        const valid = (element as HTMLInputElement).reportValidity();
        this.isValid &&= valid;
      }
    }
    return target.value;
  }


  private async updateEntry() {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const ambulanceApi = new AmbulanceManagementApi(configuration);

      const response = this.ambulanceId == '@new' ?
        await ambulanceApi.createAmbulanceRaw({ ambulance: this.entry }) :
        await ambulanceApi.updateAmbulanceRaw({
          ambulanceId: this.ambulanceId,
          ambulance: this.entry,
        });

      if (response.raw.status < 299) {
        this.editorClosed.emit('store');
      } else {
        this.errorMessage = `Cannot store entry: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot store entry: ${err.message || 'unknown'}`;
    }
  }

  private async deleteEntry() {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const ambulanceApi = new AmbulanceManagementApi(configuration);

      const response = await ambulanceApi.deleteAmbulanceRaw({ ambulanceId: this.ambulanceId });
      if (response.raw.status < 299) {
        this.editorClosed.emit('delete');
      } else {
        this.errorMessage = `Cannot delete entry: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot delete entry: ${err.message || 'unknown'}`;
    }
  }
}
