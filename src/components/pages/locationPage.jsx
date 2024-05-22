import * as React from 'react';
import Appbar from '../bars/appBar';
import LocationСonnector from '../connectors/locationConnector';

const defaultComponentStyle = {
    paddingLeft: '50px',
    paddingRight: '50px'
}

export function LocationPage() {
    return(
      <LocationСonnector/>
    );
}