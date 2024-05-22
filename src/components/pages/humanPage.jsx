import * as React from 'react';
import Appbar from '../bars/appBar';
import HumanConnector from '../connectors/humanConnector';

const defaultComponentStyle = {
    paddingLeft: '50px',
    paddingRight: '50px'
}

export function HumanPage() {
    return(
      <HumanConnector />
    );
}