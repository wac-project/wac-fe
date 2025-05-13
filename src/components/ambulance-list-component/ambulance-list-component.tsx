import { Component, Event, Host, h, Prop, State, EventEmitter } from '@stencil/core';
import { Ambulance, AmbulanceManagementApi, Configuration, Procedure, ProcedureManagementApi } from '../../api/ambulance';

@Component({
  tag: 'ambulance-list-component',
  styleUrl: 'ambulance-list-component.css',
  shadow: true,
})
export class AmbulanceListComponent {
  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @State() errorMessage: string;
  @State() ambulances: Ambulance[] = [];
  @State() procedures: Procedure[] = [];
  @State() selectedAmbulanceId: string | null = null;

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

  private async getProceduresAsync(ambulanceId: string): Promise<Procedure[]> {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });

      const procedureApi = new ProcedureManagementApi(configuration); // Use ProcedureManagementApi
      const response = await procedureApi.getProceduresRaw(); // Correct method call
      if (response.raw.status < 299) {
        const procedures = await response.value();
        // Filter procedures by ambulanceId (client-side)
        return procedures.filter((procedure) => procedure.ambulanceId === ambulanceId);
      } else {
        this.errorMessage = `Cannot retrieve list of procedures: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of procedures: ${err.message || 'unknown'}`;
    }
    return [];
  }

  private async refreshAmbulances() {
    this.ambulances = await this.getAmbulancesAsync();
  }

  private async showProcedures(ambulanceId: string) {
    this.selectedAmbulanceId = ambulanceId;
    this.procedures = await this.getProceduresAsync(ambulanceId);
  }

  private goBack() {
    this.selectedAmbulanceId = null;
    this.procedures = [];
  }

  async componentWillLoad() {
    this.ambulances = await this.getAmbulancesAsync();
  }

  render() {
    return (
      <Host>
        <div class="table-container">
          {this.selectedAmbulanceId ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Pacient</th>
                    <th>Typ návštevy</th>
                    <th>Cena</th>
                    <th>Platca</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.procedures.length > 0 ? (
                    this.procedures.map((procedure) => (
                      <tr>
                        <td>{procedure.patient}</td>
                        <td>{procedure.visitType}</td>
                        <td>{procedure.price}</td>
                        <td>{procedure.payer}</td>
                        <td>
                          <md-filled-icon-button
                            className="edit-button"
                            onClick={() => this.entryClicked.emit(procedure.id)}
                          >
                            <md-icon>edit</md-icon>
                          </md-filled-icon-button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>Žiadne výkony pre túto ambulanciu.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <md-filled-icon-button
                className="add-button"
                onClick={() => this.entryClicked.emit('@new')}
              >
                <md-icon>add</md-icon>
              </md-filled-icon-button>
              <button class="refresh-button" part="stats-button" onClick={() => this.goBack()}>
                Späť
              </button>
            </>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Ambulancia</th>
                    <th>Lekár</th>
                    <th>Vykony</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.ambulances.map((ambulance) => (
                    <tr>
                      <td>{ambulance.name}</td>
                      <td>{ambulance.driverName}</td>
                      <td>
                        <button
                          part="stats-button"
                          onClick={() => this.showProcedures(ambulance.id)}
                        >
                          Vykony
                        </button>
                      </td>
                      <td>
                        <md-filled-icon-button
                          className="edit-button"
                          onClick={() => this.entryClicked.emit(ambulance.id)}
                        >
                          <md-icon>edit</md-icon>
                        </md-filled-icon-button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <md-filled-icon-button
                className="add-button"
                onClick={() => this.entryClicked.emit('@new')}
              >
                <md-icon>add</md-icon>
              </md-filled-icon-button>
              <button
                class="refresh-button"
                part="stats-button"
                onClick={() => this.refreshAmbulances()}
              >
                Obnoviť zoznam
              </button>
            </>
          )}
          {this.errorMessage && <div class="error-message">{this.errorMessage}</div>}
        </div>
      </Host>
    );
  }
}