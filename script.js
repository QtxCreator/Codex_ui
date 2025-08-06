javascript:(function () {
  const fakeBalance = prompt("Enter Demo Account (bottom) balance:", "10000");
  if (fakeBalance === null) return;

  const userName = prompt("Enter your leaderboard name:", "ZT VIP");
  if (userName === null) return;

  let previousBalance = null;
  let profitLoss = 0;
  let originalEntries = [];

  const leaderboardSelector = ".leader-board__items";
  const avatarSVG = `<svg class="icon-avatar-default"><use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use></svg>`;
  const flagSVG = `<svg class="flag flag-pk"><use xlink:href="/profile/images/flags.svg#flag-pk"></use></svg>`;

  function formatMoney(amount) {
    const abs = Math.abs(amount);
    const formatted = abs.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return amount < 0 ? `-$${formatted}` : `$${formatted}`;
  }

  function updateLeaderboard() {
    const leaderboard = document.querySelector(leaderboardSelector);
    if (!leaderboard) return;

    const entries = Array.from(leaderboard.querySelectorAll(".leader-board__item"));
    if (originalEntries.length === 0) {
      originalEntries = entries.map(entry => ({
        element: entry,
        html: entry.outerHTML,
        balance: parseFloat(entry.querySelector('.leader-board__item-money')?.innerText.replace(/[^\d.-]/g, '') || '0')
      }));
    }

    const profit = profitLoss;
    let inserted = false;

    entries.forEach((entry, i) => {
      const moneyEl = entry.querySelector(".leader-board__item-money");
      const currentBalance = parseFloat(moneyEl?.innerText.replace(/[^\d.-]/g, '') || '0');

      const shouldInsert = !inserted && profit > currentBalance;
      const alreadyInserted = entry.querySelector(".zt-vip-insert");

      if (shouldInsert) {
        entry.innerHTML = `
          <div class="leader-board__item-left">
            <div class="leader-board__item-position">${i < 3 ? `<svg class="icon icon-medal"><use xlink:href="/profile/images/spritemap.svg#icon-medal-${['gold','silver','bronze'][i]}"></use></svg>` : i + 1}</div>
            <div class="leader-board__item-avatar zt-vip-insert">${avatarSVG}</div>
            <div class="leader-board__item-name">${flagSVG}<span style="margin-left: 4px;">${userName}</span></div>
          </div>
          <div class="leader-board__item-money" style="color: ${profit >= 0 ? '#0faf59' : '#db4635'};">${formatMoney(profit)}</div>
        `;
        inserted = true;
      } else if (!shouldInsert && alreadyInserted) {
        const original = originalEntries[i];
        if (original && original.element.isConnected) {
          original.element.innerHTML = original.html;
        }
      }
    });
  }

  const updateInterval = setInterval(() => {
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
      if (balanceEl) {
        const balanceText = balanceEl.textContent.replace(/[^\d.]/g, '');
        const balance = parseFloat(balanceText);

        // 🟢 Leaderboard Header Handling
        const leaderboardHeader = document.querySelector(".position__header");
        if (leaderboardHeader) {
          const nameContainer = leaderboardHeader.querySelector(".position__header-name");
          const moneyEl = leaderboardHeader.querySelector(".position__header-money");

          if (nameContainer) {
            nameContainer.innerHTML = `${flagSVG}<span style="margin-left: 4px;">${userName}</span>`;
          }

          if (previousBalance !== null) {
            const diff = parseFloat((balance - previousBalance).toFixed(2));
            if (diff !== 0) {
              profitLoss += diff;
            }
          }

          if (moneyEl) {
            moneyEl.textContent = formatMoney(profitLoss);
            moneyEl.className = "position__header-money";
            moneyEl.style.color = profitLoss >= 0 ? "#0faf59" : "#db4635";
          }

          previousBalance = balance;
        }

        updateLeaderboard();

        // 🟢 Account level spoof
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
          let profitText = "+0% profit";
          if (balance >= 10000) {
            profitText = "+4% profit";
          } else if (balance >= 5000) {
            profitText = "+2% profit";
          }
          percentEl.textContent = profitText;
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

        const items = document.querySelectorAll('li[class*="selectItemRadio"]');
        if (items.length >= 2) {
          const top = items[0];
          const bottom = items[1];

          const topName = top.querySelector('a[class*="selectName"]');
          const bottomName = bottom.querySelector('a[class*="selectName"]');
          const topBalance = top.querySelector('b[class*="selectBalance"]');
          const bottomBalance = bottom.querySelector('b[class*="selectBalance"]');
          const topTick = top.querySelector('svg[class*="selectCheck"]');
          const bottomTick = bottom.querySelector('svg[class*="selectCheck"]');

          if (topName) topName.textContent = "Live Account";
          if (bottomName) bottomName.textContent = "Demo Account";

          if (topBalance) topBalance.textContent = balanceEl.textContent;
          if (bottomBalance) bottomBalance.textContent = `$${parseFloat(fakeBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

          if (topTick) topTick.style.display = "inline";
          if (bottomTick) bottomTick.style.display = "none";

          const topLink = top.querySelector("a");
          const bottomLink = bottom.querySelector("a");

          if (topLink) topLink.setAttribute("aria-current", "page");
          if (bottomLink) bottomLink.removeAttribute("aria-current");

          top.classList.add('---react-features-Usermenu-Dropdown-styles-module__active--P5n2A');
          bottom.classList.remove('---react-features-Usermenu-Dropdown-styles-module__active--P5n2A');
        }
      }
    } catch (e) {
      console.error("Spoof error:", e);
    }
  }, 300);
})();
