document.addEventListener('click', function (e) {
    const link = e.target.closest('.tab-menu a');
    if (!link || window.location.protocol === 'file:') return;

    e.preventDefault();
    const targetUrl = link.getAttribute('href').split('#')[0];
    const contentArea = document.querySelector('.tab-content');

    // 步驟 1: 先讓舊內容變透明
    contentArea.style.opacity = '0';

    fetch(targetUrl)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 步驟 2: 替換內容
            contentArea.innerHTML = doc.querySelector('.tab-content').innerHTML;
            document.querySelector('.tab-menu').innerHTML = doc.querySelector('.tab-menu').innerHTML;
            document.title = doc.title;
            history.pushState(null, '', targetUrl);

            // 步驟 3: 移除舊動畫並加上新動畫類別，恢復透明度
            contentArea.classList.remove('fade-in');
            void contentArea.offsetWidth; // 強制重繪，確保動畫能再次觸發
            contentArea.classList.add('fade-in');
            contentArea.style.opacity = '1';
        })
        .catch(() => {
            window.location.href = targetUrl;
        });
});