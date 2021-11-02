import React, {useState} from 'react';
import CoreDetails from './CoreDetails';
import {QUERY_GET_ALL_PRIMITIVES} from '../../utils/queries';
import { useQuery } from '@apollo/client';

const initialFormState = {
  type: 'money',
  name: '',
  openingBalance: 0,
  interestRate: null,
  compounds: 'monthly',
  party: null,
  currencyCode: null,
  exchange: null
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

  const handleSelectParty = (input) => e => {
    console.log('Handling Autocomplete change');

    let selectionId = e.target.dataset.optionIndex;
    let selectionParty = parties[selectionId];
    
    setFormState({
      ...formState,
      [input]: selectionParty._id
      });
  }

  const { type, name, openingBalance, interestRate, compounds, party, currencyCode, exchange } = formState;
  const values = { type, name, openingBalance, interestRate, compounds, party, currencyCode, exchange };

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
        <div>
          <h2>Now add specifics</h2>
        </div>
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
