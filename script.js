!function e(){let t="fast-spoof-hide-style";if(!document.getElementById(t)){let o=document.createElement("style");o.id=t,o.textContent=`
      /* hide name and balance until spoof applied to avoid flicker */
      [class*="__infoBalance--"], [class*="__infoName--"], .usermenu__info-balance, .usermenu__infoName {
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `,document.head&&document.head.appendChild(o)}function r(){try{let e=document.querySelector('[class*="__infoBalance--"]')||document.querySelector(".usermenu__info-balance")||document.querySelector('[class*="infoBalance"]'),o=document.querySelector('[class*="__infoName--"]')||document.querySelector(".usermenu__infoName")||document.querySelector('[class*="infoName"]');if(!e&&!o)return!1;let r=e?e.textContent.trim():"",n="$",a=parseFloat(r.replace(/[^0-9.]/g,"")||0);if("function"==typeof parseBalance){let l=parseBalance(r||"$0");n=l.symbol||n,a=l.amount||0}if("function"==typeof formatBalance){let i=formatBalance(a,n);e&&(e.textContent=i)}else e&&(e.textContent=`${n}${Number(a).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`);o&&(o.textContent="Live Account",o.style.color="#0faf59");let s=document.querySelector(".usermenu__select-item--radio:not(.active) .usermenu__select-name")||document.querySelector('[class*="select-name"]');return s&&(s.textContent="Live Account"),function e(){let o=document.getElementById(t);o&&o.parentNode&&o.parentNode.removeChild(o)}(),!0}catch(c){return console.error("fastSpoof update error",c),!1}}let n=new MutationObserver((e,t)=>{r()&&t.disconnect()});document.body?n.observe(document.body,{childList:!0,subtree:!0}):requestAnimationFrame(()=>{document.body&&n.observe(document.body,{childList:!0,subtree:!0})});let a=0;function l(){a++,!r()&&a<8&&requestAnimationFrame(l)}requestAnimationFrame(l),setTimeout(()=>{let e=document.getElementById("fast-spoof-hide-style");e&&e.parentNode.removeChild(e)},5e3)}(),function(){"use strict";let e={"₨":1/280,"€":1.1,"₹":1/70,"৳":.01,$:1};function t(t){if(!t)return{symbol:"$",amount:0,amountInUSD:0};let o=t.match(/[\₨€₹৳$]/),r=o?o[0]:"$",n=t.replace(/[^0-9.]/g,""),a=parseFloat(n)||0,l=e[r]||1;return{symbol:r,amount:a,amountInUSD:a*l}}function o(e,t){let o=e.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2});return`${t}${o}`}function r(){let e=document.querySelector('div[class*="---react-features-Banner-styles-module__banner"]');e&&(e.style.transition="opacity 0.3s ease",e.style.opacity="0",e.style.pointerEvents="none",e.style.height="0",e.style.overflow="hidden",console.log("Banner hidden safely!"))}(function(){let e="https://market-qx.trade/en/demo-trade",t=["https://market-qx.trade/en/withdrawal","https://market-qx.trade/en/deposit","https://market-qx.trade/en/settings","https://market-qx.trade/en/tournaments","https://market-qx.trade/en/trades?account=live","https://market-qx.trade/en/trades?account=demo","https://market-qx.trade/en/market","https://market-qx.trade/en/analytics",].some(e=>window.location.href.startsWith(e));window.location.href===e||t||window.location.replace(e)})(),function(){if(window.location.href.includes("market-qx.trade/en/demo-trade")){let e=window.location.href.replace("/en/demo-trade","/en/trade");history.replaceState(null,"",e),console.log("URL spoofed: Address bar now shows /en/trade")}}(),function(){function e(){let e=document.querySelector(".usermenu__info-balance.js-balance-visible-usermenu"),r=document.querySelector(".usermenu__select-item--radio.active"),n=document.querySelector(".usermenu__select-item--radio:not(.active)");if(!e||!r||!n)return;let a=r.querySelector(".usermenu__select-balance"),l=a?a.textContent.trim():"0",{symbol:i,amount:s,amountInUSD:c}=t(l);window.realDemoBalanceUSD=c,window.fakeDemoBalance=c,e.textContent=o(s,i);let d=n.querySelector(".usermenu__select-name");d&&(d.textContent="Live Account");let u=n.querySelector(".usermenu__select-balance");u&&(u.textContent=o(s,i));let p=r.querySelector(".usermenu__select-name");p&&(p.textContent="Demo Account"),n.classList.contains("active")||n.classList.add("active"),r.classList.contains("active")&&r.classList.remove("active");let m=document.querySelector(".usermenu__info-levels svg use"),f=document.querySelector(".usermenu__level-icon svg use")||document.querySelector(".usermenu__level-icon use"),$=document.querySelector(".usermenu__level-name.js-balance-visible-usermenu"),g=document.querySelector(".usermenu__level-profit.js-balance-visible-usermenu"),v="Standard",x="+0% profit",y="icon-profile-level-standart";c>=1e4?(v="VIP",x="+4% profit",y="icon-profile-level-vip"):c>=5e3&&(v="Pro",x="+2% profit",y="icon-profile-level-pro"),m&&m.setAttribute("xlink:href",`https://market-qx.trade/profile/images/spritemap.svg#${y}`),f&&f.setAttribute("xlink:href",`https://market-qx.trade/profile/images/spritemap.svg#${y}`),$&&($.textContent=`${v}:`),g&&(g.textContent=x)}e(),setInterval(e,30)}(),(()=>{function r(){let r=parseFloat(window.realDemoBalanceUSD||1e4),n="$",a=document.querySelectorAll(".balance__value, .balance-list dd, .page__content-header .balance__value");for(let l of a){if(l.closest(".leaderboard"))continue;let i=l.textContent.trim(),{symbol:s}=t(i);if(s){n=s;break}}let c=e[n]||1,d=o(r/c,n)+" ",u=document.querySelectorAll(".page__content-header .balance .balance__value");u[0]&&u[0].textContent!==d&&(u[0].textContent=d),u[1]&&u[1].textContent!==d&&(u[1].textContent=d);let p=document.querySelectorAll(".balance-list dt");p.forEach(e=>{let t=e.nextElementSibling;t&&(e.textContent.includes("In the account:")&&t.textContent!==d?t.textContent=d:e.textContent.includes("Available for withdrawal:")&&t.textContent!==d&&(t.textContent=d))});let m=document.querySelectorAll(".balance__container .balance");m.forEach(e=>{let t=e.querySelector(".balance__label"),o=e.querySelector(".balance__value");t&&o&&(t.textContent.includes("In the account")&&o.textContent!==d?o.textContent=d:t.textContent.includes("Available for withdrawal")&&o.textContent!==d&&(o.textContent=d))})}r(),setInterval(r,20)})(),function(){let r=["ABC123-XHJ","TEST-KEY-1","VIP-ACCESS-U1","K9X3P-7F2MZ-L8B4J","J2L5N-V7Q1H-M6T8C","R4B6Y-8Z1WQ-P3K9S","H7T2M-X5D9E-C1V4G","P6M1J-V3L8Q-Z4R7B","M8T3X-L1V7P-R5K9N","L2H9M-P8Q5T-V7X3G","C4X1N-M7Z5R-L9V8Q","B5T8M-Q3P9L-V6X1R","X7L2Q-M9P4T-H5V8N","N1P5L-V4X8Q-M7T9R","T6M2X-P9L1V-Q8R5N","V9Q3M-L7T5X-P1R8H","Q8M4P-L6T9V-X3R1N","R3P8V-M2L7X-Q5T9H","L5V9M-Q8T1X-R2P7H","P7X2L-M8Q5V-T9R1H","X1M6P-L9V8T-Q4R7N","N8P3M-V7T9X-L1R5Q","M2L8Q-P5T1X-V9R4H","V4Q7M-T8K4X-P2T2H","Q5M9P-L2T8V-X7R1N","R9P4V-M3L1X-Q8T7H","L8V2M-Q9T4X-P5R7H","P4X9L-M1Q7V-T8R5N","X9M8P-L4V7T-Q1R2H","N7P1M-V5T4X-L9R8Q","M5L9Q-P8T7X-V2R1H","V3Q1M-L8T9X-P4R7H"],n,a="QuotexSpoofDB",l="avatars";function i(){return new Promise((e,t)=>{let o=indexedDB.open(a,1);o.onupgradeneeded=function(e){(n=e.target.result).objectStoreNames.contains(l)||n.createObjectStore(l,{keyPath:"id"}),console.log("IndexedDB upgrade needed/created.")},o.onsuccess=function(t){n=t.target.result,console.log("IndexedDB opened successfully."),e(n)},o.onerror=function(e){console.error("IndexedDB error:",e.target.errorCode),t(e.target.error)}})}function s(){return new Promise((e,t)=>{if(!n)return console.error("IndexedDB not initialized."),t("IndexedDB not initialized.");let o=n.transaction([l],"readonly"),r=o.objectStore(l),a=r.get("customAvatar");a.onsuccess=()=>{let t=a.result;t&&t.svg?(console.log("SVG loaded from IndexedDB."),e(t.svg)):(console.log("No SVG found in IndexedDB."),e(null))},a.onerror=e=>{console.error("Error loading SVG from IndexedDB:",e.target.error),t(e.target.error)}})}let c=document.getElementById("codex-modern-popup-overlay");c&&c.remove();let d=document.createElement("style");d.textContent=`
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
      `,document.head.appendChild(d);let u="";async function p(){let e=document.createElement("div");e.id="codex-modern-popup-overlay",e.innerHTML=`
          <div id="codex-modern-popup" role="dialog" aria-modal="true" aria-label="Quotex Spoof Setup">
            <h3>CODEX</h3>
            <p class="subtitle">ONLY BUY FROM @CODER_456</p>

            <label for="codex-name">Name</label>
            <input id="codex-name" type="text" placeholder="e.g. John">

            <label for="codex-balance">Demo Balance (starting)</label>
            <input id="codex-balance" type="number" placeholder="e.g. $10000" min="0">

            <label for="codex-country">Country</label>
            <select id="codex-country">${u}</select>

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
        `,document.body.appendChild(e);let t=document.getElementById("codex-avatar"),o=document.getElementById("codex-avatar-preview"),a=document.getElementById("codex-remove-avatar-btn"),i="",c=e=>{if(i=e,e){o.innerHTML=e;let t=o.querySelector("svg");t&&(t.style.width="100%",t.style.height="100%"),a.style.display="block"}else o.innerHTML="",a.style.display="none"};t.addEventListener("change",async function(e){let o=e.target.files[0];if(o){if("image/svg+xml"!==o.type){alert("Please select an SVG file."),t.value="",c("");return}let r=new FileReader;r.onload=async function(e){let o=e.target.result,r=o.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"").replace(/on\w+="[^"]*"/gi,"");try{var a;await (a=r,new Promise((e,t)=>{if(!n)return console.error("IndexedDB not initialized."),t("IndexedDB not initialized.");let o=n.transaction([l],"readwrite"),r=o.objectStore(l),i=r.put({id:"customAvatar",svg:a});i.onsuccess=()=>{console.log("SVG saved to IndexedDB."),e()},i.onerror=e=>{console.error("Error saving SVG to IndexedDB:",e.target.error),t(e.target.error)}})),c(r);let i=JSON.parse(localStorage.getItem("quotexSpoofData"))||{};i.hasCustomSvgAvatar=!0,localStorage.setItem("quotexSpoofData",JSON.stringify(i))}catch(s){alert("Failed to save SVG avatar. It might be too large or there was a storage error."),console.error("SVG save error:",s),t.value="",c("")}},r.readAsText(o)}else c("")}),a.addEventListener("click",async()=>{try{await new Promise((e,t)=>{if(!n)return console.error("IndexedDB not initialized."),t("IndexedDB not initialized.");let o=n.transaction([l],"readwrite"),r=o.objectStore(l),a=r.delete("customAvatar");a.onsuccess=()=>{console.log("SVG deleted from IndexedDB."),e()},a.onerror=e=>{console.error("Error deleting SVG from IndexedDB:",e.target.error),t(e.target.error)}}),c(""),t.value="";let e=JSON.parse(localStorage.getItem("quotexSpoofData"))||{};delete e.hasCustomSvgAvatar,localStorage.setItem("quotexSpoofData",JSON.stringify(e))}catch(o){alert("Failed to remove SVG avatar."),console.error("SVG remove error:",o)}});let d=JSON.parse(localStorage.getItem("quotexSpoofData"));if(d&&d.hasCustomSvgAvatar){let p=await s();c(p)}document.getElementById("codex-cancel").addEventListener("click",function(){let e=document.getElementById("codex-modern-popup-overlay");e&&e.remove()}),document.getElementById("codex-start").addEventListener("click",async function(){var e;let t=(document.getElementById("codex-name").value||"").trim(),o=document.getElementById("codex-balance").value,n=""===o?NaN:parseFloat(o),a=(document.getElementById("codex-country").value||"pk").toLowerCase(),l=(document.getElementById("codex-key").value||"").trim(),s=JSON.parse(localStorage.getItem("quotexSpoofData"))||{};if(s.country=a,localStorage.setItem("quotexSpoofData",JSON.stringify(s)),window.customFlag=a,!t||isNaN(n)||!a||!l){alert("Please fill all required fields (Name, Balance, Country, Key).");return}if(e=l,!r.some(t=>t.toLowerCase()===e.toLowerCase())){alert("Invalid license key. Please contact admin.");return}localStorage.setItem("quotexSpoofData",JSON.stringify({name:t,balance:n,country:a,key:l,hasCustomSvgAvatar:!!i})),window.customName=t,window.fakeDemoBalance=n,window.customFlag=a,window.userKey=l,window.customSvgAvatar=i;let c=document.getElementById("codex-modern-popup-overlay");c&&c.remove(),$()})}async function m(){localStorage.removeItem("quotexSpoofLeaderboardData"),await i();let e=localStorage.getItem("quotexSpoofData");if(e){let t=JSON.parse(e);window.customName=t.name,window.fakeDemoBalance=t.balance,window.customFlag=t.country,window.userKey=t.key,t.hasCustomSvgAvatar?window.customSvgAvatar=await s():window.customSvgAvatar="",$()}else p()}[{code:"pk",name:"Pakistan",active:!0},{code:"bd",name:"Bangladesh",active:!0},{code:"dz",name:"Algeria",active:!0},{code:"in",name:"India",active:!0},{code:"us",name:"United States",active:!1},{code:"gb",name:"United Kingdom",active:!1},{code:"fr",name:"France",active:!1},{code:"cn",name:"China",active:!1}].forEach(e=>{let t=`${e.name} (${e.code.toUpperCase()})`,o=e.active?"":" disabled";u+=`<option value="${e.code}"${o} style="color:black;">${t}${e.active?"":" — Inactive"}</option>`});let f=document.createElement("style");function $(){let r=null,n=0,a=0;function l(){let e={profitLoss:n,customPosition:a,timestamp:new Date().getTime()};localStorage.setItem("quotexSpoofLeaderboardData",JSON.stringify(e))}setTimeout(()=>{let e=document.querySelector(".position__footer");e&&(e.style.cursor="pointer",e.onclick=function(){let e=prompt("Enter your custom position (number):",a);null!==e&&!isNaN(e)&&Number(e)>0&&(a=Number(e),l())});let t=document.querySelector(".position__header");if(t){let o=t.querySelector(".position__header-name");if(o){o.style.cursor="pointer",o.onclick=function(){};let r=o.querySelector("span");r&&window.customName&&(r.textContent=window.customName)}}},1e3),setInterval(()=>{try{let a="Live trading | Quotex";function i(){let e=document.querySelector("head > title");e&&e.innerText!==a&&(e.innerText=a)}i(),setInterval(i,2e3);let s=document.querySelector('[class*="__infoName--"][class*="__demo--"]');if(s){s.classList.remove(...[...s.classList].filter(e=>e.includes("__demo--"))),s.classList.add("___react-features-Usermenu-styles-module__live--Bx7Ua");let c=window.innerWidth<768;s.textContent=c?"Live":"Live Account",s.style.color="#0faf59"}let d=document.querySelector('[class*="__infoBalance--"]');if(!d)return;let{amountInUSD:u}=t(d.textContent);if(null!==r){let p=parseFloat((u-r).toFixed(2));0!==p&&(n+=p,l())}r=u;let m=document.querySelector(".position__header");if(m){let f=m.querySelector(".position__header-name"),$=m.querySelector(".position__header-money");if(f){f.style.cursor="pointer",f.onclick=function(){};let g=f.querySelector("span");g&&window.customName&&(g.textContent=window.customName)}$&&(n<0?$.textContent=`-$${Math.abs(n).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`:$.textContent=`$${n.toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`,$.className=`position__header-money ${n>=0?"--green":"--red"}`,$.style.color=n>=0?"#0faf59":"#db4635")}let v=document.querySelector(".position__expand");if(v){let x=v,y=Math.abs(n)/100*100;y>100&&(y=100),x.style.backgroundColor="#0faf59",y=Math.min(100,Math.max(0,y)),x.style.width=`${y}%`,x.style.transition="width 0.3s ease-in-out"}let b=document.querySelectorAll(".leader-board__items .leader-board__item"),h=[],S=[],_=[],q=[];b.forEach(e=>{let t=e.querySelector(".leader-board__item-money"),o=t?parseFloat(t.textContent.replace(/[^\d.-]/g,"")):0;h.push(o);let r=e.querySelector(".leader-board__item-avatar");S.push(r?r.innerHTML:"");let n=e.querySelector(".flag");_.push(n?n.outerHTML:"");let a=e.querySelector(".leader-board__item-name");q.push(a?a.textContent:"")}),[...h,n].sort((e,t)=>t-e);let C,L,k=h.slice(0,20),w=k.length>=20?k[19]:null;if(n<5)L=63579,C=63578;else if(5===n)L=2473,C=2472;else if(20===n)L=1309,C=1308;else if(40===n)L=800,C=799;else if(null!==w&&n>=w){let I=k.slice().sort((e,t)=>t-e),D=I.findIndex(e=>n>=e);L=D+1,C=D;let B=b[D];if(B){let E=B.querySelector(".leader-board__item-name"),T=B.querySelector(".leader-board__item-money"),A=B.querySelector(".leader-board__item-avatar"),P=B.querySelector(".flag");if(E&&(E.textContent=window.customName),T){var N,M,V;T.textContent=(N=n,M=D,V=D,M<=2&&M===V&&N>=3e4?"$30,000.00+":N<0?`-$${Math.abs(N).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`:`$${parseFloat(N).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`)}A&&(A.innerHTML=function e(){if(window.customSvgAvatar){let t=window.customSvgAvatar;return t=t.replace(/<svg([^>]*)>/i,'<svg$1 width="32" height="32" style="border-radius:50%;overflow:hidden;background:#fff;">')}return'<svg class="icon-avatar-default" width="32" height="32"><use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use></svg>'}()),P&&(P.outerHTML=`<svg class="flag flag-${window.customFlag}" width="16" height="16"><use xlink:href="/profile/images/flags.svg#flag-${window.customFlag}"></use></svg>`)}}else{let H=Math.min(1,Math.max(0,(n-40)/((null!==w?w:1e3)-40)));C=(L=Math.round(800+-779*(1-(1-H)*(1-H))))-1}try{let R=document.querySelector(".position__header-name");if(R){let X=R.querySelector("svg");R.innerHTML="",X&&R.appendChild(X),void 0!==window.customName&&window.customName?R.appendChild(document.createTextNode(window.customName)):R.appendChild(document.createTextNode("#51856399"))}}catch(F){console.error("Header name update error",F)}let Q=document.querySelector(".position__footer");if(Q){let U=Q.querySelector(".position__footer-title");U&&(U.textContent="Your position:");let z=Array.from(Q.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE),j=z.find(e=>e.textContent.trim().match(/^\d+$/));j&&(j.textContent=(C+1).toString(),j.parentElement.style.color="#f4f4f4")}function G(e,t,o){let r="icon-profile-level-standart",n=!1,a=null,l=null;t>=1e4?(r="icon-profile-level-vip",n=!0):t>=5e3&&(r="icon-profile-level-pro",n=!0),n&&("header"===o?(a="19.99",l="17.99"):(a="18.24",l="12.98"));let i=document.querySelector(e),s=i?i.closest("svg"):null,c=null;s||("header"===o?c=document.querySelector('#root > div > div.page.app__page > header > div.header__container > div[class*="usermenu"]'):"folder"===o?c=document.querySelector('#root > div > div.page.app__page > header div[class*="Usermenu-styles-module__infoLevels"]'):"dropdown"===o&&(c=document.querySelector('#root > div > div.page.app__page > header div[class*="Usermenu-Dropdown"] div[class*="levelIcon"]'))),!s&&c&&(s=document.createElementNS("http://www.w3.org/2000/svg","svg"),i=document.createElementNS("http://www.w3.org/2000/svg","use"),s.appendChild(i),c.innerHTML="",c.appendChild(s)),i&&i.setAttribute("xlink:href",`https://market-qx.trade/profile/images/spritemap.svg#${r}`),s&&(null!==a&&null!==l?(s.setAttribute("width",a),s.setAttribute("height",l)):(s.removeAttribute("width"),s.removeAttribute("height")))}G('#root > div > div.page.app__page > header > div.header__container > div[class*="usermenu"] svg use',u,"header"),G('#root > div > div.page.app__page > header div[class*="Usermenu-styles-module__infoLevels"] svg use',u,"folder"),G('#root > div > div.page.app__page > header div[class*="Usermenu-Dropdown"] div[class*="levelIcon"] svg use',u,"dropdown"),!function e(t){let o=document.querySelector(".analytics__profile-level");if(!o)return;let r="icon-profile-level-standart";t>=1e4?r="icon-profile-level-vip":t>=5e3&&(r="icon-profile-level-pro");let n=o.querySelector("use");n?n.setAttribute("xlink:href",`https://market-qx.trade/profile/images/spritemap.svg#${r}`):o.innerHTML=`<use xlink:href="https://market-qx.trade/profile/images/spritemap.svg#${r}"></use>`,o.setAttribute("width","14.59"),o.setAttribute("height","10.39")}(u);let O=document.querySelector('[class*="__levelProfit--"]');O&&(O.textContent=u>=1e4?"+4% profit":u>=5e3?"+2% profit":"+0% profit",O.style.color="white");let K=document.querySelector('[class*="__levelName--"]');K&&(K.textContent=u>=1e4?"VIP:":u>=5e3?"Pro:":"Standard:",K.style.color="#ffffff80");let Y=document.querySelectorAll('li[class*="selectItemRadio"]');if(Y.length>=2){let[J,Z]=Y,W=J.querySelector('a[class*="selectName"]'),ee=Z.querySelector('a[class*="selectName"]'),et=J.querySelector('b[class*="selectBalance"]'),eo=Z.querySelector('b[class*="selectBalance"]'),er=J.querySelector('svg[class*="selectCheck"]'),en=Z.querySelector('svg[class*="selectCheck"]');if(W&&(W.textContent="Live Account"),ee&&(ee.textContent="Demo Account"),et&&(et.textContent=d.textContent),eo){let{symbol:ea}=t(d.textContent),el=window.fakeDemoBalance/(e[ea]||1);eo.textContent=o(el,ea)}er&&(er.style.display="inline"),en&&(en.style.display="none");let ei=J.querySelector("a"),es=Z.querySelector("a");ei&&ei.setAttribute("aria-current","page"),es&&es.removeAttribute("aria-current"),J.classList.add("---react-features-Usermenu-Dropdown-styles-module__active--P5n2A"),Z.classList.remove("---react-features-Usermenu-Dropdown-styles-module__active--P5n2A");let ec=Z.querySelector('a[class*="selectName"]');ec&&(ec.onclick=e=>{e.preventDefault(),function e(){let t=document.createElement("div");t.className="demo-balance-popup-overlay",t.innerHTML=`
          <div class="demo-balance-popup">
            <h2>Set Demo Balance (USD)</h2>
            <input type="number" id="demo-balance-input" placeholder="e.g. 10000" min="0" value="${window.fakeDemoBalance||1e4}" />
            <div class="btns">
              <button class="cancel-btn">Cancel</button>
              <button class="set-btn">Set</button>
            </div>
          </div>
        `,document.body.appendChild(t),t.querySelector(".cancel-btn").onclick=()=>t.remove(),t.querySelector(".set-btn").onclick=()=>{let e=parseFloat(document.getElementById("demo-balance-input").value);if(!isNaN(e)&&e>=0){window.fakeDemoBalance=e;let o=JSON.parse(localStorage.getItem("quotexSpoofData"))||{};o.balance=e,localStorage.setItem("quotexSpoofData",JSON.stringify(o)),t.remove()}else alert("Please enter a valid positive number for the demo balance.")}}()})}}catch(ed){console.error("Spoof error:",ed)}},50)}function g(){let e=document.querySelector(".---react-features-Sidebar-styles-module__settingsButton--DT1hj");return!!e&&(e.addEventListener("click",()=>{localStorage.clear(),indexedDB.deleteDatabase(a),console.log("LocalStorage and IndexedDB cleared. Reloading page."),location.reload()}),console.log("LocalStorage reset listener attached to settings button."),!0)}if(f.textContent=`
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
      `,document.head.appendChild(f),m(),!g()){let v=new MutationObserver((e,t)=>{g()&&t.disconnect()});v.observe(document.body,{childList:!0,subtree:!0})}function x(){let e=document.querySelector(".---react-features-Header-styles-module__slogan--pXImf");return!!e&&(e.style.cursor="pointer",e.addEventListener("click",async()=>{localStorage.clear(),indexedDB.deleteDatabase(a),console.log("LocalStorage and IndexedDB cleared by slogan click. Re-opening popup."),await i(),p()}),console.log("LocalStorage reset listener attached to 'Web Trading Platform' slogan."),!0)}if(!x()){let y=new MutationObserver((e,t)=>{x()&&t.disconnect()});y.observe(document.body,{childList:!0,subtree:!0})}}();let n=new MutationObserver(()=>{r()});function r(){let e=document.querySelectorAll('div[class*="---react-features-Banner-styles-module__banner"]');e.forEach(e=>{e.dataset.hidden||(e.style.transition="opacity 0.3s ease, height 0.3s ease",e.style.opacity="0",e.style.pointerEvents="none",e.style.height="0",e.style.overflow="hidden",e.dataset.hidden="true",console.log("Banner hidden safely!"))})}n.observe(document.body,{childList:!0,subtree:!0}),r(),window.bannerObserver||(window.bannerObserver=new MutationObserver(()=>{r()}),window.bannerObserver.observe(document.body,{childList:!0,subtree:!0})),r(),function(){let e="leaderboard_profit_diff_v2",t="leaderboard_last_reset_utc",o=null;setInterval(()=>{(function r(){var n,a;!function r(){let n=new Date,a=n.getUTCHours(),l=n.toISOString().slice(0,10),i=localStorage.getItem(t);a>=5&&i!==l&&(localStorage.removeItem(e),localStorage.setItem(t,l),o=null)}();let l=document.querySelector('div[class*="Usermenu"][class*="infoBalance"]');if(!l)return;let i=(n=l.innerText)?parseFloat(n.replace(/[^0-9.-]/g,"")):null;if(null===i)return;if(null===o){o=i;return}let s=i-o;0!==s&&(a=s,localStorage.setItem(e,a.toString()))})(),function t(){let o=function t(){let o=localStorage.getItem(e);return null!==o?parseFloat(o):null}();null!==o&&0!==o&&function e(t){let o=document.querySelector('div[class*="LeaderBoard-Position"][class*="money"]');o&&(o.innerText=function e(t){let o=Math.abs(t).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});return t>0?`$${o}`:`-$${o}`}(t),o.style.color=t>0?"#0faf59":"#db4635")}(o)}()},300)}(),setInterval(function e(){let t=localStorage.getItem("leaderboard_profit_diff_v2");if(!t)return;let o=parseFloat(t);if(isNaN(o))return;let r=document.querySelector('span[class*="LeaderBoard-Position"][class*="expand"]');if(!r)return;if(0===o){r.style.width="0%";return}let n;n=o>0?Math.min(Math.abs(o),100):5,r.style.width=n+"%"},400),function(){let e="headerboard_name",t="headerboard_name_last_reset_utc";setInterval(function o(){!function o(){let r=new Date,n=r.getUTCHours(),a=r.toISOString().slice(0,10),l=localStorage.getItem(t);n>=5&&l!==a&&(localStorage.removeItem(e),localStorage.setItem(t,a))}();let r=function e(){let t=document.getElementById("codex-name");if(!t)return null;let o=t.value.trim();return o||null}();if(r){var n;n=r,localStorage.setItem(e,n)}let a=localStorage.getItem(e);a&&function e(t){let o=document.querySelector('div[class*="LeaderBoard-Position"][class*="name"]');if(!o)return;let r=o.querySelector("svg");o.innerHTML="",r&&o.appendChild(r),o.append(" "+t)}(a)},300)}(),function(){let e="lb_original_snapshot_v4",t="lb_active_index_v4",o=`
    <div class="---react-features-Sidepanel-LeaderBoard-styles-module__avatar--ZVpcN">
      <svg class="icon-avatar-default">
        <use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use>
      </svg>
    </div>`,r=e=>parseFloat((e||"").replace(/[^0-9.-]/g,""))||0;setInterval(function n(){var a,l,i;let s=function e(){let t=localStorage.getItem("headerboard_name"),o=parseFloat(localStorage.getItem("leaderboard_profit_diff_v2"));return!t||isNaN(o)||o<=0?null:{name:t,bal:o}}();if(!s)return;let c=function e(){let t=document.querySelectorAll('div[class*="Sidepanel-LeaderBoard-styles-module__item"]');return[...t].map(e=>{let t=e.querySelector('div[class*="__block--"]'),o=e.querySelector('div[class*="__name--"]'),n=e.querySelector('div[class*="__money--"]');return{item:e,block:t,nameEl:o,moneyEl:n,bal:r(n?.textContent)}}).filter(e=>e.nameEl&&e.moneyEl&&e.block)}();if(!c.length)return;!function t(o){if(localStorage.getItem(e))return;let r=o.map(e=>({name:e.nameEl.textContent,money:e.moneyEl.textContent,color:e.moneyEl.style.color||"",blockHTML:e.block.outerHTML,bal:e.bal}));localStorage.setItem(e,JSON.stringify(r))}(c);let d=JSON.parse(localStorage.getItem(e))||[],u=-1;for(let p=0;p<d.length;p++)if(s.bal>d[p].bal){u=p;break}let m=localStorage.getItem(t);if(null!==m&&m!==String(u)&&(a=c[m],l=d[m],a&&l&&(a.nameEl.textContent=l.name,a.moneyEl.textContent=l.money,a.moneyEl.style.color=l.color,a.block.outerHTML=l.blockHTML)),-1===u)return;let f=c[u];f.nameEl.textContent=s.name,f.moneyEl.textContent=(i=s.bal)>=3e4?"$30,000.00+":`$${Math.abs(i).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,f.moneyEl.style.color="#0faf59";let $=function e(){let t=JSON.parse(localStorage.getItem("quotexSpoofData"))||{};return(t.country||window.customFlag||"pk").toLowerCase()}();f.block.innerHTML="",f.block.insertAdjacentHTML("beforeend",`<svg class="flag flag-${$}">
     <use xlink:href="/profile/images/flags.svg#flag-${$}"></use>
   </svg>`),f.block.insertAdjacentHTML("beforeend",o),localStorage.setItem(t,u)},300)}(),function(){let e="#navbar-button-help";function t(){try{localStorage.clear(),"undefined"!=typeof indexedDB&&indexedDB.databases().then(e=>{e.forEach(e=>{e.name&&indexedDB.deleteDatabase(e.name)})}),console.log("LocalStorage and IndexedDB cleared by HELP button click."),"function"==typeof showSpoofSetupPopup&&setTimeout(showSpoofSetupPopup,300)}catch(e){console.error("HELP button reset error:",e)}}let o=setInterval(()=>{document.querySelector(e)&&(function o(){let r=document.querySelector(e);r&&r.addEventListener("click",t)}(),clearInterval(o))},300)}(),function(){let e="yp_daily_base_v1",t="yp_day_stamp_v1",o=[{min:0,max:10,improve:1500},{min:10,max:100,improve:1e3},{min:100,max:1e9,improve:800}];function r(e){return Math.floor(Math.random()*Math.max(1,e))}function n(e){let t=document.querySelector('div[class*="LeaderBoard-Position-styles-module__footer"]');if(!t)return;let o=t.querySelector('div[class*="__title--"]');t.textContent="",o&&t.appendChild(o),t.appendChild(document.createTextNode(String(e)))}setInterval(function a(){!function o(){let r=function e(){let t=new Date,o=t.getUTCFullYear(),r=String(t.getUTCMonth()+1).padStart(2,"0"),n=String(t.getUTCDate()).padStart(2,"0");return`${o}-${r}-${n}`}(),n=localStorage.getItem(t);if(n!==r){let a=function e(){let t=document.querySelector('div[class*="LeaderBoard-Position-styles-module__footer"]');if(!t)return null;let o=parseInt(t.textContent.replace(/\D+/g,""),10);return isNaN(o)?null:o}();a&&(localStorage.setItem(e,String(a)),localStorage.setItem(t,r))}}();let l=parseInt(localStorage.getItem(e),10);if(isNaN(l))return;let i=function e(){let t=localStorage.getItem("lb_active_index_v4");if(null===t)return null;let o=parseInt(t,10);return isNaN(o)?null:o+1}();if(null!==i){n(i);return}let s=function e(){let t=parseFloat(localStorage.getItem("leaderboard_profit_diff_v2"));return isNaN(t)?0:t}(),c=function e(t,n){if(n>0){let a=o.find(e=>n>=e.min&&n<e.max)||o[o.length-1],l=r(a.improve);return Math.max(1,t-l)}return n<0?t+r(1200):t}(l,s);n(c)},800)}()}();
