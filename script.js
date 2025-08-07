javascript:(function () {
  // --- Universal Popup HTML/CSS ---
  const flagList = [
    { code: "pk", name: "Pakistan", active: true },
    { code: "bd", name: "Bangladesh", active: true },
    { code: "dz", name: "Algeria", active: true },
    { code: "in", name: "India", active: true },
    // Inactive countries below
    { code: "us", name: "United States", active: false },
    { code: "gb", name: "United Kingdom", active: false },
    { code: "fr", name: "France", active: false },
    { code: "cn", name: "China", active: false }
  ];

  const flagSVGs = {
    pk: '<svg class="flag-icon" width="28" height="28" style="vertical-align:middle;"><use xlink:href="/profile/images/flags.svg#flag-pk"></use></svg>',
    bd: '<svg class="flag-icon" width="28" height="28" style="vertical-align:middle;"><use xlink:href="/profile/images/flags.svg#flag-bd"></use></svg>',
    dz: '<svg class="flag-icon" width="28" height="28" style="vertical-align:middle;"><use xlink:href="/profile/images/flags.svg#flag-dz"></use></svg>',
    in: '<svg class="flag-icon" width="28" height="28" style="vertical-align:middle;"><use xlink:href="/profile/images/flags.svg#flag-in"></use></svg>'
  };

  // Remove any previous popup
  const oldPopup = document.getElementById('universal-popup');
  if (oldPopup) oldPopup.remove();

  // Add CSS
  const style = document.createElement('style');
  style.textContent = `
    #universal-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      width: min(92vw, 370px);
      background: linear-gradient(135deg, #b2f7ef 0%, #fbc2eb 100%);
      color: #222;
      padding: 18px 18px 22px 18px;
      border-radius: 22px;
      transform: translate(-50%, -50%);
      z-index: 9999;
      font-family: 'Segoe UI', Arial, sans-serif;
      box-shadow: 0 4px 24px #0002;
      animation: fadeInPopup 0.7s;
    }
    @keyframes fadeInPopup {
      from { opacity: 0; transform: translate(-50%, -60%) scale(0.95);}
      to   { opacity: 1; transform: translate(-50%, -50%) scale(1);}
    }
    #universal-popup label {
      font-size: 16px;
      font-weight: bold;
      margin-top: 12px;
      display: block;
    }
    #universal-popup input, #universal-popup select {
      font-size: 16px;
      margin-top: 8px;
      margin-bottom: 12px;
      width: 100%;
      padding: 8px 12px;
      border-radius: 20px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      transition: box-shadow 0.2s;
    }
    #universal-popup input:focus, #universal-popup select:focus {
      box-shadow: 0 0 0 2px #0faf59;
      outline: none;
    }
    #universal-popup .flag-icon {
      vertical-align: middle;
      margin-bottom: 2px;
      margin-right: 8px;
      box-shadow: 0 2px 8px #0001;
      border-radius: 8px;
      background: #fff;
      transition: transform 0.2s;
    }
    #universal-popup .flag-icon.active {
      transform: scale(1.08);
      box-shadow: 0 4px 16px #0faf5911;
    }
    #universal-popup .inactive {
      color: #aaa;
      background: #eee;
    }
    #universal-popup .popup-title {
      text-align: center;
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 4px;
      letter-spacing: 2px;
      font-family: 'Segoe UI', Arial, sans-serif;
      text-shadow: 0 2px 8px #fff8;
    }
    #universal-popup .popup-sub {
      text-align: center;
      font-size: 15px;
      background: #0faf59;
      color: #fff;
      border-radius: 8px;
      padding: 3px 14px;
      margin-bottom: 12px;
      margin-top: 2px;
      display: block;
      font-weight: 500;
      letter-spacing: 1px;
      box-shadow: 0 2px 8px #0faf5911;
      animation: fadeInSub 1s;
    }
    @keyframes fadeInSub {
      from { opacity: 0; transform: scale(0.95);}
      to   { opacity: 1; transform: scale(1);}
    }
    #universal-popup .popup-key-label {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-top: 10px;
      margin-bottom: 6px;
      letter-spacing: 1px;
      text-shadow: 0 2px 8px #fff8;
    }
    #universal-popup .input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    #universal-popup .input-row .icon {
      font-size: 22px;
      margin-right: 2px;
      margin-left: 2px;
      opacity: 0.85;
    }
    #universal-popup #popup-flagbox {
      text-align: left;
      margin-bottom: 2px;
      margin-top: 0px;
      min-height: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #universal-popup #popup-ok {
      margin-top: 10px;
      width: 100%;
      font-size: 16px;
      border-radius: 20px;
      background: linear-gradient(90deg, #0faf59 60%, #b2f7ef 100%);
      color: #fff;
      border: none;
      padding: 10px 0;
      font-weight: bold;
      letter-spacing: 1px;
      box-shadow: 0 2px 8px #0faf5911;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }
    #universal-popup #popup-ok:hover {
      background: linear-gradient(90deg, #0faf59 80%, #fbc2eb 100%);
      transform: scale(1.04);
    }
    #universal-popup hr {
      border: none;
      border-top: 2px dotted #222;
      margin: 10px 0 14px 0;
    }
  `;
  document.head.appendChild(style);

  // Build country options
  let countryOptions = '';
  flagList.forEach((f, i) => {
    if (i === 4) countryOptions += `<option disabled class="inactive">────────────</option>`;
    if (f.active) {
      countryOptions += `<option value="${f.code}" data-flag="${f.code}">${f.name}</option>`;
    } else {
      countryOptions += `<option value="${f.code}" disabled class="inactive">${f.name} (Inactive)</option>`;
    }
  });

  // Popup HTML
  const popupDiv = document.createElement('div');
  popupDiv.id = 'universal-popup';
  popupDiv.innerHTML = `
    <div class="popup-title">CODEX</div>
    <div class="popup-sub">BUY FROM @Coder_456</div>
    <hr>
    <label>👤 NAME</label>
    <div class="input-row">
      <span class="icon">🔻</span>
      <input type="text" id="popup-name" placeholder="Your Name" autocomplete="off">
    </div>

    <label>💲 DEMO BALANCE</label>
    <div class="input-row">
      <span class="icon">🔻</span>
      <input type="number" id="popup-balance" placeholder="Enter Demo Balance" min="0" autocomplete="off">
    </div>

    <label>🌍 COUNTRY</label>
    <div id="popup-flagbox"></div>
    <select id="popup-country">${countryOptions}</select>

    <div class="popup-key-label">ENTER YOUR KEY</div>
    <input type="text" id="popup-key" placeholder="Enter your key" autocomplete="off">
    <button id="popup-ok">OK</button>
  `;
  document.body.appendChild(popupDiv);

  // Flag update logic
  function updateFlag() {
    const select = document.getElementById('popup-country');
    const flagDiv = document.getElementById('popup-flagbox');
    const val = select.value;
    flagDiv.innerHTML = flagSVGs[val] ? `<span>${flagSVGs[val]}</span><span style="font-weight:500;font-size:15px;">${flagList.find(f=>f.code===val)?.name||''}</span>` : '';
    if (flagDiv.querySelector('.flag-icon')) flagDiv.querySelector('.flag-icon').classList.add('active');
  }
  document.getElementById('popup-country').onchange = updateFlag;
  updateFlag();

  // On OK, set spoof variables and start spoof
  document.getElementById('popup-ok').onclick = function () {
    const name = document.getElementById('popup-name').value.trim();
    const balance = document.getElementById('popup-balance').value.trim();
    const country = document.getElementById('popup-country').value;
    const key = document.getElementById('popup-key').value.trim();

    if (!name || !balance || !country || !key) {
      alert("Please fill all fields!");
      return;
    }

    // Set spoof variables
    window.customName = name;
    window.fakeDemoBalance = balance;
    window.customFlag = country;
    window.userKey = key;

    document.getElementById('universal-popup').remove();

    // Start spoof logic
    startSpoof();
  };

  // --- SPOOF LOGIC ---
  function startSpoof() {
    let previousBalance = null;
    let profitLoss = 0;
    let customPosition = 2393; // Default start position

    function formatLeaderboardBalance(amount, idx, yourPosition) {
      if (idx <= 2 && idx === yourPosition && amount >= 30000) {
        return "$30,000+";
      }
      if (amount < 0) {
        return `-$${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      return `$${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    setTimeout(() => {
      const footerWrapper = document.querySelector(".position__footer");
      if (footerWrapper) {
        footerWrapper.style.cursor = "pointer";
        footerWrapper.onclick = function () {
          const pos = prompt("Enter your custom position (number):", customPosition);
          if (pos !== null && !isNaN(pos) && Number(pos) > 0) {
            customPosition = Number(pos);
          }
        };
      }
      // Name popup only (flag untouched in header)
      const leaderboardHeader = document.querySelector(".position__header");
      if (leaderboardHeader) {
        const nameContainer = leaderboardHeader.querySelector(".position__header-name");
        if (nameContainer) {
          nameContainer.style.cursor = "pointer";
          nameContainer.onclick = function () {};
        }
      }
    }, 1000);

    setInterval(() => {
      try {
        if (location.pathname === "/en/demo-trade") {
          history.pushState({}, "", "/en/trade");
        }

        const pageTitle = document.querySelector("head > title");
        if (pageTitle) pageTitle.innerText = "Live trading | Quotex";

        const infoText = document.querySelector('[class*="__infoName--"][class*="__demo--"]');
        if (infoText) {
          infoText.classList.remove(...[...infoText.classList].filter(c => c.includes("__demo--")));
          infoText.classList.add("___react-features-Usermenu-styles-module__live--Bx7Ua");
          const isMobile = window.innerWidth < 768;
          infoText.textContent = isMobile ? "Live" : "Live Account";
          infoText.style.color = "#0faf59";
        }

        const balanceEl = document.querySelector('[class*="__infoBalance--"]');
        if (!balanceEl) return;

        const balanceText = balanceEl.textContent.replace(/[^\d.]/g, '');
        const balance = parseFloat(balanceText);

        if (previousBalance !== null) {
          const diff = parseFloat((balance - previousBalance).toFixed(2));
          if (diff !== 0) profitLoss += diff;
        }
        previousBalance = balance;

        // --- HEADER NAME & BALANCE (flag untouched) ---
        const leaderboardHeader = document.querySelector(".position__header");
        if (leaderboardHeader) {
          const nameContainer = leaderboardHeader.querySelector(".position__header-name");
          const moneyEl = leaderboardHeader.querySelector(".position__header-money");

          // Name popup only (flag untouched)
          if (nameContainer) {
            nameContainer.style.cursor = "pointer";
            nameContainer.onclick = function () {};
            // Set name from popup
            const span = nameContainer.querySelector("span");
            if (span) span.textContent = window.customName;
          }

          // Profit/loss formatting (loss: -$0.00, profit: $0.00)
          if (moneyEl) {
            if (profitLoss < 0) {
              moneyEl.textContent = `-$${Math.abs(profitLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            } else {
              moneyEl.textContent = `$${profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
            moneyEl.className = `position__header-money ${profitLoss >= 0 ? "--green" : "--red"}`;
            moneyEl.style.color = profitLoss >= 0 ? "#0faf59" : "#db4635";
          }
        }

        // ✅ Loading bar based on profit
        const expandWrapper = document.querySelector(".position__expand");
        if (expandWrapper) {
          const innerBar = expandWrapper.querySelector(".position__expand > div");
          if (innerBar) {
            let percent = 0;
            if (profitLoss >= 3000) {
              percent = 100;
            } else if (profitLoss >= 1000) {
              percent = 80 + ((profitLoss - 1000) / 2000) * 20;
            } else if (profitLoss >= 0) {
              percent = (profitLoss / 900) * 60;
            }
            percent = Math.min(100, Math.max(0, percent));
            innerBar.style.width = `${percent}%`;
            innerBar.style.transition = "width 0.3s ease-in-out";
          }
        }

        // ✅ Leaderboard spoof: show your name/profit/flag/avatar at correct position
        const leaderboardItems = document.querySelectorAll(".leader-board__items .leader-board__item");
        let profits = [];
        let avatars = [];
        let flags = [];
        let names = [];

        leaderboardItems.forEach(item => {
          const profitEl = item.querySelector(".leader-board__item-money");
          const profit = profitEl ? parseFloat(profitEl.textContent.replace(/[^\d.-]/g, '')) : 0;
          profits.push(profit);

          const avatarEl = item.querySelector(".leader-board__item-avatar");
          avatars.push(avatarEl ? avatarEl.innerHTML : "");

          const flagEl = item.querySelector(".flag");
          flags.push(flagEl ? flagEl.outerHTML : "");

          const nameEl = item.querySelector(".leader-board__item-name");
          names.push(nameEl ? nameEl.textContent : "");
        });

        function getCustomFlagHTML() {
          return `<svg class="flag flag-${window.customFlag}" width="16" height="16"><use xlink:href="/profile/images/flags.svg#flag-${window.customFlag}"></use></svg>`;
        }
        function getDefaultAvatarHTML() {
          return `<svg class="icon-avatar-default" width="32" height="32"><use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use></svg>`;
        }

        // Add your profit to array and sort descending
        const allProfits = [...profits, profitLoss].sort((a, b) => b - a);
        let yourPosition = allProfits.indexOf(profitLoss);
        if (customPosition && customPosition > 0 && customPosition <= leaderboardItems.length) {
          yourPosition = customPosition - 1;
        }

        leaderboardItems.forEach((item, idx) => {
          const profitEl = item.querySelector(".leader-board__item-money");
          const nameEl = item.querySelector(".leader-board__item-name");
          const avatarEl = item.querySelector(".leader-board__item-avatar");
          const flagEl = item.querySelector(".flag");

          if (idx === yourPosition && yourPosition < leaderboardItems.length) {
            if (nameEl) nameEl.textContent = window.customName;
            if (profitEl) profitEl.textContent = formatLeaderboardBalance(profitLoss, idx, yourPosition);
            if (avatarEl) avatarEl.innerHTML = getDefaultAvatarHTML();
            if (flagEl) flagEl.outerHTML = getCustomFlagHTML();
          } else {
            if (nameEl) nameEl.textContent = names[idx];
            if (profitEl) profitEl.textContent = formatLeaderboardBalance(profits[idx], idx, yourPosition);
            if (avatarEl && avatars[idx]) avatarEl.innerHTML = avatars[idx]; // restore original avatar
            if (flagEl && flags[idx]) flagEl.outerHTML = flags[idx]; // restore original flag
          }
        });

        // ✅ Show your position in header/footer
        const footerWrapper = document.querySelector(".position__footer");
        if (footerWrapper) {
          const title = footerWrapper.querySelector(".position__footer-title");
          if (title) title.textContent = "Your position:";
          const textNodes = Array.from(footerWrapper.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
          const numNode = textNodes.find(n => n.textContent.trim().match(/^\d+$/));
          if (numNode) {
            numNode.textContent = (yourPosition + 1).toString();
            numNode.parentElement.style.color = "#f4f4f4";
          }
        }

        // ✅ Account level spoof
        let iconHref = "icon-profile-level-standart";
        let isProOrVIP = false;
        let statusText = "Standard:";
        if (balance >= 10000) {
          iconHref = "icon-profile-level-vip";
          isProOrVIP = true;
          statusText = "VIP:";
        } else if (balance >= 5000) {
          iconHref = "icon-profile-level-pro";
          isProOrVIP = true;
          statusText = "Pro:";
        }

        const svgEl = document.querySelector(
          '#root > div > div.page.app__page > header > div.header__container > div[class*="usermenu"] svg'
        );
        const iconUse = svgEl?.querySelector("use");
        if (iconUse) {
          iconUse.setAttribute("xlink:href", `/profile/images/spritemap.svg#${iconHref}`);
          const svgParent = iconUse.closest("svg");
          if (svgParent && isProOrVIP) {
            svgParent.setAttribute("width", "18.24");
            svgParent.setAttribute("height", "12.98");
          } else if (svgParent) {
            svgParent.removeAttribute("width");
            svgParent.removeAttribute("height");
          }
        }

        const percentEl = document.querySelector('[class*="__levelProfit--"]');
        if (percentEl) {
          percentEl.textContent = balance >= 10000 ? "+4% profit" : balance >= 5000 ? "+2% profit" : "+0% profit";
          percentEl.style.color = "white";
        }

        const dropdownIcon = document.querySelector(
          '#root > div > div.page.app__page > header > div.header__container div[class*="usermenu"] div[class*="Dropdown"] svg'
        );
        const dropdownUse = dropdownIcon?.querySelector("use");
        if (dropdownUse) {
          dropdownUse.setAttribute("xlink:href", `/profile/images/spritemap.svg#${iconHref}`);
          const svgParent = dropdownUse.closest("svg");
          if (svgParent && isProOrVIP) {
            svgParent.setAttribute("width", "18.24");
            svgParent.setAttribute("height", "12.98");
          } else if (svgParent) {
            svgParent.removeAttribute("width");
            svgParent.removeAttribute("height");
          }
        }

        const statusTextEl = document.querySelector('[class*="__levelName--"]');
        if (statusTextEl) {
          statusTextEl.textContent = statusText;
          statusTextEl.style.color = "#ffffff80";
        }

        // ✅ Dropdown spoof
        const items = document.querySelectorAll('li[class*="selectItemRadio"]');
        if (items.length >= 2) {
          const [top, bottom] = items;

          const topName = top.querySelector('a[class*="selectName"]');
          const bottomName = bottom.querySelector('a[class*="selectName"]');
          const topBalance = top.querySelector('b[class*="selectBalance"]');
          const bottomBalance = bottom.querySelector('b[class*="selectBalance"]');
          const topTick = top.querySelector('svg[class*="selectCheck"]');
          const bottomTick = bottom.querySelector('svg[class*="selectCheck"]');

          if (topName) topName.textContent = "Live Account";
          if (bottomName) bottomName.textContent = "Demo Account";

          if (topBalance) topBalance.textContent = balanceEl.textContent;
          if (bottomBalance) {
            bottomBalance.textContent = `$${parseFloat(window.fakeDemoBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }

          if (topTick) topTick.style.display = "inline";
          if (bottomTick) bottomTick.style.display = "none";

          const topLink = top.querySelector("a");
          const bottomLink = bottom.querySelector("a");

          if (topLink) topLink.setAttribute("aria-current", "page");
          if (bottomLink) bottomLink.removeAttribute("aria-current");

          top.classList.add('---react-features-Usermenu-Dropdown-styles-module__active--P5n2A');
          bottom.classList.remove('---react-features-Usermenu-Dropdown-styles-module__active--P5n2A');
        }
      } catch (e) {
        console.error("Spoof error:", e);
      }
    }, 300);
  }
})();
