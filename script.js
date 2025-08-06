javascript:(function () {
  const waitForEl = (selector, callback) => {
    const el = document.querySelector(selector);
    if (el) return callback(el);
    const obs = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        obs.disconnect();
        callback(el);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  };

  waitForEl(".leader-board__items", function (leaderboard) {
    const fakeBalance = prompt("Enter Demo Account (bottom) balance:", "10000");
    if (fakeBalance === null) return;

    const yourName = prompt("Enter your leaderboard name:", "ZT VIP") || "ZT VIP";
    let previousBalance = null;
    let profitLoss = 0;
    let currentProfit = 0;

    const footerSelector = ".position__footer";
    const profitSelector = ".position__header-money";

    const flagSVG = `<svg class="flag flag-pk"><use xlink:href="/profile/images/flags.svg#flag-pk"></use></svg>`;
    const avatarSVG = `<svg class="icon-avatar-default"><use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use></svg>`;

    const entries = Array.from(leaderboard.querySelectorAll(".leader-board__item"));
    const originalEntries = entries.map(entry => ({
      element: entry,
      html: entry.outerHTML,
      balance: parseFloat(entry.querySelector('.leader-board__item-money')?.innerText.replace(/[^\d.-]/g, '') || '0')
    }));

    function calculatePositionFromProfit(profit) {
      let base = 61788;
      let newPosition = base;
      if (profit > 0 && profit <= 500) newPosition = Math.floor(base / 2);
      else if (profit > 500) newPosition = Math.floor(base / 2);
      else if (profit < 0 && profit >= -500) newPosition = Math.min(base * 2, 99999);
      else if (profit < -500) newPosition = Math.min(base * 4, 99999);
      return Math.max(1, newPosition);
    }

    function updateLeaderboard() {
      const profitText = document.querySelector(profitSelector)?.textContent || "$0.00";
      currentProfit = parseFloat(profitText.replace(/[^\d.-]/g, ''));
      if (profitText.includes("-")) currentProfit *= -1;

      const ranked = [...originalEntries];
      ranked.push({ isUser: true, balance: currentProfit });
      ranked.sort((a, b) => b.balance - a.balance);
      const userIndex = ranked.findIndex(x => x.isUser) + 1;
      const top20 = ranked.slice(0, 20);

      leaderboard.innerHTML = "";
      top20.forEach((entry, index) => {
        if (entry.isUser) {
          const userEntry = document.createElement("div");
          userEntry.className = "leader-board__item";
          userEntry.innerHTML = `
            <div class="leader-board__item-inform">
              <div class="leader-board__item-key">
                <div class="leader-board__item-key__place">${index + 1}</div>
              </div>
              <div class="leader-board__item-block">
                ${flagSVG}
                <div class="leader-board__item-avatar">${avatarSVG}</div>
              </div>
              <div class="leader-board__item-name">${yourName}</div>
            </div>
            <div class="leader-board__item-money --green">$${currentProfit.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          `;
          leaderboard.appendChild(userEntry);
        } else {
          const clone = document.createElement("div");
          clone.innerHTML = entry.html;
          const fixed = clone.firstChild;
          const pos = fixed.querySelector('.leader-board__item-key__place');
          if (pos) pos.textContent = index + 1;
          leaderboard.appendChild(fixed);
        }
      });

      const footer = document.querySelector(footerSelector);
      const positionValue = calculatePositionFromProfit(currentProfit);
      if (footer) {
        footer.innerHTML = `<div class="position__footer-title">Your position:</div>${userIndex}`;
      }
    }

    const updateInterval = setInterval(() => {
      try {
        if (location.pathname === "/en/demo-trade") {
          history.pushState({}, "", "/en/trade");
        }

        const profitText = document.querySelector(profitSelector)?.textContent || "$0.00";
        const balanceEl = document.querySelector('[class*="__infoBalance--"]');
        if (!balanceEl) return;

        const balanceText = balanceEl.textContent.replace(/[^\d.]/g, '');
        const balance = parseFloat(balanceText);

        const leaderboardHeader = document.querySelector(".position__header");
        if (leaderboardHeader) {
          const nameContainer = leaderboardHeader.querySelector(".position__header-name");
          const moneyEl = leaderboardHeader.querySelector(".position__header-money");

          if (nameContainer) {
            const existingFlag = nameContainer.querySelector("svg");
            nameContainer.innerHTML = "";
            if (existingFlag) nameContainer.appendChild(existingFlag);
            const span = document.createElement("span");
            span.textContent = yourName;
            span.style.marginLeft = "4px";
            nameContainer.appendChild(span);
          }

          if (previousBalance !== null) {
            const diff = parseFloat((balance - previousBalance).toFixed(2));
            if (diff !== 0) profitLoss += diff;
          }

          if (moneyEl) {
            if (profitLoss >= 0) {
              moneyEl.textContent = `$${profitLoss.toFixed(2)}`;
              moneyEl.className = "position__header-money --green";
              moneyEl.style.color = "#0faf59";
            } else {
              moneyEl.textContent = `-$${Math.abs(profitLoss).toFixed(2)}`;
              moneyEl.className = "position__header-money --red";
              moneyEl.style.color = "#db4635";
            }
          }

          previousBalance = balance;
        }

        updateLeaderboard();
      } catch (e) {
        console.error("Spoof error:", e);
      }
    }, 300);
  });
})();
