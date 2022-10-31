require("dotenv").config();
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://ais.usvisa-info.com/en-ca/niv/users/sign_in");
  await page.waitForTimeout(2000);

  await page.type("#user_email", process.env.USERNAME); //email
  await page.type("#user_password", process.env.PASSWORD); //password
  await page.click("#policy_confirmed"); // click accept policy
  await page.click("[name='commit']"); // Submit button
  await page.waitForTimeout(2000);
  await page.click("a[class='button primary small']"); //Continue button
  await page.waitForTimeout(2000);
  await page.click("li[class='accordion-item']"); // Schedule accordion button
  await page.waitForTimeout(1500);
  await page.click("a[class='button small primary small-only-expanded']"); // Schedule button
  await page.waitForTimeout(2000);
  async function scheduleUSVisa() {
    console.log(new Date());
    await page.select(
      "#appointments_consulate_appointment_facility_id",
      process.env.LOCATION_ID
    );
    await page.waitForTimeout(1000);

    const isNotAvailableDisplay = await page.$eval(
      "#consulate_date_time_not_available",
      (el) => {
        return getComputedStyle(el).getPropertyValue("display");
      }
    );
    await page.waitForTimeout(1000);

    if (isNotAvailableDisplay !== "block") {
      await page.type("#appointments_consulate_appointment_date", "2023-01-01");

      await page.waitForTimeout(1000);

      let i = 0;
      while (i <= +process.env.MAX_MONTH) {
        const dayElement = await page.$("td[class=' undefined']");
        if (dayElement !== null) {
          dayElement.click();
          await page.waitForTimeout(1000);
          const timeOptions = await page.evaluate(() =>
            Array.from(
              document.querySelectorAll(
                "#appointments_consulate_appointment_time option"
              )
            ).map((element) => element.value)
          );
          await page.select(
            "#appointments_consulate_appointment_time",
            timeOptions[1]
          );
          await page.click("[name='commit']"); // Submit button
          break;
        }
        await page.waitForTimeout(1000);
        const nextButton = await page.$(
          "a[class='ui-datepicker-next ui-corner-all']"
        );
        if (nextButton !== null) {
          nextButton.click();
        }
        console.log("nextButton", nextButton);
        await page.waitForTimeout(1000);
        const weekEnd = await page.$("th[class='ui-datepicker-week-end']");
        if (weekEnd !== null) {
          await weekEnd.hover();
        }
        i++;
        await page.waitForTimeout(1000);
      }
      await scheduleUSVisa();
    } else {
      await page.reload();
      await page.waitForTimeout(30000);
      await scheduleUSVisa();
    }
  }
  scheduleUSVisa();
  //   await browser.close();
})();
