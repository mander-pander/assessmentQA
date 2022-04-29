
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

test('Add to Duo button displays the div with id="player-duo"', async() => {
    await driver.findElement(By.id('see-all')).click();

    const displayed = await driver.findElement(By.id('all-bots')).isDisplayed();
    
    expect(displayed).toBe(true);

})
