let is12HourFormat = false;

// 💡 保存された背景画像を読み込む、またはフォルダ内の初期画像を読み込む関数
function loadBackgroundImage() {
    // まずブラウザの記憶（localStorage）に画像があるか確認
    const savedBg = localStorage.getItem('custom_bg');
    
    if (savedBg) {
        document.body.style.backgroundImage = `url('${savedBg}')`;
    } else {
        // 記憶になければ、今まで通りフォルダ内の bg.jpg / bg.png を探す
        const jpgUrl = 'bg.jpg';
        const pngUrl = 'bg.png';
        const img = new Image();
        
        img.src = jpgUrl;
        img.onload = () => { document.body.style.backgroundImage = `url('${jpgUrl}')`; };
        img.onerror = () => {
            const imgPng = new Image();
            imgPng.src = pngUrl;
            imgPng.onload = () => { document.body.style.backgroundImage = `url('${pngUrl}')`; };
        };
    }
}

function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    let ampm = '';

    if (is12HourFormat) {
        ampm = h >= 12 ? ' PM' : ' AM';
        h = h % 12;
        h = h ? h : 12;
    }

    const hString = String(h).padStart(2, '0');
    
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.textContent = `${hString}:${m}:${s}${ampm}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadBackgroundImage();
    updateClock();
    setInterval(updateClock, 1000);

    // 12H/24H切り替えボタン
    const toggleBtn = document.getElementById('toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            is12HourFormat = !is12HourFormat;
            updateClock();
        });
    }

    // 💡 背景変更ボタンを押したとき、ファイル選択画面を開く
    const bgBtn = document.getElementById('bg-btn');
    const fileInput = document.getElementById('file-input');
    
    if (bgBtn && fileInput) {
        bgBtn.addEventListener('click', () => {
            fileInput.click(); // 隠されたファイル選択を代わりにクリック
        });

        // 💡 画像が選ばれたときの処理
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Image = event.target.result;
                    // 画面の背景にセット
                    document.body.style.backgroundImage = `url('${base64Image}')`;
                    // ブラウザに保存（これで次回からも自動でこの画像になる）
                    localStorage.setItem('custom_bg', base64Image);
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
