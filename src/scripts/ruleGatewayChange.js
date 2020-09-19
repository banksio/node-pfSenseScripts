const pfSenseRuleAddress = (pfSenseIP, ruleID) => {
    return "https://" + pfSenseIP + "/firewall_rules_edit.php?id=" + ruleID
};

const run = async (page, pfSenseIP, ruleID, gatewayText) => {
    const navigationPromise = page.waitForNavigation();
    console.log("Loading firewall rule " + ruleID + "...");
    await page.goto(pfSenseRuleAddress(pfSenseIP, ruleID));
    await navigationPromise;

    await page.waitFor(1000);
    console.log("Picking new gateway from " + gatewayText + "...");
    await page.focus("#gateway");
    // Allow console.log from page.evaluate
    page.on('console', consoleObj => console.log(consoleObj.text()));
    await page.evaluate((gatewayTextIncludes) => {
        const example = document.querySelector('#gateway');
        const example_options = example.querySelectorAll('option');
        const selected_option = [...example_options].find(option => option.text.includes(gatewayTextIncludes));
        
        console.log("Picked gateway " + selected_option.text + ".");

        selected_option.selected = true;
    }, gatewayText);
    // Disallow console.log from page.evaluate
    page.on('console', () => {});

    await page.waitFor(1000);
    console.log("Saving rule...");
    await page.click("#save");
    await navigationPromise;

    await page.waitFor(1000);
    console.log("Applying new rules...");
    await page.click("#\\32  > div > div.alert.alert-warning.clearfix > form > button");
    await navigationPromise;
}

module.exports = { run }