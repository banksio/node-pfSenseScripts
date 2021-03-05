const pfSenseInterfaceRules = (pfSenseIP, interface) => {
    return "https://" + pfSenseIP + "/firewall_rules.php?if=" + interface
};

const run = async (page, pfSenseIP, interface, gatewayText, ruleDesc) => {
    const navigationPromise = page.waitForNavigation();
    console.log("Loading firewall rules for interface " + interface + "...");
    await page.goto(pfSenseInterfaceRules(pfSenseIP, interface));
    await navigationPromise;

    await page.waitFor(1000);
    console.log("Finding " + ruleDesc + "...");

    let ruleUrl = await page.evaluate((device) => {
        // find all tr elements
        let row = [...document.querySelectorAll('tr')]

        // check which one of them includes the word
        .find(e=>e.innerText.includes(device));

        // get the link inside
        let gw = row.querySelector('td:nth-child(9)').innerText;
        let deviceName = row.querySelector('td:nth-child(12)').innerText;
        let editLinkSelector = "td.action-icons > a.fa.fa-pencil";

        return row.querySelector(editLinkSelector).href;
    }, ruleDesc)

    await page.goto(ruleUrl);
    await navigationPromise;
    await page.waitFor(1000);
    console.log("Picking new gateway from " + gatewayText + "...");
    await page.focus("#gateway");

    let gw = await page.evaluate((gatewayTextIncludes) => {
        const example = document.querySelector('#gateway');
        const example_options = example.querySelectorAll('option');
        const selected_option = [...example_options].find(option => option.text.includes(gatewayTextIncludes));

        selected_option.selected = true;
        return selected_option.text
    }, gatewayText);

    console.log("Picked gateway " + gw + ".");

    await page.waitFor(1000);
    console.log("Saving rule...");
    await page.click("#save");
    await navigationPromise;

    await page.waitFor(1000);
    console.log("Applying new rules...");
    await page.click("#\\33  > div > div.alert.alert-warning.clearfix > form > button");
    await navigationPromise;
}

module.exports = { run }