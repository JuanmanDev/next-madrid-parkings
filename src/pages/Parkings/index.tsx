// eslint-disable-next-line import/no-unresolved
import './leaflet.css';

import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

import { LatLngTuple } from 'leaflet';
import { queryRule } from '../ListTableList/service';

const center: LatLngTuple = [40.416732, -3.7045862];

export default class TooltipExample extends Component<{}, { data: any[] }> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      data: [],
    };
    queryRule().then((result: any) => {
      this.setState({ data: result.data });
      // this.forceUpdate();
    });
  }

  render() {
    return (
      <div style={{ height: '1500px', maxHeight: '85vh' }}>
        <Map center={center} zoom={13} style={{ height: '1500px', maxHeight: '85vh' }}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {this.state.data.map(
            (parking): JSX.Element => (
              <Marker position={[parking.location.latitude, parking.location.longitude]}>
                <Popup>
                  <h2 className="title is-2">{parking.title}</h2>
                  {parking.address['street-address']}
                  <br />
                  {parking.address.districtName}
                  {parking.address.areaName}
                  <br />
                  {parking.address['postal-code']}
                  {parking.address.locality}
                </Popup>
              </Marker>
            ),
          )}
        </Map>
      </div>
    );
  }
}
