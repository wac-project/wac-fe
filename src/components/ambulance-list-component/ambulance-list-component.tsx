import { Component, Host, State, h } from '@stencil/core';

@Component({
  tag: 'ambulance-list-component',
  styleUrl: 'ambulance-list-component.css',
  shadow: true,
})
export class AmbulanceListComponent {
  @State() ambulances: any[];

  private async getAmbulancesAsync() {
    return await Promise.resolve([
      {
        name: 'Ambulancia 1',
        ambulanceId: '10001',
        createdAt: new Date(Date.now() + 65 * 60),
        lekar: 'Dr 1',
      },
      {
        name: 'Ambulancia 2',
        ambulanceId: '10096',
        createdAt: new Date(Date.now() + 30 * 60),
        lekar: 'Dr 2',
      },
      {
        name: 'Ambulancia 3',
        ambulanceId: '10028',
        createdAt: new Date(Date.now() + 5 * 60),
        lekar: 'Dr 3',
      },
    ]);
  }

  private async refreshAmbulances() {
    this.ambulances = await this.getAmbulancesAsync();
  }

  async componentWillLoad() {
    await this.refreshAmbulances();
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
              </tr>
            </thead>
            <tbody>
              {this.ambulances.map((ambulance) => (
                <tr>
                  <td>{ambulance.name}</td>
                  <td>{ambulance.lekar}</td>
                  <td>
                    <button part="stats-button" onClick={() => console.log('Show stats for', ambulance.ambulanceId)}>
                      Štatistiky
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button class="refresh-button" part="stats-button" onClick={() => this.refreshAmbulances()}>
            Obnoviť zoznam
          </button>
        </div>
      </Host>
    );
  }
}