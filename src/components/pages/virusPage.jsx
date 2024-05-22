import * as React from 'react';
import Appbar from '../bars/appBar';
import VirusesConnector from '../connectors/virusConnector';

const defaultComponentStyle = {
    paddingLeft: '50px',
    paddingRight: '50px'
}

export function VirusPage() {
    return(
      <VirusesConnector/>
    );
}