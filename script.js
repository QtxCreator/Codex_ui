javascript:(function () {
  // Country list: code, name
  const flagList = [
    { code: "dz", name: "Algeria" },
    { code: "bd", name: "Bangladesh" },
    { code: "pk", name: "Pakistan" },
    { code: "in", name: "India" }
  ];

  // --- POPUPS ---
  let fakeBalance = prompt("Enter Demo Account (bottom) balance:", "10000");
  if (fakeBalance === null) return;

  let userName = prompt("Enter your leaderboard name:", "zain");
  if (userName === null) return;
  userName = userName.trim();

  // Flag popup on start
  let flagOptions = flagList.map(f => `<option value="${f.code}">${f.name} (${f.code.toUpperCase()})</option>`).join("");
  let flagDiv = document.createElement("div");
  flagDiv.innerHTML = `
    <div id="flag-popup" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#222;padding:20px;border-radius:8px;z-index:9999;color:#fff;">
      <label style="font-size:16px;">Country:</label><br>
      <select id="flag-select" style="margin-top:10px;font-size:16px;">
        ${flagOptions}
      </select>
      <button id="flag-ok" style="margin-left:10px;font-size:16px;">OK</button>
    </div>
  `;
  document.body.appendChild(flagDiv);

  let customFlag = "pk";
  document.getElementById("flag-ok").onclick = function () {
    let selected = document.getElementById("flag-select").value;
    customFlag = selected;
    document.body.removeChild(flagDiv);
    startSpoof();
  };

  function startSpoof() {
    let previousBalance = null;
    let profitLoss = 0;
    let customPosition = 2393; // Default start position

    // Custom flag popup (dropdown style)
    function askCustomFlag() {
      let flagOptions = flagList.map(f => `<option value="${f.code}">${f.name} (${f.code.toUpperCase()})</option>`).join("");
      let html = `
        <div id="flag-popup" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#222;padding:20px;border-radius:8px;z-index:9999;color:#fff;">
          <label style="font-size:16px;">Country:</label><br>
          <select id="flag-select" style="margin-top:10px;font-size:16px;">
            ${flagOptions}
          </select>
          <button id="flag-ok" style="margin-left:10px;font-size:16px;">OK</button>
        </div>
      `;
      let div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);

      document.getElementById("flag-ok").onclick = function () {
        let selected = document.getElementById("flag-select").value;
        customFlag = selected;
        document.body.removeChild(div);
      };
    }

    // Custom position popup
    function askCustomPosition() {
      const pos = prompt("Enter your custom position (number):", customPosition);
      if (pos !== null && !isNaN(pos) && Number(pos) > 0) {
        customPosition = Number(pos);
      }
    }

    // Custom name popup
    function askCustomName() {
      const name = prompt("Enter your leaderboard name:", userName);
      if (name !== null && name.trim() !== "") {
        userName = name.trim();
      }
    }

    // Format balance with comma and $30,000+ for top 3 (row only)
    function formatLeaderboardBalance(amount, idx, yourPosition) {
      if (idx <= 2 && idx === yourPosition && amount >= 30000) {
        return "$30,000+";
      }
      return `$${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Format header balance (always comma, no $30,000+)
    function formatHeaderBalance(amount) {
      return `$${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    setTimeout(() => {
      const footerWrapper = document.querySelector(".position__footer");
      if (footerWrapper) {
        footerWrapper.style.cursor = "pointer";
        footerWrapper.onclick = askCustomPosition;
      }
      const leaderboardHeader = document.querySelector(".position__header");
      if (leaderboardHeader) {
        const nameContainer = leaderboardHeader.querySelector(".position__header-name");
        if (nameContainer) {
          nameContainer.style.cursor = "pointer";
          nameContainer.onclick = askCustomName;
          setInterval(() => {
            const flagEl = nameContainer.querySelector("svg.flag");
            if (flagEl) {
              flagEl.style.cursor = "pointer";
              flagEl.onclick = askCustomFlag;
            }
          }, 500);
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

        // --- FIXED HEADER FLAG ---
        const leaderboardHeader = document.querySelector(".position__header");
        if (leaderboardHeader) {
          const nameContainer = leaderboardHeader.querySelector(".position__header-name");
          const moneyEl = leaderboardHeader.querySelector(".position__header-money");

          if (nameContainer) {
            nameContainer.innerHTML = "";
            // Always add flag (16x16)
            const flagSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            flagSvg.setAttribute("class", `flag flag-${customFlag}`);
            flagSvg.setAttribute("width", "16");
            flagSvg.setAttribute("height", "16");
            const useEl = document.createElementNS("http://www.w3.org/2000/svg", "use");
            useEl.setAttribute("xlink:href", `/profile/images/flags.svg#flag-${customFlag}`);
            flagSvg.appendChild(useEl);
            flagSvg.style.cursor = "pointer";
            flagSvg.onclick = askCustomFlag;
            nameContainer.appendChild(flagSvg);

            // Add custom name
            const span = document.createElement("span");
            span.textContent = userName;
            span.style.marginLeft = "4px";
            span.style.cursor = "pointer";
            span.onclick = askCustomName;
            nameContainer.appendChild(span);
          }

          if (moneyEl) {
            moneyEl.textContent = formatHeaderBalance(profitLoss);
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

        // ✅ Your position number spoof
        const footerWrapper = document.querySelector(".position__footer");
        if (footerWrapper) {
          const title = footerWrapper.querySelector(".position__footer-title");
          if (title) title.textContent = "Your position:";

          const textNodes = Array.from(footerWrapper.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
          const numNode = textNodes.find(n => n.textContent.trim().match(/^\d+$/));
          if (numNode) {
            numNode.textContent = "1"; // Always show rank 1 since we're replacing it
            numNode.parentElement.style.color = "#f4f4f4";
          }
        }

        // ✅ Leaderboard spoof entry (replace #1 if profit is higher)
        const leaderboardItems = document.querySelectorAll(".leader-board__items .leader-board__item");
        if (leaderboardItems.length > 0) {
          const firstItem = leaderboardItems[0];
          const profitEl = firstItem.querySelector(".leader-board__item-money");
          const currentProfit = profitEl ? parseFloat(profitEl.textContent.replace(/[^\d.-]/g, '')) : 0;

          if (profitLoss > currentProfit) {
            const nameEl = firstItem.querySelector(".leader-board__item-name");
            const moneyEl = firstItem.querySelector(".leader-board__item-money");
            const flagEl = firstItem.querySelector(".flag");

            if (nameEl) nameEl.textContent = userName;
            if (moneyEl) moneyEl.textContent = `$${profitLoss.toFixed(2)}`;
            // Always show flag 16x16
            if (flagEl) {
              flagEl.outerHTML = `<svg class="flag flag-${customFlag}" width="16" height="16"><use xlink:href="/profile/images/flags.svg#flag-${customFlag}"></use></svg>`;
            }
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
  }
})();
