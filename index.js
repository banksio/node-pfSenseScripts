// Code to scrape YouTube for a playlist (works with videos > 100)
const puppeteer = require('puppeteer');
require('dotenv').config();

// Scripts
const ruleGatewayChange = require('./src/scripts/ruleGatewayChange');
const systemReboot = require('./src/scripts/reboot.js');
const trafficTotals = require('./src/scripts/trafficTotals.js');
const ruleGatewayCheck = require('./src/scripts/ruleGatewayCheck');

const pfSenseIP = process.env.pfSense_IP;
const ruleID = process.env.pfSense_RuleID;
const gatewayText = process.env.gatewayText;
const firewallInterface = process.env.pfSense_if || "lan";
const deviceName = process.env.deviceName;

const task = process.env.task;

const userName = process.env.pfSense_user;
const userPass = process.env.pfSense_pass;

const pfSenseAddress = () => "https://" + pfSenseIP;
const pfSenseLogoutAddress = () => "https://" + pfSenseIP + "/index.php?logout";

console.log("Launching puppeteer browser and loading pfSense...");

(async () => {
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null, ignoreHTTPSErrors: true,
        args: [
            // Required for Docker version of Puppeteer
            '--no-sandbox',
            '--disable-setuid-sandbox',
            // This will write shared memory files into /tmp instead of /dev/shm,
            // because Docker’s default for /dev/shm is 64MB
            '--disable-dev-shm-usage'
        ]});
    const page = await browser.newPage();

    const navigationPromise = page.waitForNavigation();

    console.log("Loading pfSense at " + pfSenseAddress());
    await page.goto(pfSenseAddress());
    await page.waitForSelector('#usernamefld');
    await navigationPromise;

    console.log("Authenicating...");
    await page.type('#usernamefld', userName, {delay: 20})
    await page.type('#passwordfld', userPass, {delay: 20})

    await page.click('#total > div > div.col-sm-4.offset-md-4.logoCol > div > form > input.btn.btn-success.btn-sm'); 
    await navigationPromise;

    await page.waitFor(1000);
    switch (task) {
        case "1":
            await systemReboot.run(page, pfSenseIP);
            break;
        case "2":
            await ruleGatewayChange.run(page, pfSenseIP, ruleID, gatewayText);
            break;
        case "3":
            await trafficTotals.run(page, pfSenseIP);
            break;
        case "4":
            await ruleGatewayCheck.run(page, pfSenseIP, firewallInterface, deviceName);
            break;
        default:
            console.log("No task selected!");
            break;
    }

    await page.waitFor(1000);
    console.log("Logging out...");
    await page.goto(pfSenseLogoutAddress());
    await navigationPromise;

    console.log("Done! Closing browser.");
    await browser.close();
})()

async function getHref(page, selector) {
    return await page.evaluate((selector) => {
        return document.querySelector(selector).href
    }, selector);
}

async function getText(page, selector) {
    return await page.evaluate((selector) => {
        return document.querySelector(selector).textContent.trim();
    }, selector);
}