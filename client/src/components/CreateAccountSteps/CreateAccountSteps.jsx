import React, {useState} from 'react';
import CoreDetails from './CoreDetails';
import SpecificMoneyDetails from './SpecificMoneyDetails';
import SpecificCryptoDetails from './SpecificCryptoDetails';
import SpecificStockDetails from './SpecificStockDetails';
import TagGoalDetails from './TagGoalDetails';
import {QUERY_GET_ALL_PRIMITIVES} from '../../utils/queries';
import { useQuery } from '@apollo/client';
import {Container, Grid, Typography} from '@mui/material'

const initialFormState = {
  name: '',
  type: 'money',
  openingBalance: 0,
  interestRate: null,
  compounds: 'monthly',
  party: null,
  currency: '',
  exchangeCode: 'CC',
  assetCode: '',
  assetName: '',
  tags: '',
  goalAmount: 0,
  goalDate: ''
}

export default function AccountForm (){

  const [formState, setFormState] = useState(initialFormState);
  const [step, setStep] = useState(1);

  const {loading, data} = useQuery(QUERY_GET_ALL_PRIMITIVES, {});

  const parties = data?.getAllPrimitives.parties || [];
  const currencies = data?.getAllPrimitives.currencies || [];
  const exchanges = data?.getAllPrimitives.exchanges || [];
  const cryptos = data?.getAllPrimitives.cryptos || [];

  // create list of crypto names
  let cryptoDupNames = cryptos.map((crypto) => crypto.Name);
  // create uniq list of names
  const uniqueCryptos = cryptoDupNames.filter((value, index) => cryptoDupNames.indexOf(value) === index);
  
  // Proceed to next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Go back to prev step
  const prevStep = () => {
    setStep(step - 1);
  };

  // Handle fields change
  const handleChange = input => e => {
    console.log('Handling Change');
    console.log(input, e);

    let newValue = e.target.value;

    // set the exchange FOREX if user choses money
    if(input === 'type' && newValue === 'money'){
      console.log('Setting forex exchange for money account')
      setFormState({
        ...formState,
        'exchangeCode': 'FOREX'
      });
      return
    }

    let floated = parseFloat(newValue);
    if(!isNaN(floated)){
      newValue = floated
    }

    setFormState({
      ...formState,
      [input]: newValue
    });
  };

  console.log('current Step: ',step)

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
      'exchangeCode': exchangeCode
    });
  }

  const handleSelectCrypto = () => e => {
    console.log('Handling Crypto change');
    console.log('event: ',e);

    let cryptoName = e.target.textContent;
    let cryptoCode = ''

    console.log('Crypto Name of event: ', cryptoName);

    if(cryptoName){
      let crypto = cryptos.find(crypto => crypto.Name === cryptoName);
      cryptoCode = crypto.Code;
    } else {
      cryptoCode = ''
    }
    console.log('Crypto after filtering data: ', cryptoCode);
    

    setFormState({
      ...formState,
      'assetCode': cryptoCode,
      'assetName': cryptoName
    });
  }

  const handleSelectStock = () => e => {
    console.log('Handling Crypto change');
    console.log('event: ',e);

    let assetCode = e.target.value;

    console.log('Stock Code of event: ', assetCode);
    

    setFormState({
      ...formState,
      'assetCode': assetCode,
      'assetName': assetCode
    });
  }

  const handleGoalDateChange = (date) => {
    console.log('state date: ',date);
    setFormState({
      ...formState,
      'goalDate': date
    });
  }

  const { type, name, openingBalance, interestRate, compounds, party, currency, exchangeCode, assetCode, assetName, tags, goalAmount, goalDate } = formState;
  const values = { type, name, openingBalance, interestRate, compounds, party, currency, exchangeCode, assetName, assetCode, tags, goalAmount, goalDate };

  console.log('Form state is: ',formState);

  if(loading){
    return (
        <Container>
            <Grid container paddingTop="40px">
                <Grid item>
                <Typography variant='h3' color='primary'>Loading Your Data.....Locating Assets</Typography>
                </Grid>
            </Grid>
        </Container>
    )
}

  switch (step) {
    case 1:
      return (
        <CoreDetails parties={parties} values={values} handleChange={handleChange} handleSelectChange={handleSelectParty} nextStep={nextStep}/>
      );
    case 2:
      if(values.type === 'money'){
        return (
          <SpecificMoneyDetails values={values} currencies={currencies} handleSelectCurrency={handleSelectCurrency} nextStep={nextStep} prevStep={prevStep} handleChange={handleChange}/>
        )
      } else if(values.type === 'crypto'){
        return (
          <SpecificCryptoDetails values={values} cryptos={uniqueCryptos} handleSelectCrypto={handleSelectCrypto} nextStep={nextStep} prevStep={prevStep} handleChange={handleChange}/>
        )
        
      } else if(values.type === 'stock'){
        return (
          <SpecificStockDetails values={values} exchanges={exchanges} handleSelectExchange={handleSelectExchange} nextStep={nextStep} prevStep={prevStep} handleSelectStock={handleSelectStock}/>
        )
      } else {
        return (
          <div>Empty return</div>
        )
      }
    case 3:
      return (
        <TagGoalDetails values={values} handleChange={handleChange} prevStep={prevStep} handleGoalDateChange={handleGoalDateChange}/>
      );
    default:
      (console.log('This is a multi-step form built with React.'))
  }
}
