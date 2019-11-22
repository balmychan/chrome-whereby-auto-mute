(function(){
    const DEFAULT_INTERVAL_TIME = 60;
    let intervalHandler = null;

    let currentConfig = {
        'invalid': false,
        'intervalTime': DEFAULT_INTERVAL_TIME,
        'unmuteAfterOperation': false,
    };

    // 起動後処理
    chrome.storage.local.get('save', (obj) => {
        const saved = obj.save || currentConfig;
        changeConfig(saved);
    });

    // 設定ポップアップからの更新通知
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        changeConfig(request);
    });

    // 操作検出(操作されたらタイマーをリセット)
    ['keydown', 'mousedown', 'mousemove'].forEach(function(eventName) {
        document.body.addEventListener(eventName, function() {
            if (currentConfig.unmuteAfterOperation) {
                unmute();
            }
            refresh();
        });
    });

    function initialize(config) {
        const invalid = config.invalid;
        const intervalTime = config.intervalTime;
        if (invalid) {
            disable();
        } else {
            enable(intervalTime);
        }
    }

    function changeConfig(newConfig) {
        currentConfig = newConfig;
        refresh();
    }

    function refresh() {
        initialize(currentConfig);
    }

    function mute() {
        if (currentConfig.invalid) {
            return;
        }
        const micButton = document.getElementsByClassName("VideoToolbar-item--mic")[0];;
        if (!micButton) {
            return;
        }
        const isMute = micButton.classList.contains("is-active");
        if (!isMute) {
            micButton.click()
        }
    }

    function unmute() {
        if (currentConfig.invalid) {
            return;
        }
        const micButton = document.getElementsByClassName("VideoToolbar-item--mic")[0];;
        if (!micButton) {
            return;
        }
        const isMute = micButton.classList.contains("is-active");
        if (isMute) {
            micButton.click()
        }
    }

    function enable(intervalTime) {
        if (intervalHandler) {
            disable();
        }
        intervalHandler = setInterval(function() {
            mute();
        }, Number(intervalTime) * 1000);
    }

    function disable() {
        if (!intervalHandler) {
            return;
        }
        clearTimeout(intervalHandler);
        intervalHandler = null;
    }
})();