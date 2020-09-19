const pfSenseTrafficTotals = (pfSenseIP, interface) => {
    return "https://" + pfSenseIP + "/firewall_rules.php?if=" + interface
};

const run = async (page, pfSenseIP, interface, deviceName) => {
    const navigationPromise = page.waitForNavigation();
    console.log("Loading firewall rules for interface " + interface + "...");
    await page.goto(pfSenseTrafficTotals(pfSenseIP, interface));
    await navigationPromise;

    await page.waitFor(1000);
    console.log("Finding " + deviceName + "...");
    let data = await page.evaluate((device) => {
        // find all tr elements
        let row = [...document.querySelectorAll('tr')]

        // check which one of them includes the word
        .find(e=>e.innerText.includes(device));

        // get the link inside
        let gw = row.querySelector('td:nth-child(9)').innerText;
        let deviceName = row.querySelector('td:nth-child(12)').innerText;
        return {
            gw: gw,
            device: deviceName
        };
    }, deviceName)

    console.log("Gateway for " + data.device + " is " + data.gw);
}

async function getText(page, selector) {
    return await page.evaluate((selector) => {
        return document.querySelector(selector).textContent.trim();
    }, selector);
}

module.exports = { run }