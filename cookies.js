function showCookiesForTab(tabs) {
  //get the first tab object in the array
  let tab = tabs.pop();

  //get all cookies in the domain
  var gettingAllCookies = browser.cookies.getAll({url: tab.url});
  var gettingAllConnections = browser.storage.local.get();

  
  // Get the current tab
  // const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  // const tab = tabs[0]; 

  // Execute script in the current tab

  gettingAllConnections.then((connections) => {
    gettingAllCookies.then((cookies) => {
      //set the header of the panel
      var activeTabUrlHeader = document.getElementById('header-title');
      var textHeader = document.createTextNode(tab.title);
      var textHeader2 = document.createTextNode("- Uses Storage: " + connections[tab.url].usesStorage);
      activeTabUrlHeader.appendChild(textHeader);
      activeTabUrlHeader.appendChild(textHeader2);

      //set the header of the panel
      var activeTabUrl = document.getElementById('cookie-header-title');
      var text = document.createTextNode("Cookies");
      var cookieList = document.getElementById('cookie-list');
      activeTabUrl.appendChild(text);

      //set the header of the panel
      var activeTabUrlConn = document.getElementById('connection-header-title');
      var textConn = document.createTextNode("External Connections");
      var connectionList = document.getElementById('connection-list');
      activeTabUrlConn.appendChild(textConn);

      if (cookies.length > 0) {
        //add an <li> item with the name and value of the cookie to the list
        for (let cookie of cookies) {
          let li = document.createElement("li");
          let content = document.createTextNode(cookie.name + ": "+ cookie.value);
          li.appendChild(content);
          cookieList.appendChild(li);
        }
      } else {
        let p = document.createElement("p");
        let content = document.createTextNode("No cookies in this tab.");
        let parent = cookieList.parentNode;

        p.appendChild(content);
        parent.appendChild(p);
      }

      if (connections[tab.url].urlList.length > 0) {
        //add an <li> item with the name and value of the cookie to the list
        for (let c of connections[tab.url].urlList) {
          console.log(c)
          let li = document.createElement("li");
          let content = document.createTextNode(c);
          li.appendChild(content);
          connectionList.appendChild(li);
        }
      } else {
        let p = document.createElement("p");
        let content = document.createTextNode("No external connections in this tab.");
        let parent = connectionList.parentNode;

        p.appendChild(content);
        parent.appendChild(p);
      }
    })
  });
  browser.tabs.executeScript(tab.id, { code: `var _lsTotal = 0, _xLen, _x; for (_x in localStorage) { _xLen = (((localStorage[_x].length || 0) + (_x.length || 0)) * 2); _lsTotal += _xLen; console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB") }; alert("Total Local Storage Usage from ${tab.title}: " + (_lsTotal / 1024).toFixed(2) + " KB");` });
  // browser.tabs.executeScript(tab.id, { code: `var message = {"message!! UHUL IT WORKS"}; var event = new CustomEvent("PassToBackground", {detail: message}); window.dispatchEvent(event);` });

}

//Listen for the event
window.addEventListener("PassToBackground", function(evt) {
  browser.runtime.sendMessage(evt.detail);
}, false);

//get active tab to run an callback function.
//it sends to our callback an array of tab objects
function getActiveTab() {
  return browser.tabs.query({currentWindow: true, active: true});
}
getActiveTab().then(showCookiesForTab);
