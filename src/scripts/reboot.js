const pfSenseRebootAddress = (pfSenseIP) => {
    return "https://" + pfSenseIP + "/diag_reboot.php"
};

const run = async (page, pfSenseIP) => {
    const navigationPromise = page.waitForNavigation();
    console.log("Loading reboot page...");
    await page.goto(pfSenseRebootAddress(pfSenseIP));
    await navigationPromise;

    await page.waitFor(1000);
    // Accept the dialog when it appears
    page.on("dialog", (dialog) => {
        console.log("dialog");
        dialog.accept();
    });
    console.log("Rebooting...");
    await page.click("#\\32  > div > div > div.panel-body > div > form > button");
    

    // await page.waitFor(1000);
    // console.log("Applying new rules...");
    // await page.click("#\\32  > div > div.alert.alert-warning.clearfix > form > button");
    await navigationPromise;
    console.log("Waiting for pfSense to reboot...");
    await navigationPromise;
}

module.exports = { run }