const {Account} = require('../Account');
const {MongoClient} = require('mongodb');

let connection;
let db;

// https://jestjs.io/docs/tutorial-async
beforeAll(async () => {
  connection = await MongoClient.connect(global.__MONGO_URI__);
  db = await connection.db(global.__MONGO_DB_NAME__);
});

afterAll(async () => {
  await connection.close();
  await db.close();
});


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

test("a crypto account should return correct value in EUR", () => {
    // call the promised version of mongoose create
    let account = await Account.create(validCryptoAccount);
    let euroValue = account.getValueInCurrency('EUR');
    expect(euroValue).toBe(10000);
});