// 監聽整個頁面的點擊事件
document.addEventListener('click', function (e) {
    // 尋找點擊目標是否為頁籤連結
    const link = e.target.closest('.tab-menu a');
    
    // 如果點擊的不是頁籤連結，就跳出不執行
    if (!link) return;

    // 阻止瀏覽器預設的跳轉行為（避免閃爍）
    e.preventDefault();
    
    // 取得目標網址（例如 page-style-2.html）
    const targetUrl = link.getAttribute('href').split('#')[0];

    // 使用 fetch 去抓取目標網頁的內容
    fetch(targetUrl)
        .then(response => {
            if (!response.ok) throw new Error('網頁載入失敗');
            return response.text();
        })
        .then(html => {
            // 將抓回來的文字轉成 HTML 物件
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 1. 替換掉當前頁面的「內容區塊」
            const newContent = doc.querySelector('.tab-content').innerHTML;
            document.querySelector('.tab-content').innerHTML = newContent;

            // 2. 替換掉當前頁面的「頁籤選單」（更新 Active 狀態）
            const newMenu = doc.querySelector('.tab-menu').innerHTML;
            document.querySelector('.tab-menu').innerHTML = newMenu;

            // 3. 更新瀏覽器分頁標題 (SEO 用)
            document.title = doc.title;

            // 4. 更新網址列，讓使用者覺得真的換頁了
            history.pushState(null, '', targetUrl);
        })
        .catch(err => {
            // 如果 AJAX 失敗（例如 file:// 協定限制），就執行傳統跳轉
            console.warn('AJAX 載入失敗，執行傳統跳轉模式');
            window.location.href = targetUrl;
        });
});

// 當使用者按瀏覽器「回上一頁」時，重新整理頁面以確保內容正確
window.onpopstate = function() {
    location.reload();
};