import {chromium} from "playwright";

// set language Tiếng Việt first
(async () => {
    try {
        const userDataDir = "~/zalo-profile";
        const browser = await chromium.launchPersistentContext(userDataDir, {
            // remove to run in background
            headless: false,
        });

        const page = await browser.newPage()
        await page.goto("https://chat.zalo.me")

        await page.locator('[title="Danh bạ"], [title="Contact"]').click();

        await page.locator('#contact-search-input').click();
        const sentToPhoneNumber = "0329089597"
        await page.locator('#contact-search-input').fill(sentToPhoneNumber);

        await page.waitForSelector(':has-text("Tìm bạn qua số điện thoại: "), :has-text("Không tìm thấy kết quả")');

        const hasSearchText = await page.isVisible(':has-text("Tìm bạn qua số điện thoại: ")');
        const hasNoResultsText = await page.isVisible(':has-text("Không tìm thấy kết quả")');

        if (hasSearchText) {
            console.log('Found text: "Tìm bạn qua số điện thoại: "');
            const element = await page.locator(':has-text("Tìm bạn qua số điện thoại: ") + *').first();
            await element.click();
            console.log('Clicked the first element after "Tìm bạn qua số điện thoại: ".');

            const sentMessage = "testing message"
            await page.keyboard.type(sentMessage, { delay: 100 });
            await page.keyboard.press('Enter');
            console.log('Pressed the Enter key.');
        } else if (hasNoResultsText) {
            console.log('Found text: "Không tìm thấy kết quả"');
            console.log('No results found. Performing alternative action...');
        } else {
            console.log('No matching text found.');
        }

        // await page.goto("https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F");
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();