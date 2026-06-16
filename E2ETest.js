const { Builder, By, Key, until } = require('selenium-webdriver');


(async function example() {
    // const driver = new Builder()
    //     .forBrowser('chrome')
    //     .setChromeOptions(new chrome.Options())
    //     .build();
    let driver = await new Builder().forBrowser('chrome').build();

    const mockMazeData = {
        title: "Selenium e2e test title",
        name: "Selenium e2e test name",
        mazeSize: {
            "row": 10,
            "col": 10
        },
    }

    const mazeTitleInputElementSelector = '#body > div > div.maze-form > div:nth-child(1) > input'
    const mazeNameInputElementSelector = '#body > div > div.maze-form > div:nth-child(2) > input'
    const mazeColInputElementSelecttor = '#body > div > div.maze-form > div:nth-child(3) > div:nth-child(1) > input'
    const mazeRowInputElementSelecttor = '#body > div > div.maze-form > div:nth-child(3) > div:nth-child(2) > input'
    const controllerWallButtonElementSelector = '#body > div > div.maker-maze-controller > div:nth-child(2) > button:nth-child(1)'
    const controllerEndPointButtonElementSelector = '#body > div > div.maker-maze-controller > div:nth-child(1) > button:nth-child(2)'
    const controllerSubmitButtonElementSelector = '#body > div > div.maker-maze-controller > button'
    try {
        // has title
        await driver.get('http://localhost:3000/');
        await driver.wait(until.titleMatches(/maze-maker/), 1000);


        // test making maze
        await driver.get('http://localhost:3000/');
        await driver.wait(until.titleMatches(/maze-maker/), 1000);

        // root 페이지 진입 확인
        await driver.findElement(By.css('.map-title')).getText('MazeMaker')

        // Make 버튼 클릭
        await driver.findElement(By.css('#body > div > a:nth-child(3)')).click();
        await driver.wait(until.urlContains('http://localhost:3000/maker'), 15000)
        // Make 페이지 진입 확인
        await driver.findElement(By.css('.map-title')).getText('Maker')


        await driver.findElement(By.css(mazeTitleInputElementSelector)).sendKeys(mockMazeData.title);
        // maze name 변경
        await driver.findElement(By.css(mazeNameInputElementSelector)).sendKeys(mockMazeData.name);

        // maze col 변경
        await driver.findElement(By.css('#body > div > div.maze-form > div:nth-child(3) > div:nth-child(1) > input')).click();
        await driver.findElement(By.css('#body > div > div.maze-form > div:nth-child(3) > div:nth-child(1) > input')).sendKeys(Key.BACK_SPACE);
        await driver.findElement(By.css('#body > div > div.maze-form > div:nth-child(3) > div:nth-child(1) > input')).sendKeys(String(mockMazeData.mazeSize.col));

        // maze row 변경
        await driver.findElement(By.css('#body > div > div.maze-form > div:nth-child(3) > div:nth-child(2) > input')).click();
        await driver.findElement(By.css('#body > div > div.maze-form > div:nth-child(3) > div:nth-child(2) > input')).sendKeys(Key.BACK_SPACE);
        await driver.findElement(By.css('#body > div > div.maze-form > div:nth-child(3) > div:nth-child(2) > input')).sendKeys(String(mockMazeData.mazeSize.row));

        // 시작 지점 변경
        await driver.findElement(By.css('#body > div > div.maze-maker > div > div:nth-child(1) > div:nth-child(2)')).click();

        // controller 벽 선택
        await driver.findElement(By.css('#body > div > div.maker-maze-controller > div:nth-child(2) > button:nth-child(1)')).click();
        await driver.findElement(By.css('#body > div > div.maze-maker > div > div:nth-child(1) > div:nth-child(3)')).click();
        await driver.findElement(By.css('#body > div > div.maze-maker > div > div:nth-child(3) > div:nth-child(1)')).click();

        // controller 종료 지점 선택
        await driver.findElement(By.css('#body > div > div.maker-maze-controller > div:nth-child(1) > button:nth-child(2)')).click();
        await driver.findElement(By.css('#body > div > div.maze-maker > div > div:nth-child(5) > div:nth-child(4)')).click();
        console.log('controller')
        // 제출 버튼 클릭
        await driver.findElement(By.css('#body > div > div.maker-maze-controller > button')).click();

        // 메인 페이지 진입 확인
        await driver.wait(until.titleMatches(/maze-maker/), 1000);
        await driver.findElement(By.css('.map-title')).getText('MazeMaker')


        // test play maze
        await driver.get('http://localhost:3000/');

        // root 페이지 진입 확인
        await driver.findElement(By.css('.map-title')).getText('MazeMaker')

        // play 버튼 클릭
        await driver.findElement(By.css('#body > div > a:nth-child(2)')).click();

        // maplist 페이지 진입 확인
        await driver.wait(until.urlContains('http://localhost:3000/maplist'), 15000)
        await driver.wait(until.titleMatches(/maze-maker-maplist/), 1000);
        await driver.findElement(By.css('.map-title')).getText('Maze List')


        // 마지막 map 진입
        await driver.findElement(By.css('#body > div > ul > li:last-child > a')).click();
        // map 확인
        const mapTitle = `${mockMazeData.title}-${mockMazeData.name}`;
        await driver.wait(until.titleIs(mapTitle), 1000);
        await driver.sleep(5000)
        // Arrow key 입력 및 점수 확인
        await driver.actions().sendKeys(Key.ARROW_DOWN).perform();
        await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
        await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
        await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
        await driver.actions().sendKeys(Key.ARROW_DOWN).perform();
        await driver.actions().sendKeys(Key.ARROW_DOWN).perform();
        await driver.findElement(By.css('body')).getText('score: -6')
        // 골인
        await driver.actions().sendKeys(Key.ARROW_DOWN).perform();
        await driver.findElement(By.css('body')).getText('score: 0')

        // 정답보기 버튼 클릭
        await driver.findElement(By.css('#body > div > div.play-maze-controller > button:nth-child(2)')).click();

    } finally {
        // await driver.quit();
    }
})();
