describe("maze-maker", () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/');
    });

    const mockMazeData = {
        title: "puppeteer e2e test title",
        name: "puppeteer e2e test name",
        mazeSize: {
            "row": 10,
            "col": 10
        },
    }

    test('test making maze', async () => {
        // root 페이지 진입 확인
        await expect(page.$eval('h3', el => el.textContent)).resolves.toBe('MazeMaker');
        await expect(page.title()).resolves.toMatch(/maze-maker/);

        // Make 버튼 클릭
        await page.click('#body > div > a:nth-child(3)');
        await page.waitForNavigation({ waitUntil: 'load' });
        await page.waitForSelector('h3', 10000)
        // Make 페이지 진입 확인
        await expect(page.$eval('h3', el => el.textContent)).resolves.toBe('Maker');


        // maze title 변경
        await page.click('#body > div > div.maze-form > div:nth-child(1) > input');
        await page.keyboard.type(mockMazeData.title);

        // maze name 변경
        await page.click('#body > div > div.maze-form > div:nth-child(2) > input');
        await page.keyboard.type(mockMazeData.name);

        // maze col 변경
        await page.click('#body > div > div.maze-form > div:nth-child(3) > div:nth-child(1) > input');
        await page.keyboard.press('Backspace');
        await page.keyboard.type(String(mockMazeData.mazeSize.col));

        // maze row 변경
        await page.click('#body > div > div.maze-form > div:nth-child(3) > div:nth-child(2) > input');
        await page.keyboard.press('Backspace');
        await page.keyboard.type(String(mockMazeData.mazeSize.row));

        // 시작 지점 변경
        await page.click('#body > div > div.maze-maker > div > div:nth-child(1) > div:nth-child(2)');

        // controller 벽 선택
        await page.click('#body > div > div.maker-maze-controller > div:nth-child(2) > button:nth-child(1)');
        await page.click('#body > div > div.maze-maker > div > div:nth-child(1) > div:nth-child(3)');
        await page.click('#body > div > div.maze-maker > div > div:nth-child(3) > div:nth-child(1)');

        // controller 종료 지점 선택
        await page.click('#body > div > div.maker-maze-controller > div:nth-child(1) > button:nth-child(2)');
        await page.click('#body > div > div.maze-maker > div > div:nth-child(5) > div:nth-child(4)');

        // 제출 버튼 클릭
        await page.click('#body > div > div.maker-maze-controller > button');

        await page.waitForNavigation({ waitUntil: 'load' });
        await page.waitForSelector('h3', 10000)
        // 메인 페이지 진입 확인
        await expect(page.title()).resolves.toMatch(/maze-maker/);
        await expect(page.$eval('h3', el => el.textContent)).resolves.toBe('MazeMaker');
    });

    test('test play maze', async () => {
        // root 페이지 진입 확인
        await expect(page.$eval('h3', el => el.textContent)).resolves.toBe('MazeMaker');

        // play 버튼 클릭
        await page.click('#body > div > a:nth-child(2)');

        // maplist 페이지 진입 확인
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await expect(page.title()).resolves.toMatch(/maze-maker-maplist/);

        // 마지막 map 진입
        await page.waitForSelector('.maze-list-item');
        await page.click('#body > div > ul > li:last-child > a');

        // map 확인
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.maze-board');

        await expect(page.title()).resolves.toMatch(`${mockMazeData.title}-${mockMazeData.name}`);
        await expect(page.$eval('h3', el => el.textContent)).resolves.toBe(mockMazeData.title);
        // Arrow key 입력 및 점수 확인
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');

        await page.waitForSelector('#body > div > div.score-board > span');
        let scoreText = await page.$eval('#body > div > div.score-board > span', el => el.textContent);
        await expect(scoreText).toBe('score: -6');

        // 골인
        await page.keyboard.press('ArrowDown');
        scoreText = await page.$eval('#body > div > div.score-board > span', el => el.textContent);

        await expect(scoreText).toBe('score: 0');

        // 정답보기 버튼 클릭
        await page.click('#body > div > div.play-maze-controller > button:nth-child(2)');
    });

});

