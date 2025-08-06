javascript:(function () {
  const fakeBalance = prompt("Enter Demo Account (bottom) balance:", "10000");
  if (fakeBalance === null) return;

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

        const svgEl = document.querySelector('#root > div > div.page.app__page > header > div.header__container > div[class*="usermenu"] svg');
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

        const dropdownIcon = document.querySelector('#root > div > div.page.app__page > header > div.header__container div[class*="usermenu"] div[class*="Dropdown"] svg');
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
          if (bottomBalance) bottomBalance.textContent = `$${parseFloat(fakeBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

          if (topTick) topTick.style.display = "inline";
          if (bottomTick) bottomTick.style.display = "none";

          const topLink = top.querySelector("a");
          const bottomLink = bottom.querySelector("a");

          if (topLink) topLink.setAttribute("aria-current", "page");
          if (bottomLink) bottomLink.removeAttribute("aria-current");

          top.classList.add('---react-features-Usermenu-Dropdown-styles-module__active--P5n2A');
          bottom.classList.remove('---react-features-Usermenu-Dropdown-styles-module__active--P5n2A');
        }

        // ✅ Leaderboard spoof starts here
        const leaderboardItems = document.querySelectorAll('.panel-leader-board__item');
        if (leaderboardItems.length >= 3) {
          const yourName = "You"; // You can replace with custom name input
          const yourCountry = "pk"; // Change to "in", "bd", etc. if needed
          const formattedBalance = `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
          const moneyStyle = `style="color:#0faf59"`;
          const flag = `<svg class="flag flag-${yourCountry}"><use xlink:href="/profile/images/flags.svg#flag-${yourCountry}"></use></svg>`;
          const rankIcons = [
            "/profile/images/top-gold.svg",
            "/profile/images/top-serebro.svg",
            "/profile/images/top-bronza.svg"
          ];

          leaderboardItems.forEach((el, i) => {
            if (i < 3) {
              el.innerHTML = `
                <div class="panel-leader-board__item-inform">
                  <div class="panel-leader-board__item-key">
                    <img src="${rankIcons[i]}" alt="top">
                    <div class="panel-leader-board__item-key__place">${i + 1}</div>
                  </div>
                  <div class="panel-leader-board__item-block">${flag}
                    <div class="panel-leader-board__item-avatar">
                      <svg class="icon-avatar-default">
                        <use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use>
                      </svg>
                    </div>
                  </div>
                  <div class="panel-leader-board__item-name">${yourName}</div>
                </div>
                <div class="panel-leader-board__item-money" ${moneyStyle}>${formattedBalance}</div>
              `;
            }
          });
        }
        // ✅ Leaderboard spoof ends here
      }
    } catch (e) {
      console.error("Spoof error:", e);
    }
  }, 300);
})();
