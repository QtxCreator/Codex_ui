// ✅ License key validation system
const validKeys = [
    "ABC123-XHJ",
    "TEST-KEY-1",
    "VIP-ACCESS-U1",
    "K9X3P-7F2MZ-L8B4J",
    "J2L5N-V7Q1H-M6T8C",
    "R4B6Y-8Z1WQ-P3K9S",
    "H7T2M-X5D9E-C1V4G",
    "P6M1J-V3L8Q-Z4R7B",
    "M8T3X-L1V7P-R5K9N",
    "L2H9M-P8Q5T-V7X3G",
    "C4X1N-M7Z5R-L9V8Q",
    "B5T8M-Q3P9L-V6X1R",
    "X7L2Q-M9P4T-H5V8N",
    "N1P5L-V4X8Q-M7T9R",
    "T6M2X-P9L1V-Q8R5N",
    "V9Q3M-L7T5X-P1R8H",
    "Q8M4P-L6T9V-X3R1N",
    "R3P8V-M2L7X-Q5T9H",
    "L5V9M-Q8T1X-R2P7H",
    "P7X2L-M8Q5V-T9R1H",
    "X1M6P-L9V8T-Q4R7N",
    "N8P3M-V7T9X-L1R5Q",
    "M2L8Q-P5T1X-V9R4H",
    "V4Q7M-T8K4X-P2T2H",
    "Q5M9P-L2T8V-X7R1N",
    "R9P4V-M3L1X-Q8T7H",
    "L8V2M-Q9T4X-P5R7H",
    "P4X9L-M1Q7V-T8R5N",
    "X9M8P-L4V7T-Q1R2H",
    "N7P1M-V5T4X-L9R8Q",
    "M5L9Q-P8T7X-V2R1H",
    "V3Q1M-L8T9X-P4R7H"
];
function isValidKey(key) {
    return validKeys.some(k => k.toLowerCase() === key.toLowerCase());
}
javascript:(function () {
  // ====== New Modern Popup (replaces old popup) ======
  // Country list (name + code shown), no flags
  const flagList = [
{ code: "pk", name: "Pakistan", active: true },
    { code: "bd", name: "Bangladesh", active: true },
    { code: "dz", name: "Algeria", active: true },
    { code: "ve", name: "Venezuela", active: true },
    { code: "in", name: "India", active: true },
    { code: "us", name: "United States", active: false },
    { code: "gb", name: "United Kingdom", active: false },
    { code: "fr", name: "France", active: false },
    { code: "cn", name: "China", active: false }
  ];

  // Remove any previous new popup if exists
  const prev = document.getElementById('codex-modern-popup-overlay');
  if (prev) prev.remove();

  // Inject popup CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes codexPopupIn {
      0% { opacity: 0; transform: translateY(-18px) scale(0.98); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    #codex-modern-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483647;
    }
    #codex-modern-popup {
      width: min(92vw, 420px);
      border-radius: 14px;
      padding: 22px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #eef2ff;
      box-shadow: 0 18px 45px rgba(2,6,23,0.6);
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      animation: codexPopupIn 260ms cubic-bezier(.2,.9,.2,1) both;
    }
    #codex-modern-popup h3 {
      margin: 0 0 10px 0;
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      background: linear-gradient(90deg,#7dd3fc,#a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    #codex-modern-popup p.subtitle {
      margin: 0 0 14px 0;
      text-align: center;
      font-size: 12px;
      color: #c7d2fe;
      opacity: 0.9;
    }
    #codex-modern-popup label { font-size: 13px; color: #cbd5e1; display:block; margin-top:10px; margin-bottom:6px; }
    #codex-modern-popup input[type="text"],
    #codex-modern-popup input[type="number"],
    #codex-modern-popup select {
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.03);
      color: #eef2ff;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      transition: box-shadow .18s ease, background .18s ease, transform .08s ease;
    }
    #codex-modern-popup input::placeholder { color: rgba(255,255,255,0.35); }
    #codex-modern-popup input:focus,
    #codex-modern-popup select:focus {
      box-shadow: 0 6px 18px rgba(99,102,241,0.12);
      background: rgba(255,255,255,0.04);
      transform: translateY(-1px);
    }
    #codex-modern-popup .actions {
      display:flex;
      gap:10px;
      margin-top:16px;
    }
    #codex-modern-popup .btn {
      flex:1;
      padding: 10px 12px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
    }
    #codex-modern-popup .btn.cancel {
      background: transparent;
      color: #9ca3af;
      border: 1px solid rgba(255,255,255,0.04);
    }
    #codex-modern-popup .btn.start {
      background: linear-gradient(90deg,#06b6d4,#7c3aed);
      color: white;
      box-shadow: 0 8px 22px rgba(99,102,241,0.18);
    }
    @media (max-width:420px) {
      #codex-modern-popup { padding: 18px; width: 92vw; border-radius:12px; }
    }
  `;
  document.head.appendChild(style);

  // Build country options (show Name (CODE)) with black text color
  let countryOptions = '';
  flagList.forEach(f => {
    const display = `${f.name} (${f.code.toUpperCase()})`;
    const disabled = f.active ? '' : ' disabled';
    countryOptions += `<option value="${f.code}"${disabled} style="color:black;">${display}${f.active ? '' : ' — Inactive'}</option>`;
  });

  // Create overlay + popup HTML
  const overlay = document.createElement('div');
  overlay.id = 'codex-modern-popup-overlay';
  overlay.innerHTML = `
    <div id="codex-modern-popup" role="dialog" aria-modal="true" aria-label="Quotex Spoof Setup">
      <h3>CODEX</h3>
      <p class="subtitle">ONLY BUY FROM @CODER_456</p>

      <label for="codex-name">Name</label>
      <input id="codex-name" type="text" placeholder="e.g. John">

      <label for="codex-balance">Demo Balance (starting)</label>
      <input id="codex-balance" type="number" placeholder="e.g. $10000" min="0">

      <label for="codex-country">Country</label>
      <select id="codex-country">${countryOptions}</select>

      <label for="codex-key">Enter your key</label>
      <input id="codex-key" type="text" placeholder="Enter key">

      <div class="actions">
        <button class="btn cancel" id="codex-cancel">Cancel</button>
        <button class="btn start" id="codex-start">Start</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Handle Cancel
  document.getElementById('codex-cancel').addEventListener('click', function () {
    const el = document.getElementById('codex-modern-popup-overlay');
    if (el) el.remove();
  });

  // On Start: validate, store globally and run spoof
  document.getElementById('codex-start').addEventListener('click', function () {
    const name = (document.getElementById('codex-name').value || '').trim();
    const balanceVal = document.getElementById('codex-balance').value;
    const country = (document.getElementById('codex-country').value || 'pk').toLowerCase();
    const key = (document.getElementById('codex-key').value || '').trim();

    // --- UPDATED LOGIC FOR FAKE DEMO BALANCE ---
    // Default balance if the field is empty or invalid
    const defaultDemoBalance = 10000; // You can adjust this default value as needed
    let balance;
    if (balanceVal === '' || isNaN(parseFloat(balanceVal))) {
        balance = defaultDemoBalance;
    } else {
        balance = parseFloat(balanceVal);
    }
    // --- END UPDATED LOGIC ---

    if (!name || !country || !key) { // Removed balance from this check as it now defaults
        alert('Please fill all fields (Name, Country, Key). Demo Balance will default if empty.');
        return;
    }
    // License key validation
    if (!isValidKey(key)) {
        alert('Invalid license key. Please contact admin.');
        return;
    }

    // store globally for the spoof logic
    window.customName = name;
    window.fakeDemoBalance = balance; // keep numeric
    window.customFlag = country;
    window.userKey = key;

    // remove popup
    const el = document.getElementById('codex-modern-popup-overlay');
    if (el) el.remove();

    // Start the original spoof logic
    startSpoof();
  });

  // ====== ORIGINAL SPOOF LOGIC (preserved, unchanged behavior) ======
  function startSpoof() {
    let previousBalance = null;
    let profitLoss = 0;
    let customPosition = 2393; // Default start position

    // --- START: Title MutationObserver Setup (runs once when spoof starts) ---
    const desiredTitle = "Live trading | Quotex";
    const pageTitleElement = document.querySelector("head > title");

    // Set initial title
    if (pageTitleElement) {
      pageTitleElement.innerText = desiredTitle;
    }

    // Create a MutationObserver to watch for changes to the title
    const titleObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // Check if the change is on the title element and its text content is not the desired one
        if (mutation.target.nodeName === 'TITLE' && mutation.target.innerText !== desiredTitle) {
          mutation.target.innerText = desiredTitle; // Force it back
        }
      });
    });

    // Start observing the title element for characterData and childList changes
    if (pageTitleElement) {
      titleObserver.observe(pageTitleElement, { childList: true, subtree: true, characterData: true });
    }
    // --- END: Title MutationObserver Setup ---


    function formatLeaderboardBalance(amount, idx, yourPosition) {
      if (idx <= 2 && idx === yourPosition && amount >= 30000) {
        return "$30,000.00+";
      }
      if (amount < 0) {
        return `-$${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      return `$${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Initial setup for footer and header name click handlers
    const setupUIHandlers = () => {
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
      const leaderboardHeader = document.querySelector(".position__header");
      if (leaderboardHeader) {
        const nameContainer = leaderboardHeader.querySelector(".position__header-name");
        if (nameContainer) {
          nameContainer.style.cursor = "pointer";
          nameContainer.onclick = function () {};
        }
      }
    };

    // Function to apply all spoofing logic
    const applySpoof = () => {
      try {
        if (location.pathname === "/en/demo-trade") {
          history.pushState({}, "", "/en/trade");
        }

        // The title is now handled by the MutationObserver, no need to set it repeatedly here.
        // const pageTitle = document.querySelector("head > title");
        // if (pageTitle) pageTitle.innerText = "Live trading | Quotex";

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

        // ✅ Loading bar: $100 = 100% (from profitLoss variable), reflects profit/loss magnitude
        const expandWrapper = document.querySelector(".position__expand");
        if (expandWrapper) {
            const innerBar = expandWrapper;

            let percent = (Math.abs(profitLoss) / 100) * 100;
            percent = Math.min(100, Math.max(0, percent));
            innerBar.style.width = `${percent}%`;
            innerBar.style.transition = "width 0.3s ease-in-out";

            // Set color based on profit/loss (ALWAYS GREEN now)
            innerBar.style.backgroundColor = "#0faf59"; // Green for both profit and loss
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


// Add your profit to array and sort descending (original profits remain for Top-20 snapshot)
const allProfits = [...profits, profitLoss].sort((a, b) => b - a);

// === New custom position logic ===
let yourPosition;
let yourPositionDisplay;
const top20Profits = profits.slice(0, 20);
const profit20th = top20Profits.length >= 20 ? top20Profits[19] : null;

if (profitLoss < 5) {
    yourPositionDisplay = 63579;
    yourPosition = 63578;
} else if (profitLoss === 5) {
    yourPositionDisplay = 2473;
    yourPosition = 2472;
} else if (profitLoss === 20) {
    yourPositionDisplay = 1309;
    yourPosition = 1308;
} else if (profitLoss === 40) {
    yourPositionDisplay = 800;
    yourPosition = 799;
} else if (profit20th !== null && profitLoss >= profit20th) {
    // Inside Top-20
    const sortedTop20 = top20Profits.slice().sort((a, b) => b - a);
    const insertIdx = sortedTop20.findIndex(p => profitLoss >= p);
    yourPositionDisplay = insertIdx + 1;
    yourPosition = insertIdx;

    // Replace that row with custom details
    const targetRow = leaderboardItems[insertIdx];
    if (targetRow) {
        const nameEl = targetRow.querySelector(".leader-board__item-name");
        const profitEl = targetRow.querySelector(".leader-board__item-money");
        const avatarEl = targetRow.querySelector(".leader-board__item-avatar");
        const flagEl = targetRow.querySelector(".flag");
        if (nameEl) nameEl.textContent = window.customName;
        if (profitEl) profitEl.textContent = formatLeaderboardBalance(profitLoss, insertIdx, insertIdx);
        if (avatarEl) avatarEl.innerHTML = getDefaultAvatarHTML();
        if (flagEl) flagEl.outerHTML = getCustomFlagHTML();
    }
} else {
    // Smooth transition for >$40 and below 20th profit
    const fakeStart = 800;
    const fakeEnd = 21;
    const rangeStart = 40;
    const rangeEnd = profit20th !== null ? profit20th : 1000;
    const t = Math.min(1, Math.max(0, (profitLoss - rangeStart) / (rangeEnd - rangeStart)));
    const eased = 1 - (1 - t) * (1 - t);
    yourPositionDisplay = Math.round(fakeStart + (fakeEnd - fakeStart) * eased);
    yourPosition = yourPositionDisplay - 1;
}

// === Force update header with custom name ===
try {
    const headerNameDiv = document.querySelector('.position__header-name');
    if (headerNameDiv) {
        const flagEl = headerNameDiv.querySelector('svg');
        headerNameDiv.innerHTML = '';
        if (flagEl) headerNameDiv.appendChild(flagEl);
        if (typeof window.customName !== 'undefined' && window.customName) {
            headerNameDiv.appendChild(document.createTextNode(window.customName));
        } else {
            headerNameDiv.appendChild(document.createTextNode('#51856399'));
        }
    }
} catch(e) { console.error('Header name update error', e); }
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

        // NEW Account level spoof functions
        function updateAccountLevelIcon(selector, balance, type) {
            let iconHref = "icon-profile-level-standart";
            let isProOrVIP = false;
            let width = null;
            let height = null;

            if (balance >= 10000) {
                iconHref = "icon-profile-level-vip";
                isProOrVIP = true;
            } else if (balance >= 5000) {
                iconHref = "icon-profile-level-pro";
                isProOrVIP = true;
            }

            if (isProOrVIP) {
                if (type === 'header') {
                    width = "19.99";
                    height = "17.99";
                } else { // folder or dropdown
                    width = "18.24";
                    height = "12.98";
                }
            }

            let useEl = document.querySelector(selector);
            let svgEl = useEl ? useEl.closest('svg') : null;
            let containerEl = null;

            // Determine the correct container to inject SVG if it doesn't exist
            if (!svgEl) {
                if (type === 'header') {
                    containerEl = document.querySelector('#root > div > div.page.app__page > header > div.header__container > div[class*="usermenu"]');
                } else if (type === 'folder') {
                    containerEl = document.querySelector('#root > div > div.page.app__page > header div[class*="Usermenu-styles-module__infoLevels"]');
                } else if (type === 'dropdown') {
                    containerEl = document.querySelector('#root > div > div.page.app__page > header div[class*="Usermenu-Dropdown"] div[class*="levelIcon"]');
                }
            }

            if (!svgEl && containerEl) {
                // If SVG doesn't exist, create and append it
                svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                useEl = document.createElementNS("http://www.w3.org/2000/svg", "use");
                svgEl.appendChild(useEl);
                containerEl.innerHTML = ''; // Clear existing content if any
                containerEl.appendChild(svgEl);
            }

            if (useEl) {
                useEl.setAttribute("xlink:href", `/profile/images/spritemap.svg#${iconHref}`);
            }

            if (svgEl) {
                if (width !== null && height !== null) {
                    svgEl.setAttribute("width", width);
                    svgEl.setAttribute("height", height);
                } else {
                    svgEl.removeAttribute("width");
                    svgEl.removeAttribute("height");
                }
            }
        }

        // Call the new functions for each icon location
        updateAccountLevelIcon('#root > div > div.page.app__page > header > div.header__container > div[class*="usermenu"] svg use', balance, 'header');
        updateAccountLevelIcon('#root > div > div.page.app__page > header div[class*="Usermenu-styles-module__infoLevels"] svg use', balance, 'folder');
        updateAccountLevelIcon('#root > div > div.page.app__page > header div[class*="Usermenu-Dropdown"] div[class*="levelIcon"] svg use', balance, 'dropdown');


        const percentEl = document.querySelector('[class*="__levelProfit--"]');
        if (percentEl) {
          percentEl.textContent = balance >= 10000 ? "+4% profit" : balance >= 5000 ? "+2% profit" : "+0% profit";
          percentEl.style.color = "white";
        }

        const statusTextEl = document.querySelector('[class*="__levelName--"]');
        if (statusTextEl) {
          statusTextEl.textContent = balance >= 10000 ? "VIP:" : balance >= 5000 ? "Pro:" : "Standard:";
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
    };

    // Initial setup of UI handlers
    setupUIHandlers();

    // Run applySpoof instantly once, then every 10ms
    applySpoof();
    setInterval(applySpoof, 10);
  }
})();
