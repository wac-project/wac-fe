import { Component, Event, Host, h, Prop, State, EventEmitter } from '@stencil/core';
import { Ambulance, AmbulanceManagementApi, Configuration } from '../../api/ambulance';

@Component({
  tag: 'ambulance-list-component',
  styleUrl: 'ambulance-list-component.css',
  shadow: true,
})
export class AmbulanceListComponent {
  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @State() errorMessage: string;
  ambulances: any[];

  private async getAmbulancesAsync(): Promise<Ambulance[]> {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const ambulanceApi = new AmbulanceManagementApi(configuration);
      const response = await ambulanceApi.getAmbulancesRaw();
      if (response.raw.status < 299) {
        return await response.value();
      } else {
        this.errorMessage = `Cannot retrieve list of ambulances: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of ambulances: ${err.message || 'unknown'}`;
    }
    return [];
  }

  private async refreshAmbulances() {
    this.ambulances = await this.getAmbulancesAsync();
  }

  async componentWillLoad() {
    this.ambulances = await this.getAmbulancesAsync();
  }

  render() {
    return (
      <Host>
        <div class="table-container">
          <table>
            <thead>
            <tr>
              <th>Ambulancia</th>
              <th>Lekár</th>
              <th>Štatistiky</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {this.ambulances.map((ambulance) => (
              <tr>
                <td>{ambulance.name}</td>
                <td>{ambulance.driverName}</td>
                <td>
                  <button part="stats-button" onClick={() => console.log('Show stats for', ambulance.id)}>
                    Štatistiky
                  </button>
                </td>
                <td>
                  <md-filled-icon-button className="edit-button"
                                         onClick={() => this.entryClicked.emit(ambulance.id)}>
                    <md-icon>edit</md-icon>
                  </md-filled-icon-button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
          <md-filled-icon-button className="add-button"
                                 onclick={() => this.entryClicked.emit('@new')}>
            <md-icon>add</md-icon>
          </md-filled-icon-button>
          <button class="refresh-button" part="stats-button" onClick={() => this.refreshAmbulances()}>
            Obnoviť zoznam
          </button>
        </div>
      </Host>
    );
  }
}
