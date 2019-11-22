(function(){
    const DEFAULT_INTERVAL_TIME = 5000;
    let intervalHandler = null;

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        initialize(request);
    });

    // 起動後処理
    chrome.storage.local.get('save', (obj) => {
        const saved = obj.save || { 'invalid': false, 'intervalTime': DEFAULT_INTERVAL_TIME };
        initialize(saved);
    });

    function initialize(saved) {
        const invalid = saved.invalid;
        const intervalTime = saved.intervalTime;
        if (invalid) {
            disable();
        } else {
            enable(intervalTime);
        }
    }

    function mute() {
        const micButton = document.getElementsByClassName("VideoToolbar-item--mic")[0];;
        if (!micButton) {
            return;
        }
        const isMute = micButton.classList.contains("is-active");
        if (!isMute) {
            micButton.click()
        }
    }

    function enable(intervalTime) {
        if (intervalHandler) {
            disable();
        }
        intervalHandler = setInterval(function() {
            mute();
        }, intervalTime || DEFAULT_INTERVAL_TIME);
    }

    function disable() {
        if (!intervalHandler) {
            return;
        }
        clearTimeout(intervalHandler);
        intervalHandler = null;
    }
})();