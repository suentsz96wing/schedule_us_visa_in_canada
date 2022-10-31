require("dotenv").config();
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto("https://ais.usvisa-info.com/en-ca/niv/users/sign_in");
  await page.waitForTimeout(2000);

  await page.type("#user_email", process.env.USERNAME); //email
  await page.type("#user_password", process.env.PASSWORD); //password
  await page.click("#policy_confirmed"); // click accept policy
  await page.click("[name='commit']"); // Submit button
  await page.waitForTimeout(2000);
  await page.click("a[class='button primary small']"); //Continue button
  await page.waitForTimeout(2000);
  const accordionItemList = await page.$$("li[class='accordion-item']");
  await accordionItemList[3].click();
  await page.waitForTimeout(1500);
  const rescheduleButton = await page.$$(
    "a[class='button small primary small-only-expanded']"
  ); // Schedule button
  await rescheduleButton[3].click();
  await page.waitForTimeout(2000);
  async function scheduleUSVisa() {
    console.log(new Date(Date.now()));
    await page.waitForTimeout(1000);
    const facility_id = await page.$(
      "#appointments_consulate_appointment_facility_id"
    );

    if (facility_id === null) {
      await scheduleUSVisa();
    }

    await facility_id.select(process.env.LOCATION_ID);

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
      let isClicked = false;
      while (i <= +process.ENV.MAX_MONTH) {
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
          isClicked = true;
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
      if (!isClicked) {
        await scheduleUSVisa();
      }
    } else {
      await page.reload();
      await page.waitForTimeout(30000);
      await scheduleUSVisa();
    }
  }
  scheduleUSVisa();
  //   await browser.close();
})();
