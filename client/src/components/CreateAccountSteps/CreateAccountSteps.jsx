import React, {useState} from 'react';
import CoreDetails from './CoreDetails';
import SpecificMoneyDetails from './SpecificMoneyDetails';
import SpecificAssetDetails from './SpecificAssetDetails';
import {QUERY_GET_ALL_PRIMITIVES} from '../../utils/queries';
import { useQuery } from '@apollo/client';

const initialFormState = {
  type: 'money',
  name: '',
  openingBalance: 0,
  interestRate: null,
  compounds: 'monthly',
  party: null,
  currency: '',
  exchange: '',
  assetCode: '',
}

export default function AccountForm (){

  const [formState, setFormState] = useState(initialFormState);
  const [step, setStep] = useState(1);

  const {loading, data} = useQuery(QUERY_GET_ALL_PRIMITIVES, {});

  const parties = data?.getAllPrimitives.parties || [];
  const currencies = data?.getAllPrimitives.currencies || [];
  const exchanges = data?.getAllPrimitives.exchanges || [];
  
  // Proceed to next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Go back to prev step
  const prevStep = () => {
    const { step } = formState;
    setStep(step - 1);
  };

  console.log('State is: ', formState)

  // Handle fields change
  const handleChange = input => e => {
    console.log('Handling Change');
    console.log(input, e)

    // case for when an event has a target.value
    setFormState({
      ...formState,
      [input]: e.target.value
      });
  };

  const handleSelectParty = () => e => {
    console.log('Handling Exchange change');
    console.log('event: ',e);

    let partyName = e.target.textContent;
    let partyId = ''

    console.log('Party Name of event: ', partyName);

    if(partyName){
      let party = parties.find(party => party.name === partyName);
      partyId = party._id;
    } else {
      partyId = ''
    }
    console.log('PartyId after filtering data: ', partyId);
    

    setFormState({
      ...formState,
      'party': partyId
    });
  };

  const handleSelectCurrency = () => e => {
    console.log('Handling Currency change');
    console.log('event: ',e);

    let CurrencyName = e.target.textContent;
    let currencyId = ''

    console.log('Currency Name of event: ', CurrencyName);

    if(CurrencyName){
      let currency = currencies.find(currency => currency.name === CurrencyName);
      currencyId = currency._id;
    } else {
      currencyId = ''
    }
    console.log('CurrencyId after filtering data: ', currencyId);
    

    setFormState({
      ...formState,
      'currency': currencyId
    });
  }

  const handleSelectExchange = () => e => {
    console.log('Handling Exchange change');
    console.log('event: ',e);

    let exchangeName = e.target.textContent;
    let exchangeCode = ''

    console.log('Exchange Name of event: ', exchangeName);

    if(exchangeName){
      let exchange = exchanges.find(exchange => exchange.name === exchangeName);
      exchangeCode = exchange.code;
    } else {
      exchangeCode = ''
    }
    console.log('Exchange after filtering data: ', exchangeCode);
    

    setFormState({
      ...formState,
      'exchange': exchangeCode
    });
  }

  const { type, name, openingBalance, interestRate, compounds, party, currency, exchange, assetCode } = formState;
  const values = { type, name, openingBalance, interestRate, compounds, party, currency, exchange, assetCode };

  if(loading){
    return ( 
      <div>Loading Your Data</div>
    )
  }

  switch (step) {
    case 1:
      return (
        <CoreDetails parties={parties} values={values} handleChange={handleChange} handleSelectChange={handleSelectParty} nextStep={nextStep}/>
      );
    case 2:
      return (
        (values.type === 'money')
        ? <SpecificMoneyDetails values={values} currencies={currencies} handleSelectCurrency={handleSelectCurrency} nextStep={nextStep} prevStep={prevStep} handleChange={handleChange}/>

        : <SpecificAssetDetails values={values} exchanges={exchanges} handleSelectExchange={handleSelectExchange} nextStep={nextStep} prevStep={prevStep} handleChange={handleChange}/>
      );
    case 3:
      return (
        <div>
          <h2>Now add extra details</h2>
        </div>
      );
    case 4:
      return (
        <div>
          <h2>Now you are done</h2>
        </div>
      )
    default:
      (console.log('This is a multi-step form built with React.'))
  }
}
