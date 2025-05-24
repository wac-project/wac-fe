import { Component, Host, h, EventEmitter, Event, Prop, State } from '@stencil/core';
import { Procedure, ProcedureManagementApi, Configuration, Ambulance, AmbulanceManagementApi } from '../../api/ambulance'; // Added Ambulance and AmbulanceManagementApi

@Component({
  tag: 'procedure-editor-component',
  styleUrl: 'procedure-editor-component.css',
  shadow: true,
})
export class ProcedureEditorComponent {
  @Prop() procedureId!: string;
  @Prop() apiBase!: string;

  @Event({ eventName: 'procedure-editor-closed' }) editorClosed!: EventEmitter<string>;

  @State() entry!: Procedure;
  @State() errorMessage = '';
  @State() isValid = false;
  @State() ambulances: Ambulance[] = []; // State to hold the list of ambulances
  @State() selectedAmbulanceId: string = ''; // State to manage the selected ambulance in the combobox

  private formElement!: HTMLFormElement;

  async componentWillLoad() {
    await this.loadAmbulances(); // Load ambulances first
    await this.loadProcedure(); // Then load the procedure
  }

 
  private async loadAmbulances() {
    try {
      const api = new AmbulanceManagementApi(
        new Configuration({ basePath: this.apiBase })
      );
      this.ambulances = await api.ambulancesGet();
    } catch (err: any) {
      this.errorMessage = `Error loading ambulances: ${err.message || 'unknown'}`;

    }
  }
  

  /**
   * Loads the procedure data for editing, or initializes a new procedure.
   */
  private async loadProcedure() {
    this.errorMessage = '';

    if (this.procedureId === '@new') {
      this.entry = {
        id: '@new',
        description: '',
        patient: '',
        price: 0,
        visitType: '',
        payer: '',
        ambulanceId: '', // Initialize with empty string for new procedure
      };
      this.isValid = false;
      // For a new procedure, the combobox should initially show no selection or a default.
      // We don't set selectedAmbulanceId here, it will remain empty.
      return;
    }

    

    if (!this.procedureId) {
      this.errorMessage = 'No procedure ID provided';
      this.isValid = false;
      return;
    }

    try {
      const api = new ProcedureManagementApi(
        new Configuration({ basePath: this.apiBase })
      );
      this.entry = await api.proceduresIdGet({ id: this.procedureId });
      this.isValid = true;
      // If loading an existing procedure, set the selectedAmbulanceId to pre-select the combobox
      this.selectedAmbulanceId = this.entry.ambulanceId || '';
    } catch (err: any) {
      this.errorMessage = `Error loading procedure: ${err.message || 'unknown'}`;
      this.isValid = false;
    }
  }

  /**
   * Handles input changes for all form fields, including the new combobox.
   */
  private handleInput(ev: Event) {
    const tgt = ev.target as HTMLInputElement | HTMLSelectElement; // Include HTMLSelectElement for combobox
    const { name, value } = tgt;

    if (name === 'price') {
      this.entry.price = parseFloat(value) || 0;
    } else if (name === 'ambulanceId') {
      // Handle the combobox selection
      this.entry.ambulanceId = value;
      this.selectedAmbulanceId = value; // Update the state that controls the combobox's value
    }
    else {
      // @ts-ignore
      this.entry[name] = value;
    }

    this.isValid = this.formElement.checkValidity();
  }

  /**
   * Saves the procedure (creates new or updates existing).
   */
  private async save() {
    this.errorMessage = '';
    // Ensure ambulanceId is set before saving
    if (!this.entry.ambulanceId) {
      this.errorMessage = 'Please select an ambulance.';
      return;
    }

    try {
      const api = new ProcedureManagementApi(
        new Configuration({ basePath: this.apiBase })
      );

      if (this.procedureId === '@new') {
        const { id, ...createPayload } = this.entry;
        await api.proceduresPost({ procedure: createPayload as any });
      } else {
        await api.proceduresIdPut({ id: this.procedureId, procedure: this.entry });
      }

      this.editorClosed.emit('store');
    } catch (err: any) {
      this.errorMessage = `Save error: ${err.message || 'unknown'}`;
    }
  }

  /**
   * Deletes the current procedure.
   */
  private async deleteEntry() {
    this.errorMessage = '';
    try {
      const api = new ProcedureManagementApi(
        new Configuration({ basePath: this.apiBase })
      );
      await api.proceduresIdDelete({ id: this.procedureId });
      this.editorClosed.emit('delete');
    } catch (err: any) {
      this.errorMessage = `Delete error: ${err.message || 'unknown'}`;
    }
  }

  render() {
    if (this.errorMessage) {
      return (
        <Host>
          <div class="error">{this.errorMessage}</div>
        </Host>
      );
    }
    // Show loading state if entry or ambulances are not yet loaded
    if (!this.entry || this.ambulances.length === 0) {
      return (
        <Host>
          <div class="loading">Načítavam...</div>
        </Host>
      );
    }

    return (
      <Host>
        <div class="form-container">
          <form ref={el => (this.formElement = el as HTMLFormElement)}>
            <md-filled-text-field
              name="description"
              label="Popis výkonu"
              required
              value={this.entry.description}
              onInput={ev => this.handleInput(ev)}
            />
            <md-filled-text-field
              name="patient"
              label="Pacient"
              required
              value={this.entry.patient}
              onInput={ev => this.handleInput(ev)}
            />
            <md-filled-text-field
              name="price"
              label="Cena"
              type="number"
              min="0"
              step="0.01"
              required
              value={String(this.entry.price)}
              onInput={ev => this.handleInput(ev)}
            />
            <md-filled-text-field
              name="visitType"
              label="Typ návštevy"
              required
              value={this.entry.visitType}
              onInput={ev => this.handleInput(ev)}
            />
            <md-filled-text-field
              name="payer"
              label="Plátca"
              required
              value={this.entry.payer}
              onInput={ev => this.handleInput(ev)}
            />

            <md-filled-select
              label="Ambulancia"
              name="ambulanceId"
              required
              value={this.selectedAmbulanceId} // Bind to selectedAmbulanceId state
              onInput={ev => this.handleInput(ev)}
            >
              {/* Default option */}
              <md-select-option value="" disabled selected={!this.selectedAmbulanceId}>
                <div slot="headline">Vyberte ambulanciu</div>
              </md-select-option>
              {/* Dynamically generated options from fetched ambulances */}
              {this.ambulances.map(ambulance => (
                <md-select-option value={ambulance.id} selected={this.selectedAmbulanceId === ambulance.id}>
                  <div slot="headline">{ambulance.name || ambulance.id}</div> {/* Use ambulance.name for display, fallback to id */}
                </md-select-option>
              ))}
            </md-filled-select>

          </form>

          <md-divider inset />

          <div class="actions">
            <md-filled-tonal-button
              id="delete"
              disabled={this.procedureId === '@new'}
              onClick={() => this.deleteEntry()}
            >
              <md-icon slot="icon">delete</md-icon>
              Zmazať
            </md-filled-tonal-button>
            <span class="stretch-fill" />
            <md-outlined-button id="cancel" onClick={() => this.editorClosed.emit('cancel')}>
              Zrušiť
            </md-outlined-button>
            <md-filled-button
              id="confirm"
              disabled={!this.isValid}
              onClick={() => this.save()}
            >
              <md-icon slot="icon">save</md-icon>
              Uložiť
            </md-filled-button>
          </div>
        </div>
      </Host>
    );
  }
}
