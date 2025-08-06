javascript:(function () {
  const fakeBalance = prompt("Enter Demo Account (bottom) balance:", "10000");
  if (fakeBalance === null) return;

  const userName = prompt("Enter your leaderboard name:", "ZT VIP");
  if (userName === null) return;

  let previousBalance = null;
  let profitLoss = 0;

  // Store the base position from the DOM initially
  let basePosition = 61788;
  const footerPositionEl = document.querySelector(
    ".position__footer .position__footer-title"
  )?.nextSibling;
  if (footerPositionEl && !isNaN(parseInt(footerPositionEl.textContent))) {
    basePosition = parseInt(footerPositionEl.textContent);
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

        // Leaderboard Header Spoofing
        const leaderboardHeader = document.querySelector(".position__header");
        if (leaderboardHeader) {
          const nameContainer = leaderboardHeader.querySelector(".position__header-name");
          const moneyEl = leaderboardHeader.querySelector(".position__header-money");

          if (nameContainer) {
            nameContainer.innerHTML = `<svg class='flag flag-pk'><use xlink:href='/profile/images/flags.svg#flag-pk'></use></svg><span style='margin-left:4px'>${userName}</span>`;
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

        // 👇 Spoofed Footer Position based on Profit/Loss 👇
        let spoofedPosition = basePosition;
        let absProfit = Math.abs(profitLoss);
        if (absProfit >= 100) {
          const divisions = absProfit >= 500 ? 1 : Math.floor(absProfit / 100);
          for (let i = 0; i < divisions; i++) {
            if (profitLoss > 0) {
              spoofedPosition = Math.max(1, Math.floor(spoofedPosition / 2));
            } else {
              spoofedPosition = Math.floor(spoofedPosition * 2);
            }
          }
        }

        const footerWrapper = document.querySelector(".position__footer");
        if (footerWrapper) {
          footerWrapper.innerHTML =
            `<div class='position__footer-title'>Your position:</div>` +
            `<div class='position__footer-number'>${spoofedPosition}</div>`;
        }

        // 🟢 Account Icon and Status Spoof
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

        const svgEl = document.querySelector('#root header [class*="usermenu"] svg');
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

        const dropdownIcon = document.querySelector('#root header div[class*="usermenu"] div[class*="Dropdown"] svg');
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
