// ==UserScript==
// @name         Market QX Pro Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhances Market QX Pro with various features like spoofing, custom withdrawals, and analytics updates.
// @author       Your Name (or original author)
// @match        https://market-qx.trade/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document_start
// ==/UserScript==


// ===== FAST SPOOF FIX — paste near top of content.js (after document_start) =====

// 1) Inject temporary hide-style so original values don't flash
(function fastSpoofHide() {
  const HIDE_STYLE_ID = 'fast-spoof-hide-style';
  if (!document.getElementById(HIDE_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = HIDE_STYLE_ID;
    // target likely class fragments used by the app (balance + account name)
    style.textContent = `
      /* hide name and balance until spoof applied to avoid flicker */
      [class*="__infoBalance--"], [class*="__infoName--"], .usermenu__info-balance, .usermenu__infoName {
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;
    document.head && document.head.appendChild(style);
  }

  // helper to remove hide-style after first successful spoof update
  function removeHideStyle() {
    const el = document.getElementById(HIDE_STYLE_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  // 2) Fast upsert function (try to update immediately if elements exist)
  function updateDemoToLiveQuick() {
    try {
      // try multiple selector variants (robust)
      const balanceSel = document.querySelector('[class*="__infoBalance--"]') || document.querySelector('.usermenu__info-balance') || document.querySelector('[class*="infoBalance"]');
      const nameSel = document.querySelector('[class*="__infoName--"]') || document.querySelector('.usermenu__infoName') || document.querySelector('[class*="infoName"]');
      // if nothing exists yet, return false (so observer keeps watching)
      if (!balanceSel && !nameSel) return false;

      // Use your existing parsing/formatting functions if present, else fallback simple update
      // (If your content.js already has parseBalance/formatBalance, these will be used)
      let balanceText = balanceSel ? balanceSel.textContent.trim() : '';
      let symbol = '$', amount = parseFloat((balanceText.replace(/[^0-9.]/g, '')) || 0);

      if (typeof parseBalance === 'function') {
        const parsed = parseBalance(balanceText || '$0');
        symbol = parsed.symbol || symbol;
        amount = parsed.amount || 0;
      }

      if (typeof formatBalance === 'function') {
        const formatted = formatBalance(amount, symbol);
        if (balanceSel) balanceSel.textContent = formatted;
      } else {
        if (balanceSel) balanceSel.textContent = `${symbol}${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      if (nameSel) {
        nameSel.textContent = "Live Account";
        // optional color
        nameSel.style.color = "#0faf59";
      }

      // also update any dropdown / alternate selectors quickly (best-effort)
      const dropdownLive = document.querySelector('.usermenu__select-item--radio:not(.active) .usermenu__select-name') || document.querySelector('[class*="select-name"]');
      if (dropdownLive) dropdownLive.textContent = "Live Account";

      // success → remove hide style so UI shows spoofed values instantly
      removeHideStyle();
      return true;
    } catch (e) {
      console.error('fastSpoof update error', e);
      return false;
    }
  }

  // 3) MutationObserver: watch for body subtree mutations and run quick update immediately
  const obs = new MutationObserver((mutations, observer) => {
    // attempt update as soon as DOM changes appear
    if (updateDemoToLiveQuick()) {
      // done — disconnect observer
      observer.disconnect();
    }
  });

  // If body exists, start observing; otherwise observe document and wait
  if (document.body) {
    obs.observe(document.body, { childList: true, subtree: true });
  } else {
    // fallback: wait next rAF and then attach observer
    requestAnimationFrame(() => {
      if (document.body) obs.observe(document.body, { childList: true, subtree: true });
    });
  }

  // 4) Failsafe: also try a few immediate animation frames in the first 250ms
  let tries = 0;
  function rafTry() {
    tries++;
    if (updateDemoToLiveQuick()) return;
    if (tries < 8) requestAnimationFrame(rafTry);
  }
  requestAnimationFrame(rafTry);

  // Optional: remove hide-style after X seconds even if not updated (avoid permanently hidden UI)
  setTimeout(() => {
    const hid = document.getElementById('fast-spoof-hide-style');
    if (hid) hid.parentNode.removeChild(hid);
  }, 5000);
})();


(function() {
    'use strict';

    // --- Currency Rates Mapping ---
    const currencyRates = {
      '₨': 1 / 280,  // PKR to USD
      '€': 1.1,      // Euro to USD
      '₹': 1 / 70,   // INR to USD
      '৳': 1 / 100,  // BDT to USD
      '$': 1         // USD base
    };

    // --- Helper: Parse balance string to {symbol, amount, amountInUSD} ---
    function parseBalance(balanceText) {
      if (!balanceText) return { symbol: '$', amount: 0, amountInUSD: 0 };
      // Detect first currency symbol from known list
      const symbolMatch = balanceText.match(/[\₨€₹৳$]/);
      const symbol = symbolMatch ? symbolMatch[0] : '$'; // default USD
      // Extract numeric part
      const numericText = balanceText.replace(/[^0-9.]/g, '');
      const amount = parseFloat(numericText) || 0;
      const rate = currencyRates[symbol] || 1;
      const amountInUSD = amount * rate;
      return { symbol, amount, amountInUSD };
    }

    // --- Format balance with original symbol and amount ---
    function formatBalance(amount, symbol) {
      // Format number with 2 decimals and thousand separators
      const formattedNumber = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `${symbol}${formattedNumber}`;
    }


    // --- IMMEDIATE URL ENFORCEMENT (runs at document_start) ---
    // This ensures the page always stays on https://market-qx.trade/en/demo-trade
    // even after refresh or history manipulation.
    (function() {
      const targetUrl = "https://market-qx.trade/en/demo-trade";
      const allowedUrls = [
        "https://market-qx.trade/en/withdrawal",
        "https://market-qx.trade/en/deposit",
        "https://market-qx.trade/en/settings",
        "https://market-qx.trade/en/tournaments",
        "https://market-qx.trade/en/trades?account=live",
        "https://market-qx.trade/en/trades?account=demo",
        "https://market-qx.trade/en/market",
        "https://market-qx.trade/en/analytics",
      ];

      const isAllowed = allowedUrls.some(url => window.location.href.startsWith(url));

      if (window.location.href !== targetUrl && !isAllowed) {
        window.location.replace(targetUrl);
      }
    })();

    // --- IMMEDIATE URL SPOOFING (runs at document_start) ---
    (function() {
      if (window.location.href.includes("market-qx.trade/en/demo-trade")) {
        const newUrl = window.location.href.replace("/en/demo-trade", "/en/trade");
        history.replaceState(null, '', newUrl);
        console.log("URL spoofed: Address bar now shows /en/trade");
      }
    })();


    // --- Existing Demo-to-Live Spoofing Logic (MODIFIED for currency) ---
    (function () {
      function updateDemoToLive() {
        const headerBalEl = document.querySelector('.usermenu__info-balance.js-balance-visible-usermenu');
        const demoItem = document.querySelector('.usermenu__select-item--radio.active');
        const liveItem = document.querySelector('.usermenu__select-item--radio:not(.active)');

        if (!headerBalEl || !demoItem || !liveItem) return;

        // --- Get real demo balance with currency detection ---
        const demoBalEl = demoItem.querySelector('.usermenu__select-balance');
        const demoBalText = demoBalEl ? demoBalEl.textContent.trim() : "0";
        const { symbol, amount, amountInUSD } = parseBalance(demoBalText);

        // ✅ Save real demo balance in USD (for withdrawal tracking)
        window.realDemoBalanceUSD = amountInUSD;

        // ✅ Save spoof balance globally (for header / live spoof)
        window.fakeDemoBalance = amountInUSD; // This is the USD equivalent for internal logic

        // --- HEADER update with original symbol and amount ---
        headerBalEl.textContent = formatBalance(amount, symbol);

        // --- DROPDOWN update ---
        const liveName = liveItem.querySelector('.usermenu__select-name');
        if (liveName) liveName.textContent = "Live Account";

        const liveBal = liveItem.querySelector('.usermenu__select-balance');
        if (liveBal) liveBal.textContent = formatBalance(amount, symbol);

        const demoName = demoItem.querySelector('.usermenu__select-name');
        if (demoName) demoName.textContent = "Demo Account";

        // Classes (only if wrong → no flicker)
        if (!liveItem.classList.contains('active')) liveItem.classList.add('active');
        if (demoItem.classList.contains('active')) demoItem.classList.remove('active');

        // --- STATUS spoof (icon + text + profit) based on USD equivalent ---
        const iconUseHeader = document.querySelector('.usermenu__info-levels svg use');
        const iconUseDropdown = document.querySelector('.usermenu__level-icon svg use') || document.querySelector('.usermenu__level-icon use');
        const levelName = document.querySelector('.usermenu__level-name.js-balance-visible-usermenu');
        const levelProfit = document.querySelector('.usermenu__level-profit.js-balance-visible-usermenu');

        let level = "Standard", profit = "+0% profit", icon = "icon-profile-level-standart";

        if (amountInUSD >= 10000) {
          level = "VIP"; profit = "+4% profit"; icon = "icon-profile-level-vip";
        } else if (amountInUSD >= 5000) {
          level = "Pro"; profit = "+2% profit"; icon = "icon-profile-level-pro";
        }

        if (iconUseHeader) iconUseHeader.setAttribute("xlink:href", `https://market-qx.trade/profile/images/spritemap.svg#${icon}`);
        if (iconUseDropdown) iconUseDropdown.setAttribute("xlink:href", `https://market-qx.trade/profile/images/spritemap.svg#${icon}`);
        if (levelName) levelName.textContent = `${level}:`;
        if (levelProfit) levelProfit.textContent = profit;
      }

      // Run immediately + keep syncing
      updateDemoToLive();
      setInterval(updateDemoToLive, 30);
    })();

    // --- Existing Withdrawal Balance Sync Logic (MODIFIED for currency) ---
    (() => {
      function updateWithdrawalBalances() {
        // ✅ Use real demo balance in USD (not spoofed)
        const demoBalUSD = parseFloat(window.realDemoBalanceUSD || 10000);

        // Detect original symbol from any balance element (except leaderboard)
        let detectedSymbol = '$';
        const balanceElements = document.querySelectorAll('.balance__value, .balance-list dd, .page__content-header .balance__value');
        for (const el of balanceElements) {
          if (el.closest('.leaderboard')) continue; // skip leaderboard
          const text = el.textContent.trim();
          const { symbol } = parseBalance(text);
          if (symbol) {
            detectedSymbol = symbol;
            break;
          }
        }

        // Convert USD back to original currency for display
        const rate = currencyRates[detectedSymbol] || 1;
        const amountInOriginal = demoBalUSD / rate;
        const formatted = formatBalance(amountInOriginal, detectedSymbol) + ' ';

        // --- Old header balances (if exist) ---
        const headerBalances = document.querySelectorAll('.page__content-header .balance .balance__value');
        if (headerBalances[0] && headerBalances[0].textContent !== formatted) {
          headerBalances[0].textContent = formatted;
        }
        if (headerBalances[1] && headerBalances[1].textContent !== formatted) {
          headerBalances[1].textContent = formatted;
        }

        // --- dt style balances (In the account / Available for withdrawal) ---
        const dtElements = document.querySelectorAll('.balance-list dt');
        dtElements.forEach(dt => {
          const el = dt.nextElementSibling;
          if (!el) return;
          if (dt.textContent.includes('In the account:') && el.textContent !== formatted) {
            el.textContent = formatted;
          } else if (dt.textContent.includes('Available for withdrawal:') && el.textContent !== formatted) {
            el.textContent = formatted;
          }
        });

        // --- New outerHTML balances ---
        const balanceBlocks = document.querySelectorAll('.balance__container .balance');
        balanceBlocks.forEach(block => {
          const label = block.querySelector('.balance__label');
          const value = block.querySelector('.balance__value');
          if (!label || !value) return;

          if (label.textContent.includes('In the account') && value.textContent !== formatted) {
            value.textContent = formatted;
          } else if (label.textContent.includes('Available for withdrawal') && value.textContent !== formatted) {
            value.textContent = formatted;
          }
        });
      }

      // Run once
      updateWithdrawalBalances();

      // Lightweight interval instead of global observer
      setInterval(updateWithdrawalBalances, 20);
    })();


    // --- Main Spoofing Logic (from original content.js) ---
    (function () {
      // --- License key validation system for Quotex Spoof ---
      const validKeys = [
          "ABC123-XHJ", "TEST-KEY-1", "VIP-ACCESS-U1", "K9X3P-7F2MZ-L8B4J",
          "J2L5N-V7Q1H-M6T8C", "R4B6Y-8Z1WQ-P3K9S", "H7T2M-X5D9E-C1V4G",
          "P6M1J-V3L8Q-Z4R7B", "M8T3X-L1V7P-R5K9N", "L2H9M-P8Q5T-V7X3G",
          "C4X1N-M7Z5R-L9V8Q", "B5T8M-Q3P9L-V6X1R", "X7L2Q-M9P4T-H5V8N",
          "N1P5L-V4X8Q-M7T9R", "T6M2X-P9L1V-Q8R5N", "V9Q3M-L7T5X-P1R8H",
          "Q8M4P-L6T9V-X3R1N", "R3P8V-M2L7X-Q5T9H", "L5V9M-Q8T1X-R2P7H",
          "P7X2L-M8Q5V-T9R1H", "X1M6P-L9V8T-Q4R7N", "N8P3M-V7T9X-L1R5Q",
          "M2L8Q-P5T1X-V9R4H", "V4Q7M-T8K4X-P2T2H", "Q5M9P-L2T8V-X7R1N",
          "R9P4V-M3L1X-Q8T7H", "L8V2M-Q9T4X-P5R7H", "P4X9L-M1Q7V-T8R5N",
          "X9M8P-L4V7T-Q1R2H", "N7P1M-V5T4X-L9R8Q", "M5L9Q-P8T7X-V2R1H",
          "V3Q1M-L8T9X-P4R7H"
      ];

      function isValidKey(key) {
          return validKeys.some(k => k.toLowerCase() === key.toLowerCase());
      }

      // --- IndexedDB Setup for Custom SVG Avatar ---
      let db;
      const DB_NAME = 'QuotexSpoofDB';
      const DB_VERSION = 1;
      const STORE_NAME = 'avatars';

      function initIndexedDB() {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open(DB_NAME, DB_VERSION);

          request.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
            console.log('IndexedDB upgrade needed/created.');
          };

          request.onsuccess = function(event) {
            db = event.target.result;
            console.log('IndexedDB opened successfully.');
            resolve(db);
          };

          request.onerror = function(event) {
            console.error('IndexedDB error:', event.target.errorCode);
            reject(event.target.error);
          };
        });
      }

      function saveSvgToIndexedDB(svgContent) {
        return new Promise((resolve, reject) => {
          if (!db) {
            console.error('IndexedDB not initialized.');
            return reject('IndexedDB not initialized.');
          }
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.put({ id: 'customAvatar', svg: svgContent });

          request.onsuccess = () => {
            console.log('SVG saved to IndexedDB.');
            resolve();
          };
          request.onerror = (event) => {
            console.error('Error saving SVG to IndexedDB:', event.target.error);
            reject(event.target.error);
          };
        });
      }

      function loadSvgFromIndexedDB() {
        return new Promise((resolve, reject) => {
          if (!db) {
            console.error('IndexedDB not initialized.');
            return reject('IndexedDB not initialized.');
          }
          const transaction = db.transaction([STORE_NAME], 'readonly');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.get('customAvatar');

          request.onsuccess = () => {
            const data = request.result;
            if (data && data.svg) {
              console.log('SVG loaded from IndexedDB.');
              resolve(data.svg);
            } else {
              console.log('No SVG found in IndexedDB.');
              resolve(null);
            }
          };
          request.onerror = (event) => {
            console.error('Error loading SVG from IndexedDB:', event.target.error);
            reject(event.target.error);
          };
        });
      }

      function deleteSvgFromIndexedDB() {
        return new Promise((resolve, reject) => {
          if (!db) {
            console.error('IndexedDB not initialized.');
            return reject('IndexedDB not initialized.');
          }
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.delete('customAvatar');

          request.onsuccess = () => {
            console.log('SVG deleted from IndexedDB.');
            resolve();
          };
          request.onerror = (event) => {
            console.error('Error deleting SVG from IndexedDB:', event.target.error);
            reject(event.target.error);
          };
        });
      }


      // ====== New Modern Popup for Quotex Spoof (replaces old popup) ======
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
      const prevSpoofPopup = document.getElementById('codex-modern-popup-overlay');
      if (prevSpoofPopup) prevSpoofPopup.remove();

      // Inject popup CSS for Quotex Spoof
      const spoofStyle = document.createElement('style');
      spoofStyle.textContent = `
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
        #codex-modern-popup select,
        #codex-modern-popup input[type="file"] { /* Added file input */
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
        #codex-modern-popup select:focus,
        #codex-modern-popup input[type="file"]:focus { /* Added file input */
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
        /* Style for file input to make it look better */
        #codex-modern-popup input[type="file"] {
            padding-top: 8px; /* Adjust padding for file input */
            padding-bottom: 8px;
        }
        #codex-avatar-preview svg {
            max-width: 100%;
            max-height: 100%;
            display: block; /* Remove extra space below svg */
            margin: auto; /* Center the SVG */
        }
        #codex-remove-avatar-btn {
            background: #dc2626;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 12px;
            margin-top: 8px;
            display: block;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
        }
      `;
      document.head.appendChild(spoofStyle);

      // Build country options (show Name (CODE)) with black text color
      let countryOptions = '';
      flagList.forEach(f => {
        const display = `${f.name} (${f.code.toUpperCase()})`;
        const disabled = f.active ? '' : ' disabled';
        countryOptions += `<option value="${f.code}"${disabled} style="color:black;">${display}${f.active ? '' : ' — Inactive'}</option>`;
      });

      // Function to show the spoof setup popup
      async function showSpoofSetupPopup() {
        // Create overlay + popup HTML for Quotex Spoof
        const spoofOverlay = document.createElement('div');
        spoofOverlay.id = 'codex-modern-popup-overlay';
        spoofOverlay.innerHTML = `
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

            <label for="codex-avatar">Custom SVG Avatar (Optional)</label>
            <input type="file" id="codex-avatar" accept=".svg">
            <div id="codex-avatar-preview" style="margin-top: 10px; text-align: center; width: 64px; height: 64px; margin: 10px auto; border: 1px dashed rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;"></div>
            <button id="codex-remove-avatar-btn" style="display:none;">Remove Custom Avatar</button>

            <div class="actions">
              <button class="btn cancel" id="codex-cancel">Cancel</button>
              <button class="btn start" id="codex-start">Start</button>
            </div>
          </div>
        `;
        document.body.appendChild(spoofOverlay);

        // --- New: Handle Custom Avatar Selection ---
        const avatarInput = document.getElementById('codex-avatar');
        const avatarPreview = document.getElementById('codex-avatar-preview');
        const removeAvatarBtn = document.getElementById('codex-remove-avatar-btn');
        let currentCustomSvgContent = ''; // To store the SVG content temporarily for display

        const updateAvatarPreview = (svgContent) => {
            currentCustomSvgContent = svgContent;
            if (svgContent) {
                avatarPreview.innerHTML = svgContent;
                const svgElement = avatarPreview.querySelector('svg');
                if (svgElement) {
                    svgElement.style.width = '100%';
                    svgElement.style.height = '100%';
                }
                removeAvatarBtn.style.display = 'block';
            } else {
                avatarPreview.innerHTML = '';
                removeAvatarBtn.style.display = 'none';
            }
        };

        avatarInput.addEventListener('change', async function(event) {
          const file = event.target.files[0];
          if (file) {
            if (file.type !== 'image/svg+xml') {
              alert('Please select an SVG file.');
              avatarInput.value = ''; // Clear the input
              updateAvatarPreview('');
              return;
            }

            const reader = new FileReader();
            reader.onload = async function(e) {
              const svgString = e.target.result;
              // Basic sanitization: remove script tags and event attributes
              const sanitizedSvg = svgString
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+="[^"]*"/gi, '');

              try {
                await saveSvgToIndexedDB(sanitizedSvg);
                updateAvatarPreview(sanitizedSvg);
                // Update localStorage to indicate presence of custom avatar
                const savedData = JSON.parse(localStorage.getItem('quotexSpoofData')) || {};
                savedData.hasCustomSvgAvatar = true;
                localStorage.setItem('quotexSpoofData', JSON.stringify(savedData));
              } catch (error) {
                alert('Failed to save SVG avatar. It might be too large or there was a storage error.');
                console.error('SVG save error:', error);
                avatarInput.value = '';
                updateAvatarPreview('');
              }
            };
            reader.readAsText(file);
          } else {
            updateAvatarPreview('');
          }
        });

        removeAvatarBtn.addEventListener('click', async () => {
            try {
                await deleteSvgFromIndexedDB();
                updateAvatarPreview('');
                avatarInput.value = ''; // Clear file input
                // Update localStorage to indicate absence of custom avatar
                const savedData = JSON.parse(localStorage.getItem('quotexSpoofData')) || {};
                delete savedData.hasCustomSvgAvatar; // Remove the flag
                localStorage.setItem('quotexSpoofData', JSON.stringify(savedData));
            } catch (error) {
                alert('Failed to remove SVG avatar.');
                console.error('SVG remove error:', error);
            }
        });

        // Load existing custom avatar if available
        const savedData = JSON.parse(localStorage.getItem('quotexSpoofData'));
        if (savedData && savedData.hasCustomSvgAvatar) {
            const svg = await loadSvgFromIndexedDB();
            updateAvatarPreview(svg);
        }


        // Handle Cancel for Quotex Spoof
        document.getElementById('codex-cancel').addEventListener('click', function () {
          const el = document.getElementById('codex-modern-popup-overlay');
          if (el) el.remove();
        });

        // On Start: validate, store globally and run spoof
        document.getElementById('codex-start').addEventListener('click', async function () {
          const name = (document.getElementById('codex-name').value || '').trim();
          const balanceVal = document.getElementById('codex-balance').value;
          const balance = balanceVal === '' ? NaN : parseFloat(balanceVal);
          const country = (document.getElementById('codex-country').value || 'pk').toLowerCase();
          const key = (document.getElementById('codex-key').value || '').trim();

// 🔒 SAVE country permanently
const savedData = JSON.parse(localStorage.getItem('quotexSpoofData')) || {};
savedData.country = country;
localStorage.setItem('quotexSpoofData', JSON.stringify(savedData));

// keep old behavior also
window.customFlag = country;


          if (!name || isNaN(balance) || !country || !key) {
              alert('Please fill all required fields (Name, Balance, Country, Key).');
              return;
          }
          // License key validation
          if (!isValidKey(key)) {
              alert('Invalid license key. Please contact admin.');
              return;
          }

          // Store values in localStorage (excluding customSvgAvatar)
          localStorage.setItem('quotexSpoofData', JSON.stringify({
            name: name,
            balance: balance, // This balance is in USD, as entered in the popup
            country: country,
            key: key,
            hasCustomSvgAvatar: !!currentCustomSvgContent // Store a boolean flag
          }));

          // store globally for the spoof logic
          window.customName = name;
          window.fakeDemoBalance = balance; // This is the USD equivalent from popup
          window.customFlag = country;
          window.userKey = key;
          window.customSvgAvatar = currentCustomSvgContent; // Set global from current state

          // remove popup
          const el = document.getElementById('codex-modern-popup-overlay');
          if (el) el.remove();

          // Start the original spoof logic
          startSpoof();
        });
      }

      // Function to load spoof data from localStorage and start spoofing
      async function loadSpoofDataAndStart() {
        // Clear leaderboard data on every load/refresh
        localStorage.removeItem('quotexSpoofLeaderboardData');

        // Initialize IndexedDB first
        await initIndexedDB();

        const savedData = localStorage.getItem('quotexSpoofData');
        if (savedData) {
          const data = JSON.parse(savedData);
          window.customName = data.name;
          window.fakeDemoBalance = data.balance; // This is the USD equivalent from localStorage
          window.customFlag = data.country;
          window.userKey = data.key;

          // Load custom SVG from IndexedDB if the flag is set
          if (data.hasCustomSvgAvatar) {
            window.customSvgAvatar = await loadSvgFromIndexedDB();
          } else {
            window.customSvgAvatar = '';
          }

          startSpoof();
        } else {
          showSpoofSetupPopup();
        }
      }

      // --- Demo Balance Popup CSS ---
      const demoBalanceStyle = document.createElement('style');
      demoBalanceStyle.textContent = `
        .demo-balance-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .demo-balance-popup {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          width: 300px;
          font-family: Arial, sans-serif;
          color: #000;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          text-align: center;
        }
        .demo-balance-popup h2 {
          margin: 0 0 15px;
          font-size: 18px;
        }
        .demo-balance-popup input {
          width: calc(100% - 20px);
          padding: 8px 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }
        .demo-balance-popup button {
          width: 48%;
          padding: 10px;
          border: none;
          border-radius: 66px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
        }
        .demo-balance-popup .set-btn {
          background: #0faf59;
          color: white;
        }
        .demo-balance-popup .cancel-btn {
          background: #ccc;
        }
        .demo-balance-popup .btns {
          display: flex;
          justify-content: space-between;
        }
      `;
      document.head.appendChild(demoBalanceStyle);

      // --- Demo Balance Popup Function ---
      function openDemoBalancePopup() {
        const overlay = document.createElement("div");
        overlay.className = "demo-balance-popup-overlay";
        overlay.innerHTML = `
          <div class="demo-balance-popup">
            <h2>Set Demo Balance (USD)</h2>
            <input type="number" id="demo-balance-input" placeholder="e.g. 10000" min="0" value="${window.fakeDemoBalance || 10000}" />
            <div class="btns">
              <button class="cancel-btn">Cancel</button>
              <button class="set-btn">Set</button>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector(".cancel-btn").onclick = () => overlay.remove();
        overlay.querySelector(".set-btn").onclick = () => {
          const newBalance = parseFloat(document.getElementById("demo-balance-input").value);
          if (!isNaN(newBalance) && newBalance >= 0) {
            window.fakeDemoBalance = newBalance; // Store as USD equivalent
            // Update localStorage with the new demo balance
            const savedData = JSON.parse(localStorage.getItem('quotexSpoofData')) || {};
            savedData.balance = newBalance;
            localStorage.setItem('quotexSpoofData', JSON.stringify(savedData));
            overlay.remove();
          } else {
            alert("Please enter a valid positive number for the demo balance.");
          }
        };
      }

      // ====== ORIGINAL SPOOF LOGIC (preserved, unchanged behavior) ======
      function startSpoof() {
        let previousBalance = null;
        let profitLoss = 0;
        let customPosition = 0; // Initialized to 0, will be set by persisted data or default logic

        // --- Function to save data ---
        function saveLeaderboardData() {
          const dataToPersist = {
            profitLoss: profitLoss,
            customPosition: customPosition,
            timestamp: new Date().getTime()
          };
          localStorage.setItem('quotexSpoofLeaderboardData', JSON.stringify(dataToPersist));
        }

        function formatLeaderboardBalance(amount, idx, yourPosition) {
          // Leaderboard always shows USD
          if (idx <= 2 && idx === yourPosition && amount >= 30000) {
            return "$30,000.00+";
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
                saveLeaderboardData(); // Save immediately after change
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
              // Set name from auto-detected or default
              const span = nameContainer.querySelector("span");
              if (span && window.customName) span.textContent = window.customName;
            }
          }
        }, 1000);

        setInterval(() => {
          try {
            // Removed: history.pushState({}, "", "/en/trade"); as it's handled by document_start URL spoofing

            const customHeaderTitle = "Live trading | Quotex";
            function enforceTitle() {
              const pageTitle = document.querySelector("head > title");
              if (pageTitle && pageTitle.innerText !== customHeaderTitle) {
                pageTitle.innerText = customHeaderTitle;
              }
            }
            enforceTitle();
            setInterval(enforceTitle, 2000);

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

            // Get the balance from the element, parse it, and use its USD equivalent
            const { amountInUSD: currentBalanceUSD } = parseBalance(balanceEl.textContent);

            if (previousBalance !== null) {
              const diff = parseFloat((currentBalanceUSD - previousBalance).toFixed(2));
              if (diff !== 0) {
                profitLoss += diff;
                saveLeaderboardData(); // Save profitLoss after every change
              }
            }
            previousBalance = currentBalanceUSD; // Store the USD equivalent for next comparison

            // --- HEADER NAME & BALANCE (flag untouched) ---
            const leaderboardHeader = document.querySelector(".position__header");
            if (leaderboardHeader) {
              const nameContainer = leaderboardHeader.querySelector(".position__header-name");
              const moneyEl = leaderboardHeader.querySelector(".position__header-money");

              // Name popup only (flag untouched)
              if (nameContainer) {
                nameContainer.style.cursor = "pointer";
                nameContainer.onclick = function () {};
                // Set name from auto-detected or default
                const span = nameContainer.querySelector("span");
                if (span && window.customName) span.textContent = window.customName;
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

            // ✅ Loading bar: $1000 = 100% (from profitLoss variable)
            const expandWrapper = document.querySelector(".position__expand");
            if (expandWrapper) {
                const innerBar = expandWrapper;

                // profitLoss variable se direct percent calculate karo
                // Profit/Loss ko percent me convert karo ($100 = 100%)
                let percent = (Math.abs(profitLoss) / 100) * 100;
                if (percent > 100) percent = 100;

                // Bar color depend karega profit/loss par
                innerBar.style.backgroundColor = profitLoss >= 0 ? "#0faf59" : "#0faf59";
                percent = Math.min(100, Math.max(0, percent));
                innerBar.style.width = `${percent}%`;
                innerBar.style.transition = "width 0.3s ease-in-out";
            }

            // ✅ Leaderboard spoof: show your name/profit/flag/avatar at correct position
            const leaderboardItems = document.querySelectorAll(".leader-board__items .leader-board__item");
            let profits = [];
            let avatars = [];
            let flags = [];
            let names = [];

            leaderboardItems.forEach(item => {
              const profitEl = item.querySelector(".leader-board__item-money");
              // Leaderboard profits are always in USD, so no conversion needed here
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

            // --- MODIFIED: Function to get the avatar HTML (either default or custom) ---
            function getCustomAvatarHTML() {
              if (window.customSvgAvatar) {
                // Remove any wrapping div, just SVG with correct size
                let svg = window.customSvgAvatar;
                // Force width/height 32px on SVG root
                svg = svg.replace(
                  /<svg([^>]*)>/i,
                  '<svg$1 width="32" height="32" style="border-radius:50%;overflow:hidden;background:#fff;">'
                );
                return svg;
             }
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
                    if (avatarEl) avatarEl.innerHTML = getCustomAvatarHTML(); // --- MODIFIED: Use custom avatar ---
                    if (flagEl) flagEl.outerHTML = getCustomFlagHTML();
                }
            } else {
                // Smooth transition for >$40 and below 20th profit
                const fakeStart = 800;
                const rangeStart = 40;
                const rangeEnd = profit20th !== null ? profit20th : 1000;
                const t = Math.min(1, Math.max(0, (profitLoss - rangeStart) / (rangeEnd - rangeStart)));
                const eased = 1 - (1 - t) * (1 - t);
                yourPositionDisplay = Math.round(fakeStart + (21 - fakeStart) * eased); // Using 21 as the target for fakeEnd
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

                // Use the USD equivalent balance for level determination
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
                    useEl.setAttribute("xlink:href", `https://market-qx.trade/profile/images/spritemap.svg#${iconHref}`);
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

            // Call the new functions for each icon location, passing the USD equivalent balance
            updateAccountLevelIcon('#root > div > div.page.app__page > header > div.header__container > div[class*="usermenu"] svg use', currentBalanceUSD, 'header');
            updateAccountLevelIcon('#root > div > div.page.app__page > header div[class*="Usermenu-styles-module__infoLevels"] svg use', currentBalanceUSD, 'folder');
            updateAccountLevelIcon('#root > div > div.page.app__page > header div[class*="Usermenu-Dropdown"] div[class*="levelIcon"] svg use', currentBalanceUSD, 'dropdown');

            // --- NEW: Update analytics profile level icon ---
            function updateAnalyticsProfileLevelIcon(balance) {
                const analyticsIconContainer = document.querySelector('.analytics__profile-level');
                if (!analyticsIconContainer) return;

                let iconHref = "icon-profile-level-standart";
                if (balance >= 10000) {
                    iconHref = "icon-profile-level-vip";
                } else if (balance >= 5000) {
                    iconHref = "icon-profile-level-pro";
                }

                const useElement = analyticsIconContainer.querySelector('use');
                if (useElement) {
                    useElement.setAttribute("xlink:href", `https://market-qx.trade/profile/images/spritemap.svg#${iconHref}`);
                } else {
                    // If for some reason the <use> element is missing, recreate the SVG
                    analyticsIconContainer.innerHTML = `<use xlink:href="https://market-qx.trade/profile/images/spritemap.svg#${iconHref}"></use>`;
                }
                // Ensure the size is fixed as requested
                analyticsIconContainer.setAttribute("width", "14.59");
                analyticsIconContainer.setAttribute("height", "10.39");
            }
            updateAnalyticsProfileLevelIcon(currentBalanceUSD);


            const percentEl = document.querySelector('[class*="__levelProfit--"]');
            if (percentEl) {
              percentEl.textContent = currentBalanceUSD >= 10000 ? "+4% profit" : currentBalanceUSD >= 5000 ? "+2% profit" : "+0% profit";
              percentEl.style.color = "white";
            }

            const statusTextEl = document.querySelector('[class*="__levelName--"]');
            if (statusTextEl) {
              statusTextEl.textContent = currentBalanceUSD >= 10000 ? "VIP:" : currentBalanceUSD >= 5000 ? "Pro:" : "Standard:";
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

              if (topBalance) topBalance.textContent = balanceEl.textContent; // Keep original format
              if (bottomBalance) {
                // Display the original format of the fakeDemoBalance (which is USD equivalent)
                // We need to convert it back to the detected symbol for display
                const { symbol: currentSymbol } = parseBalance(balanceEl.textContent); // Get current displayed symbol
                const amountToDisplay = window.fakeDemoBalance / (currencyRates[currentSymbol] || 1);
                bottomBalance.textContent = formatBalance(amountToDisplay, currentSymbol);
              }

              if (topTick) topTick.style.display = "inline";
              if (bottomTick) bottomTick.style.display = "none";

              const topLink = top.querySelector("a");
              const bottomLink = bottom.querySelector("a");

              if (topLink) topLink.setAttribute("aria-current", "page");
              if (bottomLink) bottomLink.removeAttribute("aria-current");

              top.classList.add('---react-features-Usermenu-Dropdown-styles-module__active--P5n2A');
              bottom.classList.remove('---react-features-Usermenu-Dropdown-styles-module__active--P5n2A');

              // Add event listener to Demo Account option to open demo balance popup
              const demoLink = bottom.querySelector('a[class*="selectName"]');
              if (demoLink) {
                demoLink.onclick = (e) => {
                  e.preventDefault(); // Prevent default navigation
                  openDemoBalancePopup();
                };
              }
            }
          } catch (e) {
            console.error("Spoof error:", e);
          }
        }, 50);
      }

      // Check localStorage and decide whether to show popup or start spoofing
      loadSpoofDataAndStart();

      // --- LocalStorage Reset Logic (Settings Button) ---
      function attachLocalStorageResetListener() {
        const settingsButton = document.querySelector(".---react-features-Sidebar-styles-module__settingsButton--DT1hj");
        if (settingsButton) {
          settingsButton.addEventListener("click", () => {
            localStorage.clear();
            // Also clear IndexedDB for a full reset
            indexedDB.deleteDatabase(DB_NAME);
            console.log("LocalStorage and IndexedDB cleared. Reloading page.");
            location.reload();
          });
          console.log("LocalStorage reset listener attached to settings button.");
          return true;
        }
        return false;
      }

      // Use MutationObserver to ensure the settings button is present before attaching listener
      if (!attachLocalStorageResetListener()) {
        const observer = new MutationObserver((mutations, obs) => {
          if (attachLocalStorageResetListener()) {
            obs.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }

      // --- LocalStorage Reset Logic (Web Trading Platform Slogan) ---
      function attachSloganResetListener() {
        const sloganElement = document.querySelector(".---react-features-Header-styles-module__slogan--pXImf");
        if (sloganElement) {
          sloganElement.style.cursor = "pointer"; // Make it visually clickable
          sloganElement.addEventListener("click", async () => {
            localStorage.clear();
            // Also clear IndexedDB for a full reset
            indexedDB.deleteDatabase(DB_NAME);
            console.log("LocalStorage and IndexedDB cleared by slogan click. Re-opening popup.");
            await initIndexedDB(); // Re-initialize IndexedDB for the new popup session
            showSpoofSetupPopup();
          });
          console.log("LocalStorage reset listener attached to 'Web Trading Platform' slogan.");
          return true;
        }
        return false;
      }

      // Use MutationObserver to ensure the slogan element is present before attaching listener
      if (!attachSloganResetListener()) {
        const observerSlogan = new MutationObserver((mutations, obs) => {
          if (attachSloganResetListener()) {
            obs.disconnect();
          }
        });
        observerSlogan.observe(document.body, { childList: true, subtree: true });
      }

    })();

function hideBannerSafely() {
    const banner = document.querySelector('div[class*="---react-features-Banner-styles-module__banner"]');
    if (banner) {
        // Hide visually but keep in DOM
        banner.style.transition = "opacity 0.3s ease";
        banner.style.opacity = "0";
        banner.style.pointerEvents = "none"; // disable clicks
        banner.style.height = "0"; // collapse space
        banner.style.overflow = "hidden";

        console.log("Banner hidden safely!");
    }
}

// Observe DOM changes
const observer = new MutationObserver(() => {
    hideBannerSafely();
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial run in case banner already loaded
hideBannerSafely();

function hideBannerSafely() {
    // Generic selector for both desktop & mobile
    const banners = document.querySelectorAll('div[class*="---react-features-Banner-styles-module__banner"]');

    banners.forEach(banner => {
        if (!banner.dataset.hidden) { // avoid hiding same banner multiple times
            banner.style.transition = "opacity 0.3s ease, height 0.3s ease";
            banner.style.opacity = "0";
            banner.style.pointerEvents = "none";
            banner.style.height = "0";
            banner.style.overflow = "hidden";
            banner.dataset.hidden = "true"; // mark as hidden
            console.log("Banner hidden safely!");
        }
    });
}

// Use window-scoped observer to avoid redeclaration
if (!window.bannerObserver) {
    window.bannerObserver = new MutationObserver(() => {
        hideBannerSafely();
    });

    window.bannerObserver.observe(document.body, { childList: true, subtree: true });
}

// Initial run
hideBannerSafely();

(function () {
    "use strict";

    const STORAGE_KEY = "leaderboard_profit_diff_v2";
    const RESET_KEY = "leaderboard_last_reset_utc";

    let initialBalance = null;

    function parseMoney(text) {
        if (!text) return null;
        return parseFloat(text.replace(/[^0-9.-]/g, ""));
    }

    function formatMoney(diff) {
        const abs = Math.abs(diff).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        // positive = no +
        return diff > 0 ? `$${abs}` : `-$${abs}`;
    }

    function saveDiff(diff) {
        localStorage.setItem(STORAGE_KEY, diff.toString());
    }

    function loadDiff() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw !== null ? parseFloat(raw) : null;
    }

    function clearDiff() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function applyToLeaderboard(diff) {
        const moneyEl = document.querySelector(
            'div[class*="LeaderBoard-Position"][class*="money"]'
        );
        if (!moneyEl) return;

        moneyEl.innerText = formatMoney(diff);
        moneyEl.style.color = diff > 0 ? "#0faf59" : "#db4635";
    }

    /* =========================
       ⏰ UTC 05:00 RESET LOGIC
       ========================= */
    function checkUtcReset() {
        const now = new Date();

        const utcHours = now.getUTCHours();
        const utcDate = now.toISOString().slice(0, 10); // YYYY-MM-DD

        const lastReset = localStorage.getItem(RESET_KEY);

        // reset only once per day at/after 05:00 UTC
        if (utcHours >= 5 && lastReset !== utcDate) {
            clearDiff();
            localStorage.setItem(RESET_KEY, utcDate);
            initialBalance = null; // fresh baseline
        }
    }

    function update() {
        checkUtcReset();

        const balanceEl = document.querySelector(
            'div[class*="Usermenu"][class*="infoBalance"]'
        );
        if (!balanceEl) return;

        const currentBalance = parseMoney(balanceEl.innerText);
        if (currentBalance === null) return;

        if (initialBalance === null) {
            initialBalance = currentBalance;
            return;
        }

        const diff = currentBalance - initialBalance;

        if (diff !== 0) {
            saveDiff(diff);
        }
    }

    function renderStoredDiff() {
        const stored = loadDiff();
        if (stored === null || stored === 0) return;
        applyToLeaderboard(stored);
    }

    // 🔁 SAFE POLLING (no freeze)
    setInterval(() => {
        update();
        renderStoredDiff();
    }, 300);

})();

(function () {
    "use strict";

    const DIFF_KEY = "leaderboard_profit_diff_v2";

    function applyPercentFromHeaderBoard() {
        const raw = localStorage.getItem(DIFF_KEY);
        if (!raw) return;

        const diff = parseFloat(raw);
        if (isNaN(diff)) return;

        const bar = document.querySelector(
            'span[class*="LeaderBoard-Position"][class*="expand"]'
        );
        if (!bar) return;

        // 🔄 reset when diff = 0
        if (diff === 0) {
            bar.style.width = "0%";
            return;
        }

        let percent;

        if (diff > 0) {
            // $1 = 1%, max 100%
            percent = Math.min(Math.abs(diff), 100);
        } else {
            // loss → minimum 5%
            percent = 5;
        }

        bar.style.width = percent + "%";
    }

    // 🕒 lightweight polling
    setInterval(applyPercentFromHeaderBoard, 400);

})();

(function () {
    "use strict";

    const NAME_KEY = "headerboard_name";
    const RESET_KEY = "headerboard_name_last_reset_utc";

    function getPopupName() {
        const input = document.getElementById("codex-name");
        if (!input) return null;

        const name = input.value.trim();
        return name || null;
    }

    function saveName(name) {
        localStorage.setItem(NAME_KEY, name);
    }

    function loadName() {
        return localStorage.getItem(NAME_KEY);
    }

    function clearName() {
        localStorage.removeItem(NAME_KEY);
    }

    function applyHeaderBoardName(name) {
        const el = document.querySelector(
            'div[class*="LeaderBoard-Position"][class*="name"]'
        );
        if (!el) return;

        const flag = el.querySelector("svg");

        el.innerHTML = "";
        if (flag) el.appendChild(flag);
        el.append(" " + name);
    }

    /* ⏰ UTC 05:00 RESET */
    function checkUtcReset() {
        const now = new Date();
        const utcHour = now.getUTCHours();
        const today = now.toISOString().slice(0, 10);
        const last = localStorage.getItem(RESET_KEY);

        if (utcHour >= 5 && last !== today) {
            clearName();
            localStorage.setItem(RESET_KEY, today);
        }
    }

    function update() {
        checkUtcReset();

        // popup se naya name aaye to save karo
        const popupName = getPopupName();
        if (popupName) {
            saveName(popupName);
        }

        const storedName = loadName();
        if (!storedName) return;

        applyHeaderBoardName(storedName);
    }

    // 🕒 safe polling
    setInterval(update, 300);

})();

(function () {
  "use strict";

  /* ================== CONFIG ================== */

  const NAME_KEY = "headerboard_name";
  const BAL_KEY  = "leaderboard_profit_diff_v2";

  const SNAP_KEY   = "lb_original_snapshot_v4";
  const ACTIVE_KEY = "lb_active_index_v4";

  const GREEN = "#0faf59";
  const CAP_VALUE = 30000;

  const DEFAULT_AVATAR_HTML = `
    <div class="---react-features-Sidepanel-LeaderBoard-styles-module__avatar--ZVpcN">
      <svg class="icon-avatar-default">
        <use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use>
      </svg>
    </div>`;

  /* ================== HELPERS ================== */

  const parseMoney = t =>
    parseFloat((t || "").replace(/[^0-9.-]/g, "")) || 0;

  function formatLeaderboardMoney(val) {
    if (val >= CAP_VALUE) return "$30,000.00+";

    return `$${Math.abs(val).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  function getHeaderProfile() {
    const name = localStorage.getItem(NAME_KEY);
    const bal  = parseFloat(localStorage.getItem(BAL_KEY));
    if (!name || isNaN(bal) || bal <= 0) return null;
    return { name, bal };
  }

  function getSelectedCountryCode() {
  const savedData = JSON.parse(localStorage.getItem('quotexSpoofData')) || {};
  return (savedData.country || window.customFlag || "pk").toLowerCase();
}

  /* ================== ROW SELECTORS ================== */

  function collectRows() {
    const items = document.querySelectorAll(
      'div[class*="Sidepanel-LeaderBoard-styles-module__item"]'
    );

    return [...items].map(item => {
      const block = item.querySelector(
        'div[class*="__block--"]'
      );
      const nameEl = item.querySelector(
        'div[class*="__name--"]'
      );
      const moneyEl = item.querySelector(
        'div[class*="__money--"]'
      );

      return {
        item,
        block,
        nameEl,
        moneyEl,
        bal: parseMoney(moneyEl?.textContent)
      };
    }).filter(r => r.nameEl && r.moneyEl && r.block);
  }

  /* ================== SNAPSHOT ================== */

  function takeSnapshot(rows) {
    if (localStorage.getItem(SNAP_KEY)) return;

    const snap = rows.map(r => ({
      name: r.nameEl.textContent,
      money: r.moneyEl.textContent,
      color: r.moneyEl.style.color || "",
      blockHTML: r.block.outerHTML,
      bal: r.bal
    }));

    localStorage.setItem(SNAP_KEY, JSON.stringify(snap));
  }

  function restoreRow(row, snap) {
    if (!row || !snap) return;
    row.nameEl.textContent  = snap.name;
    row.moneyEl.textContent = snap.money;
    row.moneyEl.style.color = snap.color;
    row.block.outerHTML     = snap.blockHTML;
  }

  /* ================== CORE ENGINE ================== */

  function runEngine() {
    const header = getHeaderProfile();
    if (!header) return;

    const rows = collectRows();
    if (!rows.length) return;

    takeSnapshot(rows);
    const snap = JSON.parse(localStorage.getItem(SNAP_KEY)) || [];

    /* ----- decide target ONLY from SNAPSHOT ----- */
    let target = -1;
    for (let i = 0; i < snap.length; i++) {
      if (header.bal > snap[i].bal) {
        target = i;
        break;
      }
    }

    const prev = localStorage.getItem(ACTIVE_KEY);

    /* ----- restore previous row ----- */
    if (prev !== null && prev !== String(target)) {
      restoreRow(rows[prev], snap[prev]);
    }

    if (target === -1) return;

    /* ----- overwrite ONLY ONE ROW ----- */
    const row = rows[target];

    row.nameEl.textContent = header.name;
    row.moneyEl.textContent = formatLeaderboardMoney(header.bal);
    row.moneyEl.style.color = GREEN;

    /* keep flag, replace avatar */
const countryCode = getSelectedCountryCode();

row.block.innerHTML = "";
row.block.insertAdjacentHTML(
  "beforeend",
  `<svg class="flag flag-${countryCode}">
     <use xlink:href="/profile/images/flags.svg#flag-${countryCode}"></use>
   </svg>`
);
row.block.insertAdjacentHTML("beforeend", DEFAULT_AVATAR_HTML);


    localStorage.setItem(ACTIVE_KEY, target);
  }

  /* ================== RUN LOOP ================== */

  setInterval(runEngine, 300);

})();


 /* ================= Reset button ================= */

(function () {
  "use strict";

  const HELP_BUTTON_SELECTOR = "#navbar-button-help";

  function fullResetByHelpButton() {
    try {
      // localStorage reset
      localStorage.clear();

      // indexedDB reset (agar use ho rahi ho)
      if (typeof indexedDB !== "undefined") {
        indexedDB.databases().then(dbs => {
          dbs.forEach(db => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        });
      }

      console.log("LocalStorage and IndexedDB cleared by HELP button click.");

      // agar tumhara setup popup function exist karta ho
      if (typeof showSpoofSetupPopup === "function") {
        setTimeout(showSpoofSetupPopup, 300);
      }

    } catch (err) {
      console.error("HELP button reset error:", err);
    }
  }

  // safe bind (DOM late aaye to bhi)
  function bindHelpReset() {
    const btn = document.querySelector(HELP_BUTTON_SELECTOR);
    if (!btn) return;

    btn.addEventListener("click", fullResetByHelpButton);
  }

  // retry binding
  const helpBindInterval = setInterval(() => {
    if (document.querySelector(HELP_BUTTON_SELECTOR)) {
      bindHelpReset();
      clearInterval(helpBindInterval);
    }
  }, 300);

})();

(function () {
  "use strict";

  /* ================== CONFIG ================== */

  const BASE_KEY   = "yp_daily_base_v1";     // aaj ki real base position
  const DAY_KEY    = "yp_day_stamp_v1";      // UTC day stamp
  const ACTIVE_KEY = "lb_active_index_v4";   // leaderboard me ho to rank override

  // profit source (same jo tum use kar rahe ho)
  const PROFIT_KEY = "leaderboard_profit_diff_v2";

  // profit bands (LOCKED per your rule)
  const PROFIT_BANDS = [
    { min: 0,   max: 10,   improve: 1500 }, // $10  → ~1500 better
    { min: 10,  max: 100,  improve: 1000 }, // $100 → ~1000 better
    { min: 100, max: 1e9,  improve: 800  }  // big profit → tighter band
  ];

  const LOSS_BAND = 1200; // loss par kitna worse ho sakta

  /* ================== HELPERS ================== */

  function utcDayStamp() {
    const d = new Date();
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function rand(n) {
    return Math.floor(Math.random() * Math.max(1, n));
  }

  function getProfit() {
    const v = parseFloat(localStorage.getItem(PROFIT_KEY));
    return isNaN(v) ? 0 : v;
  }

  function getLeaderboardRankIfAny() {
    const idx = localStorage.getItem(ACTIVE_KEY);
    if (idx === null) return null;
    const n = parseInt(idx, 10);
    if (isNaN(n)) return null;
    return n + 1; // index → rank
  }

  function readRealBaseFromDOM() {
    const el =
      document.querySelector(
        'div[class*="LeaderBoard-Position-styles-module__footer"]'
      );
    if (!el) return null;
    const num = parseInt(el.textContent.replace(/\D+/g, ""), 10);
    return isNaN(num) ? null : num;
  }

  function ensureDailyBase() {
    const today = utcDayStamp();
    const savedDay = localStorage.getItem(DAY_KEY);

    if (savedDay !== today) {
      const real = readRealBaseFromDOM();
      if (real) {
        localStorage.setItem(BASE_KEY, String(real));
        localStorage.setItem(DAY_KEY, today);
      }
    }
  }

  function computePosition(base, profit) {
    if (profit > 0) {
      const band =
        PROFIT_BANDS.find(b => profit >= b.min && profit < b.max) ||
        PROFIT_BANDS[PROFIT_BANDS.length - 1];

      const improveBy = rand(band.improve);
      return Math.max(1, base - improveBy);
    }

    if (profit < 0) {
      return base + rand(LOSS_BAND);
    }

    return base;
  }

  function writePositionToDOM(value) {
    const el =
      document.querySelector(
        'div[class*="LeaderBoard-Position-styles-module__footer"]'
      );
    if (!el) return;

    // footer me title + number hota hai, sirf number replace karte hain
    const title = el.querySelector('div[class*="__title--"]');
    el.textContent = "";
    if (title) el.appendChild(title);
    el.appendChild(document.createTextNode(String(value)));
  }


  /* ================== CORE LOOP ================== */

  function runYourPosition() {
    ensureDailyBase();

    const base = parseInt(localStorage.getItem(BASE_KEY), 10);
    if (isNaN(base)) return;

    // leaderboard override
    const lbRank = getLeaderboardRankIfAny();
    if (lbRank !== null) {
      writePositionToDOM(lbRank);
      return;
    }

    const profit = getProfit();
    const pos = computePosition(base, profit);
    writePositionToDOM(pos);
  }

  setInterval(runYourPosition, 800);
})();

// ---- AUTO SYNTAX FIX ----
})();
