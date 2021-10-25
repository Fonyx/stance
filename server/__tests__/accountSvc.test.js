const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const {accountSvc} = require('../services');
const connectTo = require('../config/connectTo');

var testURI = process.env.MONGODB_TEST_URI

connectTo(testURI);

// jest.useFakeTimers();
// jest.setTimeout(100000);

describe("Testing Account instance methods", () => {


    afterEach(async ()=>{
        await accountSvc.clear();
    })

    test("a crypto account should return correct value in EUR", async () => {

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

        let account = await accountSvc.createFromSeed(validCryptoAccount);
        let euroValue = await account.getValueInCurrency('EUR');
        expect(euroValue).toBe(10000);
        // expect(account.name).toBe("test bitcoin");
    });
})

