import React from 'react';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';
import Button from './Button';
const supportChainIds = [4];

const connectors = {
  injected: {},
};

function Connect(){

    return(
      <ThirdwebWeb3Provider connectors={connectors} supportChainIds={supportChainIds}>

        <Button />

      </ThirdwebWeb3Provider>
    );


}

export default Connect;
