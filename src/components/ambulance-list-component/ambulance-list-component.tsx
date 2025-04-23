import { Component, Host, State, h } from '@stencil/core';

@Component({
  tag: 'ambulance-list-component',
  styleUrl: 'ambulance-list-component.css',
  shadow: true,
})
export class AmbulanceListComponent {
  @State() ambulances: any[];

  // This will be the real API call to fetch ambulances when it's ready
  // private async fetchAmbulancesFromApi() {
  //   try {
  //     const response = await fetch('https://your-api-endpoint.com/api/ambulances');
  //     const data = await response.json();
  //     this.ambulances = data;
  //   } catch (error) {
  //     console.error('Error fetching ambulances:', error);
  //   }
  // }

  private async getAmbulancesAsync() {
    // Mocked data until the real API is ready
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

  async componentWillLoad() {
    this.ambulances = await this.getAmbulancesAsync();
  }

  render() {
    return (
      <Host>
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
      </Host>
    );
  }
}
