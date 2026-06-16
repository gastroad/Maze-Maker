const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Chrome 브라우저 시작
runTest()
async function runTest() {
  // Chrome 브라우저 시작
  const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options())
    .build();
  driver.get('http://localhost:3000/');

  try {
    // 최초 페이지 로딩 대기
    driver.wait(until.urlIs('http://localhost:3000/'), 10000)
      .then(() => console.log('페이지 열림'))
      .catch(() => console.log('페이지 열기 실패: URL 변경 대기 시간 초과'))

    // make button 클릭
    driver.findElement(By.css('#body > div > a:nth-child(3)')).click();
    // 페이지 로딩 기다림
    await driver.wait(until.urlContains('http://localhost:3000/maker'), 15000)
    // 맵 이름 input 찾기
    const mapNameElement = await driver.wait(
      until.elementLocated(By.css('#body > div > div.maze-form > div:nth-child(1) > input')),
      10000
    )
    await driver.wait(until.elementIsVisible(mapNameElement), 10000);
    await driver.wait(until.elementIsEnabled(mapNameElement), 10000);
    mapNameElement.sendKeys("test map name");
    const MakerNameElement = driver.findElement(By.css(`#body > div > div.maze-form > div:nth-child(2) > input`));
    MakerNameElement.sendKeys("test maker name");

    //시작지점 변경
    driver.findElement(By.css(`#body > div > div.maze-maker > div > div:nth-child(1) > div:nth-child(2)`)).click();
    //컨트롤러 벽으로 변경
    driver.findElement(By.css(`#body > div > div.maker-maze-controller > div:nth-child(2) > button:nth-child(1)`)).click();
    // 벽 2개 선택
    driver.findElement(By.css(`#body > div > div.maze-maker > div > div:nth-child(1) > div:nth-child(3)`)).click();
    driver.findElement(By.css(`#body > div > div.maze-maker > div > div:nth-child(3) > div:nth-child(1)`)).click();
    // 컨트롤러 종료지점으로 변경
    driver.findElement(By.css(`#body > div > div.maker-maze-controller > div:nth-child(1) > button:nth-child(2)`)).click();
    // 종료지점 변경
    driver.findElement(By.css(`#body > div > div.maze-maker > div > div:nth-child(5) > div:nth-child(4)`)).click();
    // 제출 버튼 클릭
    driver.findElement(By.css(`#body > div > div.maker-maze-controller > button`)).click();
    console.log('제출이후')
    // 최초페이지 로딩확인

    await driver.sleep(5000)
    // play Button 클릭
    driver.findElement(By.css('#body > div > a:nth-child(2)')).click();
    // PlayElement.click()
  } finally {
    // await driver.quit();
  }
}

// async 함수를 호출
runTest();
