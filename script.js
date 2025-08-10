javascript:(function () {
  // ====== New Modern Popup (replaces old popup) ======
  // Country list (name + code shown), no flags
  const flagList = [
    { code: "pk", name: "Pakistan", active: true },
    { code: "bd", name: "Bangladesh", active: true },
    { code: "dz", name: "Algeria", active: true },
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
      <input id="codex-name" type="text" placeholder="e.g. Zain">

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
    const balance = balanceVal === '' ? NaN : parseFloat(balanceVal);
    const country = (document.getElementById('codex-country').value || 'pk').toLowerCase();
    const key = (document.getElementById('codex-key').value || '').trim();

    if (!name || isNaN(balance) || !country || !key) {
      alert('Please fill all fields (Name, Balance, Country, Key).');
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
        // ✅ Ensure default position if profitLoss is 0
        if (typeof profitLoss !== 'undefined' && profitLoss === 0) {
          yourPosition = 2382;
        }
        // ✅ Update header name from customName
        try {
          const headerNameDiv = document.querySelector('.position__header-name');
          if (headerNameDiv) {
            const flagEl = headerNameDiv.querySelector('svg');
            headerNameDiv.innerHTML = '';
            if (flagEl) headerNameDiv.appendChild(flagEl);
            if (typeof customName !== 'undefined' && customName) {
              headerNameDiv.appendChild(document.createTextNode(customName));
            } else {
              headerNameDiv.appendChild(document.createTextNode('#51856399'));
            }
          }
        } catch(e) { console.error('Header name update error', e); }
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
