
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
});

test('Div displayed with id of "choices" after clicking draw button', async() => {
    await driver.findElement(By.id('draw')).click();

    const displayed = await driver.findElement(By.id('choices')).isDisplayed();

    expect(displayed).toBe(true);
});

test('Add to Duo button display a div with "player-duo" id', async() => {
    await driver.findElement(By.id('draw')).click();

    await driver.findElement(By.xpath('(//button[text()="Add to Duo"])[1]')).click();
    //index does NOT start at 0

    // await driver.sleep(3000)

    const playerDuo = await driver.findElement(By.id('player-duo'));

    const displayed = await playerDuo.isDisplayed();

    expect(displayed).toBe(true);
});

test('Removed from Duo button returns bot to "choices"', async () => {
    await driver.findElement(By.id('draw')).click();

    await driver.findElement(By.xpath('(//button[text()="Add to Duo"])[1]')).click();

    await driver.findElement(By.xpath('(//button[text()="Remove from Duo"])')).click();

    const returnedBot = await driver.findElement(By.xpath('(//div[@class="bot-card outline"][5])'));

    const displayed = await returnedBot.isDisplayed();

    expect(displayed).toBe(true);
});

// test('See All Bots button displays div with id of "all-bots"', async() => {
//     await driver.findElement(By.id('see-all')).click();

//     const displayed = await driver.findElement(By.id('all-bots')).isDisplayed();

//     expect(displayed).toBe(true);

// })
