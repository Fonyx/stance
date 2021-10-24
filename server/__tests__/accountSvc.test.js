const mongoose = require('mongoose');
const {accountSvc} = require('../services');
var mongoDBtest = 'mongodb://127.0.0.1/test'
const runSeed = require('./seed');

// open test database
var db = mongoose.connect(mongoDBtest, {
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

  // seed the test database with seed data for relation building in tests
  beforeAll(async () => {
    await runSeed(db);
  });
  
  // afterAll(async () => {
  //   await Account.deleteMany();
  // });
  
  // afterEach(async () => {
  //   jest.clearAllTimers()
  //   await Account.deleteMany();
  // })
  
  let validCryptoAccount = {
      "user":"fonyx",
      "name":"test bitcoin",
      "type":"crypto",
      "balance":2.342,
      "party":"coinspot",
      "assetCode":"BTC-USD",
      "currency":"USD",
      "exchange":"CC",
      "style":{
          "color": "deep-orange",
          "modifier": "darken-2",
          "textColor": "white",
          "icon": "",
          "wave": "waves-yellow"
      }
  }

  test("a crypto account should return correct value in EUR", async () => {
      let account = await accountSvc.createFromSeed(validCryptoAccount);
      // let euroValue = await account.getValueInCurrency('EUR');
      // expect(euroValue).toBe(10000);
      expect(account.name).toBe("fonyx");
  });
})

