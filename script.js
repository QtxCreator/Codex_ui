javascript:(function () {
  const fakeBalance = prompt("Enter Demo Account (bottom) balance:", "10000");
  if (fakeBalance === null) return;

  const userNameInput = prompt("Enter your leaderboard name:", "your name");
  if (userNameInput === null) return;
  const userName = userNameInput.trim(); // Remove any leading/trailing space

  const customPositionInput = prompt("Enter your leaderboard position number:", "position");
  if (customPositionInput === null) return;
  const positionNumber = parseInt(customPositionInput);

  let previousBalance = null;
  let profitLoss = 0;

  const updateInterval = setInterval(() => {
    try {
      if (location.pathname === "/en/demo-trade") {
        history.pushState({}, "", "/en/trade");
      }

      const pageTitle = document.querySelector("head > title");
      if (pageTitle) pageTitle.innerText = "Live trading | Quotex";

      // ✅ Demo to Live spoof
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

      // ✅ Track Profit/Loss
      if (previousBalance !== null) {
        const diff = parseFloat((balance - previousBalance).toFixed(2));
        if (diff !== 0) profitLoss += diff;
      }

      previousBalance = balance;

      // ✅ Leaderboard Header Updates
      const leaderboardHeader = document.querySelector(".position__header");
      if (leaderboardHeader) {
        const nameContainer = leaderboardHeader.querySelector(".position__header-name");
        const moneyEl = leaderboardHeader.querySelector(".position__header-money");

        if (nameContainer) {
          const existingFlag = nameContainer.querySelector("svg");
          nameContainer.innerHTML = "";
          if (existingFlag) nameContainer.appendChild(existingFlag);

          const span = document.createElement("span");
          span.textContent = userName;
          span.style.marginLeft = "4px";
          nameContainer.appendChild(span);
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
      }

      // ✅ Leaderboard "Your position" number spoof
      const footerWrapper = document.querySelector(".position__footer");
      if (footerWrapper) {
        const title = footerWrapper.querySelector(".position__footer-title");
        if (title) title.textContent = "Your position:";

        const textNodes = Array.from(footerWrapper.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
        const numNode = textNodes.find(n => n.textContent.trim().match(/^\d+$/));
        if (numNode) {
          numNode.textContent = positionNumber.toString();
          numNode.parentElement.style.color = "#f4f4f4";
        }
      }

      // ✅ Leaderboard Loading Bar based on profit
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
          percent = Math.max(0, Math.min(100, percent));
          innerBar.style.width = `${percent}%`;
          innerBar.style.transition = "width 0.3s ease-in-out";
        }
      }

      // ✅ Account Level Icons
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
          bottomBalance.textContent = `$${parseFloat(fakeBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
})();
