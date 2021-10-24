const mongoose = require('mongoose');
const {Account} = require('../models/Account');


// open test database
mongoose.connect('mongodb://localhost/stance/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

console.log('Connected to test database');

describe("Testing Account instance methods", () => {

  // beforeEach(() => {
  //   jest.useFakeTimers();
  //   jest.setTimeout(100000);
  // })

  // beforeAll(async () => {
  //   await Account.deleteMany();
  // });
  
  // afterAll(async () => {
  //   await Account.deleteMany();
  // });
  
  // afterEach(async () => {
  //   jest.clearAllTimers()
  //   await Account.deleteMany();
  // })
  
  let validCryptoAccount = {
      "name":"test bitcoin",
      "type":"crypto",
      "balance":2.342,
      "partyName":"coinspot",
      "assetCode":"BTC-USD",
      "currencyCode":"USD",
      "exchangeCode":"CC",
      "style":{
          "color": "deep-orange",
          "modifier": "darken-2",
          "textColor": "white",
          "icon": "",
          "wave": "waves-yellow"
      }
  }

  test("a crypto account should return correct value in EUR", async () => {
      // call the promised version of mongoose create
      let account = await Account.create(validCryptoAccount);
      let euroValue = await account.getValueInCurrency('EUR');
      expect(euroValue).toBe(10000);
  });
})

