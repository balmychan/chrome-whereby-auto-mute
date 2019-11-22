(function (){
    const DEFAULT_INTERVAL_TIME = 60;
    function loader() {
        chrome.storage.local.get('save', (obj) => {
            const saved = obj.save;
            document.querySelector('#invalid').checked = saved.invalid || false;
            document.querySelector('#interval_time').value = saved.intervalTime || DEFAULT_INTERVAL_TIME;
            document.querySelector('#unmute_after_operation').checked = saved.unmuteAfterOperation || false;
        });
    }
    document.addEventListener('DOMContentLoaded', (event) => {
        loader();
    });

    document.querySelector('#invalid').addEventListener('change', (event) => {
        saveAndSendMessage();
    });

    document.querySelector('#interval_time').addEventListener('change', (event) => {
        saveAndSendMessage();
    });

    document.querySelector('#unmute_after_operation').addEventListener('change', (event) => {
        saveAndSendMessage();
    });

    function saveAndSendMessage() {
        const message = generateMessage();
        chrome.storage.local.set({ 'save': message });
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, message);
        });
    }

    function getIntervalTime() {
        return document.querySelector('#interval_time').value;
    }

    function getInvalid() {
        return document.querySelector('#invalid').checked;
    }

    function getUnmuteAfterOperation() {
        return document.querySelector('#unmute_after_operation').checked;
    }

    function generateMessage() {
        return {
            'intervalTime': getIntervalTime(),
            'invalid': getInvalid(),
            'unmuteAfterOperation': getUnmuteAfterOperation(),
        };
    }
})();