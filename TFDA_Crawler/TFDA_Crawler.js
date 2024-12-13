"use strict";

const puppeteer = require("puppeteer");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 爬蟲: 透過醫材的 DI 條碼去 台灣食藥署(TFDA) 查詢資料

(async () => {
    const pLimit = await import("p-limit"); // 動態載入 ESM 模組
    // 模擬多個 DI
    const DI_LIST = ['10705036022886', '00801741138492', '00889024237254'];
    const CONCURRENT_LIMIT = 3; // 限制同時執行的任務數量
    const results = [];

    // 使用 p-limit 限制併發數量
    const limit = pLimit.default(CONCURRENT_LIMIT); // 注意需要 `.default`

    // 啟動 Puppeteer
    const browser = await puppeteer.launch({
        headless: false,
        //args: ['--no-sandbox', '--disable-setuid-sandbox'], // 開發測試用, 禁用 sandbox 可能會有安全隱患
    });

    try {
        console.time("搜尋花費時間");

        const fetchDIData = async (DI) => {
            const page = await browser.newPage();  // !!! 重要: 為每個 DI 創建一個新的 page 
            
            console.log(`開始查詢 DI：${DI}`);
            try {
                // 開啟目標網站
                await page.goto('https://udid.fda.gov.tw/ManageEquipmentSearch.aspx', {
                    waitUntil: 'networkidle2',
                });

                await delay(Math.random() * 1000 + 500); // 隨機延遲 500-1500 毫秒, 模仿人類使用模式, !!! 重要: 網站同一時間只能一個請求

                // 驗證搜尋欄位與按鈕是否存在
                const searchInputSelector = '#ContentPlaceHolder1_txt_cPrimaryDINum';
                const searchButtonSelector = '#ContentPlaceHolder1_btnQuery';
                const tableSelector = '.RWD-table';
                const paginationSelector = '.pagination-total span';

                if (!(await page.$(searchInputSelector)) || !(await page.$(searchButtonSelector))) {
                    throw new Error("目標網站的搜尋欄位或按鈕不存在，可能是網站改版！");
                }

                // 填入搜尋欄位並點擊搜尋按鈕
                await page.type(searchInputSelector, DI);
                await page.click(searchButtonSelector);

                // 等待查詢結果
                await page.waitForFunction(
                    (selector) => {
                        const span = document.querySelector(selector);
                        return span && span.textContent.trim() === '1';
                    },
                    { timeout: 15000 }, // 設置較長的超時時間
                    paginationSelector
                );

                // 提取 table 資料
                const data = await page.evaluate((selector) => {
                    const table = document.querySelector(selector);
                    if (!table) return null;

                    const rows = Array.from(table.querySelectorAll('tr'));
                    return rows.map((row, i) => {
                        const cells = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim());
                        return cells;
                    });
                }, tableSelector);

                // data[0] 是空的, data[1]才是要的資料
                console.log(`DI ${DI} 的查詢結果：`, data[1]);
                return { DI, data: data[1] || [] };
            } catch (error) {
                console.error(`查詢 DI ${DI} 時發生錯誤：`, error);
                return { DI, error: error.message };
            }
        };

        const tasks = DI_LIST.map(DI => limit(() => fetchDIData(DI)));
        const taskResults = await Promise.all(tasks);

        results.push(...taskResults);
        console.log("最終搜尋結果：", results);

        console.timeEnd("搜尋花費時間");
    } catch (globalError) {
        console.error("發生 global error OAO ：", globalError);
    } finally {
        await browser.close();
    }
})();
