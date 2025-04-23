import { Component, Host, State, h } from '@stencil/core';
import '@material/web/list/list'
import '@material/web/list/list-item'
import '@material/web/icon/icon'

@Component({
  tag: 'ambulance-list-component',
  styleUrl: 'ambulance-list-component.css',
  shadow: true,
})
export class AmbulanceListComponent {

  @State() ambulances: any[];

  private async getAmbulancesAsync(){
    return await Promise.resolve(
      [{
          name: 'Ambulancia 1',
          ambulanceId: '10001',
          createdAt: new Date(Date.now() + 65 * 60),
          lekar: "Dr 1",
      }, {
          name: 'Ambulancia 2',
          ambulanceId: '10096',
          createdAt: new Date(Date.now() + 30 * 60),
          lekar: "Dr 2",
      }, {
          name: 'Ambulancia 3',
          ambulanceId: '10028',
          createdAt: new Date(Date.now() + 5 * 60),
          lekar: "Dr 3",
      }]
    );
  }

  async componentWillLoad() {
    this.ambulances = await this.getAmbulancesAsync();
  }

  render() {
    return (
      <Host>
        <md-list>
          {this.ambulances.map(ambulance =>
            <md-list-item>
              <div slot="headline">{ambulance.name}</div>
              <div slot="supporting-text">{"Lekár ambulancie: " + ambulance.lekar?.toLocaleString()}</div>
                <md-icon slot="start">Ambulance</md-icon>
            </md-list-item>
          )}
        </md-list>
      </Host>
    );
  }
}
