const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const {accountSvc} = require('../services');
const connectTo = require('../config/connectTo');
const Logger = require('../utils/logger');

var testURI = process.env.MONGODB_TEST_URI

// connect to test database using environment variable
connectTo(testURI);

describe("Testing Account instance methods", () => {


    testAccounts = {
        validCrypto : {
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
    }


    afterEach(async ()=>{
        await accountSvc.clear();
    })

    test("a valid crypto text entry should return valid account object", async () => {

        let account = await accountSvc.createFromSeed(testAccounts.validCrypto);
        let populatedAccount = await accountSvc.findById(account.id);

        expect(populatedAccount.name).toBe("test bitcoin");
        expect(populatedAccount.balance).toBe(2.342);
        expect(populatedAccount.unitPrice).not.toBe(0);
        expect(populatedAccount.exchange.code).toBe("CC");
    });
})

