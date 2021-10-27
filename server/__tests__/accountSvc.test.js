const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const mongoose = require('mongoose');

const {accountSvc} = require('../services');
const connectTo = require('../config/connectTo');
const Logger = require('../utils/logger');

var testURI = process.env.MONGODB_TEST_URI

// connect to test database using environment variable
connectTo(testURI);

describe("Testing account service", () => {
    var testAccounts = {
        validCrypto: {
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
                "modifier": 300
            },
            "tags":["everyday", "small transactions"]
        },
        validStock: {
            "user": "fonyx",
            "name":"Australian Foundation Inc",
            "type":"stock",
            "balance": 223,
            "party":"selfWealth",
            "assetCode":"AFI",
            "currency":"AUD",
            "exchange":"AU",
            "style":{
                "color": "blue",
                "modifier": 500,
            },
            "tags":["long", "generalized", "ETF"]
        },
        validMoney: {
            "user": "fonyx",
            "name":"savings",
            "type":"money",
            "balance":12321.32,
            "interestRate":0.7,
            "compounds":"monthly",
            "party":"Commonwealth Bank of Australia",
            "currency":"AUD",
            "exchange":"FOREX",
            "style":{
                "color": "light-blue",
                "modifier": 700
            },
            "tags":["grow"]
        }
    }
    var invalidCryptoNoExchange = {
        "user":"fonyx",
        "name":"test bitcoin",
        "type":"crypto",
        "balance":2.342,
        "party":"coinspot",
        "assetCode":"BTC-USD",
        "currency":"USD",
        "style":{
            "color": "deep-orange",
            "modifier": 300
        },
        "tags":["everyday", "small transactions"]
    }

    afterAll(done => {
        // Closing the DB connection allows Jest to exit successfully.
        mongoose.connection.close()
        done()
    })

    // clear out the test database of all account after each
    afterEach(async ()=>{
        await accountSvc.clear();
    })

    describe("testing crypto accounts", ()=>{
        // testing the object is created, not checking population, not checking any interpreted values
        test("a valid crypto text entry should return valid account unpopulated object", async () => {
    
            let bareAccount = await accountSvc.createFromSeed(testAccounts.validCrypto);
            expect(bareAccount.name).toBe("test bitcoin");
            expect(bareAccount.balance).toBe(2.342);
            expect(bareAccount.unitPrice).toBe(0);
            expect(bareAccount.valuation).toBe(0);
            expect(bareAccount.style.color).toBe("deep-orange");
            expect(bareAccount.goal.amount).toBe(0);
            // check for objectId relations, these aren't objects
            expect(bareAccount.exchange).not.toBeNull();
            expect(bareAccount.currency).not.toBeNull();
            expect(bareAccount.party).not.toBeNull();
            expect(bareAccount.user).not.toBeNull();
            expect(bareAccount.tags).not.toBeNull();
        });
    
        test("finding a valid crypto account should return a populated account", async () => {
    
            let bareAccount = await accountSvc.createFromSeed(testAccounts.validCrypto);
            let populatedAccount = await accountSvc.findById(bareAccount.id);
    
            // test the unitValue has been updated from the default 0 on save, crypto will have a dynamic value
            expect(populatedAccount.unitPrice).not.toBe(0);
            expect(populatedAccount.valuation).not.toBe(0);
            // just check one field of the referenced object, if one exists, they all exist as these are pre populated collections
            expect(populatedAccount.exchange.code).toBe("CC");
            expect(populatedAccount.currency.code).toBe("USD");
            expect(populatedAccount.party.name).toBe("coinspot");
            expect(populatedAccount.user.username).toBe("fonyx");
            expect(populatedAccount.tags[0].name).toBe('everyday');
            expect(populatedAccount.tags[1].name).toBe('small transactions');
    
        });
    });
    describe("testing stock accounts", ()=>{
        test("a valid stock text entry should return valid account unpopulated object", async () => {
    
            let bareAccount = await accountSvc.createFromSeed(testAccounts.validStock);
    
            expect(bareAccount.name).toBe("Australian Foundation Inc");
            expect(bareAccount.balance).toBe(223);
            expect(bareAccount.unitPrice).toBe(0);
            expect(bareAccount.valuation).toBe(0);
            expect(bareAccount.style.color).toBe("blue");
            expect(bareAccount.goal.amount).toBe(0);
            // check for objectId relations, these aren't objects
            expect(bareAccount.exchange).not.toBeNull();
            expect(bareAccount.currency).not.toBeNull();
            expect(bareAccount.party).not.toBeNull();
            expect(bareAccount.user).not.toBeNull();
            expect(bareAccount.tags).not.toBeNull();
        });
    
        test("finding a valid stock account should return a populated account", async () => {
    
            let bareAccount = await accountSvc.createFromSeed(testAccounts.validStock);
            let populatedAccount = await accountSvc.findById(bareAccount.id);
    
            // test the unitValue has been updated from the default 0 on save, crypto will have a dynamic value
            expect(populatedAccount.unitPrice).not.toBe(0);
            expect(populatedAccount.valuation).not.toBe(0);
            // just check one field of the referenced object, if one exists, they all exist as these are pre populated collections
            expect(populatedAccount.exchange.code).toBe("AU");
            expect(populatedAccount.currency.code).toBe("AUD");
            expect(populatedAccount.party.name).toBe("selfWealth");
            expect(populatedAccount.user.username).toBe("fonyx");
            expect(populatedAccount.tags[0].name).toBe('long');
            expect(populatedAccount.tags[1].name).toBe('generalized');
            expect(populatedAccount.tags[2].name).toBe('ETF');
        });
    });
    describe("testing money accounts", ()=>{
        test("a valid money text entry should return valid account unpopulated object", async () => {
    
            let bareAccount = await accountSvc.createFromSeed(testAccounts.validMoney);
    
            expect(bareAccount.name).toBe("savings");
            expect(bareAccount.balance).toBe(12321.32);
            expect(bareAccount.unitPrice).toBe(0);
            expect(bareAccount.valuation).toBe(0);
            expect(bareAccount.interestRate).toBe(0.7);
            expect(bareAccount.compounds).toBe("monthly");
            expect(bareAccount.style.color).toBe("light-blue");
            expect(bareAccount.goal.amount).toBe(0);
            // check for objectId relations, these aren't objects
            expect(bareAccount.exchange).not.toBeNull();
            expect(bareAccount.currency).not.toBeNull();
            expect(bareAccount.party).not.toBeNull();
            expect(bareAccount.user).not.toBeNull();
            expect(bareAccount.tags).not.toBeNull();
        });
    
        test("finding a valid money account should return a populated account", async () => {
    
            let bareAccount = await accountSvc.createFromSeed(testAccounts.validMoney);
            let populatedAccount = await accountSvc.findById(bareAccount.id);
    
            // test the unitValue has been updated from the default 0 on save, crypto will have a dynamic value
            expect(populatedAccount.unitPrice).toBe(1);
            expect(populatedAccount.valuation).toBe(populatedAccount.balance);
            // just check one field of the referenced object, if one exists, they all exist as these are pre populated collections
            expect(populatedAccount.exchange.code).toBe("FOREX");
            expect(populatedAccount.currency.code).toBe("AUD");
            expect(populatedAccount.party.name).toBe("Commonwealth Bank of Australia");
            expect(populatedAccount.user.username).toBe("fonyx");
            expect(populatedAccount.tags[0].name).toBe('grow');
        });
    });
    describe("Testing accountSvc static methods", () => {
        
        test("Testing isAccountPopulated with found account should return true", async () => {
            let createdAccount = await accountSvc.createFromSeed(testAccounts.validCrypto);
            let populatedAccount = await accountSvc.findById(createdAccount.id);
            let isPop = accountSvc.isAccountPopulated(populatedAccount);
            expect(isPop).toBe(true);
        });
        test("Testing isAccountPopulated with created account should return false", async () => {
            let createdAccount = await accountSvc.createFromSeed(testAccounts.validCrypto);
            let isPop = accountSvc.isAccountPopulated(createdAccount);
            expect(isPop).toBe(false);
        });
        // testing invalid seed with bad account with no exchange, returns false
        test("Invalid account should return invalid seed check", async () => {
            // expect(() => {
                //     accountSvc.isValidSeed(invalidCryptoNoExchange);
                // }).toThrowError();
                expect(accountSvc.isValidSeed(invalidCryptoNoExchange)).toBe(false);
            })
        // testing is valid seed returns true seed check
        test("Valid account seed should return true seed check", async () => {
            expect(accountSvc.isValidSeed(testAccounts.validCrypto)).toBe(true);
        })
    });
})

