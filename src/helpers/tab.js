export default function getTabInfo() {
  return Promise.all([
    new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true }, tabs => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        }
        if (!tabs.length) {
          resolve({
            title: '',
            url: ''
          });
        }

        let tab = tabs[0];
        resolve({
          title: tab.title,
          url: tab.url
        });
      });
    }),
    new Promise(resolve => {
      chrome.tabs.executeScript(
        {
          code: 'window.getSelection().toString();'
        },
        function(selection) {
          if (chrome.runtime.lastError) {
            resolve({ selected: '' });
          }

          resolve({
            selected: selection && selection.length ? selection[0] : ''
          });
        }
      );
    })
  ]).then(info => {
    return { ...info[0], ...info[1] };
  });
}
