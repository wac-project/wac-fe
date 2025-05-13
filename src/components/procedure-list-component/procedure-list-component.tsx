import { Component, Event, EventEmitter, Host, h, Prop, State } from '@stencil/core';
import {
  Procedure,
  ProcedureManagementApi,
  AmbulanceManagementApi,
  Configuration,
} from '../../api/ambulance';

@Component({
  tag: 'procedure-list-component',
  styleUrl: 'procedure-list-component.css',
  shadow: true,
})
export class ProcedureListComponent {
  /** Emitted with the procedure ID or '@new' */
  @Event({ eventName: 'procedure-clicked' }) procedureClicked!: EventEmitter<string>;

  /** Base URL for your API endpoints */
  @Prop() apiBase!: string;

  /**
   * If provided, only procedures for this ambulance are shown.
   * Otherwise all procedures are listed.
   */
  @Prop() ambulanceId?: string;

  @State() procedures: Procedure[] = [];
  @State() isLoading = false;
  @State() errorMessage = '';

  private get procApiClient(): ProcedureManagementApi {
    return new ProcedureManagementApi(new Configuration({ basePath: this.apiBase }));
  }

  private get ambApiClient(): AmbulanceManagementApi {
    return new AmbulanceManagementApi(new Configuration({ basePath: this.apiBase }));
  }

  async componentWillLoad() {
    await this.fetchProcedures();
  }

  private async fetchProcedures() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      if (this.ambulanceId) {
        this.procedures = await this.ambApiClient.getProceduresByAmbulance({ ambulanceId: this.ambulanceId });
      } else {
        this.procedures = await this.procApiClient.proceduresGet();
      }
    } catch (err: any) {
      this.errorMessage = `Unable to load procedures: ${err.message}`;
      this.procedures = [];
    } finally {
      this.isLoading = false;
    }
  }

  private onRefresh = () => this.fetchProcedures();
  private onAddNew = () => this.procedureClicked.emit('@new');
  private onEdit = (id: string) => () => this.procedureClicked.emit(id);

  render() {
    return (
      <Host>
        {this.errorMessage && <div class="error">{this.errorMessage}</div>}

        {this.isLoading ? (
          <div class="loading-spinner">Loading...</div>
        ) : (
          <div class="table-container">
            <div class="name-container">
              <h2>
                Procedures{this.ambulanceId ? ` for Ambulance ${this.ambulanceId}` : ''}
              </h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Patient</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.procedures.map(p => (
                  <tr key={p.id}>
                    <td>{p.description}</td>
                    <td>{p.patient}</td>
                    <td>{p.price.toFixed(2)}</td>
                    <td class="actions-cell">
                      <md-filled-icon-button
                        class="icon-btn"
                        onClick={this.onEdit(p.id)}
                      >
                        <md-icon>edit</md-icon>
                      </md-filled-icon-button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div class="actions-bar">
              <md-filled-icon-button class="icon-btn" onClick={this.onAddNew}>
                <md-icon>add</md-icon>
              </md-filled-icon-button>
              <button class="refresh-btn" onClick={this.onRefresh}>
                Refresh List
              </button>
            </div>
          </div>
        )}
      </Host>
    );
  }
}
