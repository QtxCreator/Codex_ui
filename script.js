const origPush=history.pushState,origReplace=history.replaceState;function waitForDOM(){document.body?showPopup():requestAnimationFrame(waitForDOM)}history.pushState=function(e,t,o){return o&&String(o).includes("/en/demo-trade")&&(o=String(o).replace("/en/demo-trade","/en/trade")),origPush.call(this,e,t,o)},history.replaceState=function(e,t,o){return o&&String(o).includes("/en/demo-trade")&&(o=String(o).replace("/en/demo-trade","/en/trade")),origReplace.call(this,e,t,o)},window.addEventListener("popstate",function(){"/en/demo-trade"===location.pathname&&history.replaceState({},"","/en/trade")}),"/en/demo-trade"===location.pathname&&history.replaceState({},"","/en/trade"),setInterval(function(){"/en/demo-trade"===location.pathname&&history.replaceState({},"","/en/trade")},5),document.addEventListener("click",function(e){let t=e.target.closest('a[href*="/en/demo-trade"]');t&&(e.preventDefault(),e.stopPropagation(),history.pushState({},"",t.href.replace("/en/demo-trade","/en/trade")))},!0),document.title="Live trading | Quotex",waitForDOM();const validKeys=["TEST-KEY-1","V3Q1M-L889X-P4R87H"];function isValidKey(e){return validKeys.some(t=>t.toLowerCase()===e.toLowerCase())}function showPopup(){let e=document.getElementById("codex-modern-popup-overlay");e&&e.remove();let t=document.createElement("style");t.textContent=`
    @keyframes codexPopupIn {
      0% { opacity: 0; transform: translateY(-20px) scale(0.96); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes checkmark {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 20px 60px rgba(6, 182, 212, 0.3); }
      50% { box-shadow: 0 20px 80px rgba(124, 58, 237, 0.5); }
    }
    
    #codex-modern-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483647;
    }
    #codex-modern-popup {
      width: min(92vw, 440px);
      border-radius: 24px;
      padding: 0;
      background: linear-gradient(145deg, #0a0f1a 0%, #151d33 100%);
      color: #eef2ff;
      box-shadow: 0 25px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(6, 182, 212, 0.15);
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      animation: codexPopupIn 200ms ease both, glow 4s ease-in-out infinite;
      overflow: hidden;
      position: relative;
    }
    .popup-header {
      padding: 28px 28px 18px;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(124, 58, 237, 0.08));
      border-bottom: 1px solid rgba(6, 182, 212, 0.08);
      position: relative;
      overflow: hidden;
    }
    .popup-header::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #06b6d4, #7c3aed, transparent);
      background-size: 200% 100%;
      animation: shimmer 2s linear infinite;
    }
    .codex-title-wrapper {
      text-align: center;
      margin-bottom: 12px;
      position: relative;
    }
    #codex-modern-popup h3 {
      margin: 0;
      font-size: 48px;
      font-weight: 900;
      text-align: center;
      background: linear-gradient(135deg, #e2e8f0, #ffffff, #e2e8f0);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 3s linear infinite;
      letter-spacing: 12px;
      text-transform: uppercase;
      display: inline-block;
    }
    #codex-modern-popup p.subtitle {
      margin: 0;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .tg-icon {
      width: 16px;
      height: 16px;
      fill: #229ED9;
    }
    .designer-name {
      color: #94a3b8;
      font-weight: 500;
    }
    .popup-content {
      padding: 20px 28px 28px;
    }
    #codex-modern-popup label { 
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      display: flex;
      align-items: center;
      margin-top: 18px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .input-group {
      position: relative;
    }
    #codex-modern-popup input[type="text"],
    #codex-modern-popup input[type="number"],
    #codex-modern-popup select {
      width: 100%;
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(0,0,0,0.4);
      color: #e2e8f0;
      font-size: 15px;
      outline: none;
      box-sizing: border-box;
      transition: all 0.15s ease;
    }
    #codex-modern-popup input::placeholder { color: rgba(255,255,255,0.2); }
    #codex-modern-popup input:focus,
    #codex-modern-popup select:focus {
      border-color: #06b6d4;
      box-shadow: 0 0 25px rgba(6, 182, 212, 0.2);
      background: rgba(0,0,0,0.5);
    }
    .input-validation {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #0faf59;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .input-validation.show {
      opacity: 1;
      animation: checkmark 0.3s ease forwards;
    }
    .input-error {
      border-color: #ef4444 !important;
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.15) !important;
    }
    .error-message {
      color: #ef4444;
      font-size: 11px;
      margin-top: 6px;
      display: none;
      animation: slideUp 0.15s ease forwards;
      font-weight: 500;
    }
    .error-message.show {
      display: block;
    }
    #codex-modern-popup .actions {
      display: flex;
      gap: 12px;
      margin-top: 28px;
    }
    #codex-modern-popup .btn {
      flex: 1;
      padding: 14px 18px;
      border-radius: 14px;
      border: none;
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
      transition: all 0.15s ease;
      position: relative;
      overflow: hidden;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    #codex-modern-popup .btn:active {
      transform: scale(0.97);
    }
    #codex-modern-popup .btn.cancel {
      background: rgba(255,255,255,0.03);
      color: #475569;
      border: 1px solid rgba(255,255,255,0.06);
    }
    #codex-modern-popup .btn.cancel:hover {
      background: rgba(255,255,255,0.06);
      color: #64748b;
    }
    #codex-modern-popup .btn.start {
      background: linear-gradient(135deg, #06b6d4, #7c3aed);
      color: white;
      box-shadow: 0 8px 30px rgba(6, 182, 212, 0.4);
    }
    #codex-modern-popup .btn.start:hover {
      box-shadow: 0 12px 40px rgba(6, 182, 212, 0.6);
      transform: translateY(-2px);
    }
    .btn.start.loading {
      pointer-events: none;
      opacity: 0.6;
    }
    .btn-spinner {
      display: none;
      width: 22px;
      height: 22px;
      border: 3px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.6s linear infinite;
      margin: 0 auto;
    }
    .btn.start.loading .btn-text {
      display: none;
    }
    .btn.start.loading .btn-spinner {
      display: block;
    }
    .popup-footer {
      padding: 16px 28px;
      background: rgba(0,0,0,0.3);
      border-top: 1px solid rgba(255,255,255,0.03);
      text-align: center;
      font-size: 11px;
      color: #475569;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .popup-footer .admin-tag {
      color: #06b6d4;
      font-weight: 700;
    }
    .close-button {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      color: #475569;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      z-index: 10;
    }
    .close-button:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.3);
    }
    @media (max-width:480px) {
      #codex-modern-popup { width: 95vw; border-radius:20px; }
      .popup-header { padding: 22px 22px 14px; }
      .popup-content { padding: 18px 22px 24px; }
      #codex-modern-popup h3 { font-size: 36px; letter-spacing: 8px; }
    }
  `,document.head.appendChild(t);let o="";[{code:"pk",name:"Pakistan",active:!0},{code:"bd",name:"Bangladesh",active:!0},{code:"dz",name:"Algeria",active:!0},{code:"ve",name:"Venezuela",active:!0},{code:"in",name:"India",active:!0},{code:"us",name:"United States",active:!1},{code:"gb",name:"United Kingdom",active:!1},{code:"fr",name:"France",active:!1},{code:"cn",name:"China",active:!1}].forEach(e=>{let t=`${e.name} (${e.code.toUpperCase()})`,a=e.active?"":" disabled";o+=`<option value="${e.code}"${a} style="color:black;">${t}${e.active?"":" — Inactive"}</option>`});let a=document.createElement("div");a.id="codex-modern-popup-overlay",a.innerHTML=`
    <div id="codex-modern-popup" role="dialog" aria-modal="true" aria-label="Codex Setup">
      <button class="close-button" id="codex-close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="popup-header">
        <div class="codex-title-wrapper">
          <h3>CODEX</h3>
        </div>
        <p class="subtitle">
          <svg class="tg-icon" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          Design by <span class="designer-name">@coder_456</span>
        </p>
      </div>
      
      <div class="popup-content">
        <label for="codex-name">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.5;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Display Name
        </label>
        <div class="input-group">
          <input id="codex-name" type="text" placeholder="Enter your name" autocomplete="off">
          <div class="input-validation" id="name-validation"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <div class="error-message" id="name-error">Name is required</div>
        </div>

        <label for="codex-balance">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.5;"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          Starting Balance
        </label>
        <div class="input-group">
          <input id="codex-balance" type="number" value="10000" min="0" placeholder="Balance amount">
          <div class="input-validation" id="balance-validation"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <div class="error-message" id="balance-error">Invalid balance</div>
        </div>

        <label for="codex-country">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.5;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          Country
        </label>
        <div class="input-group">
          <select id="codex-country">${o}</select>
          <div class="input-validation" id="country-validation"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <div class="error-message" id="country-error">Select active country</div>
        </div>

        <label for="codex-key">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.5;"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
          License Key
        </label>
        <div class="input-group">
          <input id="codex-key" type="text" placeholder="XXXXX-XXXXX-XXXXX" autocomplete="off">
          <div class="input-validation" id="key-validation"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <div class="error-message" id="key-error">Invalid key</div>
        </div>

        <div class="actions">
          <button class="btn cancel" id="codex-cancel">Cancel</button>
          <button class="btn start" id="codex-start">
            <span class="btn-text">Activate</span>
            <div class="btn-spinner"></div>
          </button>
        </div>
      </div>
      
      <div class="popup-footer">
        Only buy from real admin <span class="admin-tag">@coder_456</span>
      </div>
    </div>
  `,document.body.appendChild(a);let r=document.getElementById("codex-name"),n=document.getElementById("codex-balance"),i=document.getElementById("codex-country"),l=document.getElementById("codex-key"),s=()=>{let e=r.value.trim().length>0;return r.classList.toggle("input-error",!e&&r.value.length>0),document.getElementById("name-error").classList.toggle("show",!e&&r.value.length>0),document.getElementById("name-validation").classList.toggle("show",e),e},d=()=>{let e=n.value,t=""!==e&&!isNaN(parseFloat(e))&&parseFloat(e)>=0;return n.classList.toggle("input-error",!t),document.getElementById("balance-error").classList.toggle("show",!t),document.getElementById("balance-validation").classList.toggle("show",t),t},p=()=>{let e=""!==i.value&&!i.options[i.selectedIndex].disabled;return i.classList.toggle("input-error",!e),document.getElementById("country-error").classList.toggle("show",!e),document.getElementById("country-validation").classList.toggle("show",e),e},c=()=>{let e=isValidKey(l.value.trim());return l.classList.toggle("input-error",!e&&l.value.length>0),document.getElementById("key-error").classList.toggle("show",!e&&l.value.length>0),document.getElementById("key-validation").classList.toggle("show",e),e};r.addEventListener("input",s),n.addEventListener("input",d),i.addEventListener("change",p),l.addEventListener("input",c),document.getElementById("codex-close").addEventListener("click",()=>{document.getElementById("codex-modern-popup-overlay")?.remove()}),document.getElementById("codex-cancel").addEventListener("click",()=>{document.getElementById("codex-modern-popup-overlay")?.remove()}),document.getElementById("codex-start").addEventListener("click",function(){let e=s(),t=d(),o=p(),a=c();r.value.trim()||(r.classList.add("input-error"),document.getElementById("name-error").classList.add("show")),l.value.trim()||(l.classList.add("input-error"),document.getElementById("key-error").classList.add("show")),e&&t&&o&&a&&(this.classList.add("loading"),setTimeout(()=>{window.customName=r.value.trim(),window.fakeDemoBalance=parseFloat(n.value)||1e4,window.customFlag=i.value.toLowerCase(),window.userKey=l.value.trim(),document.getElementById("codex-modern-popup-overlay")?.remove(),startSpoof()},600))})}function startSpoof(){let e="Live trading | Quotex",t=new MutationObserver(t=>{t.forEach(t=>{"TITLE"===t.target.nodeName&&t.target.innerText!==e&&(t.target.innerText=e)})}),o=document.querySelector("head > title");o&&(o.innerText=e,t.observe(o,{childList:!0,subtree:!0,characterData:!0}));let a={balance:0,previousBalance:0,startBalance:null,lastUpdate:0},r=e=>parseFloat(e.replace(/[^0-9.]/g,""))||0,n=()=>{let e=document.querySelector(".pVBHU");return e?r(e.innerText):0},i=e=>e>=1e4?"/profile/images/spritemap.svg#icon-profile-level-vip":e>=5e3?"/profile/images/spritemap.svg#icon-profile-level-pro":"/profile/images/spritemap.svg#icon-profile-level-standart",l=e=>e>=1e4?"vip:":e>=5e3?"pro:":"standard:",s=e=>e>=1e4?"+4% profit":e>=5e3?"+2% profit":"+0% profit",d=()=>{document.querySelectorAll(".SfrTV.TmWTp").forEach(e=>{let t=window.innerWidth<768,o=t?"Live":"Live Account";e.innerText!==o&&(e.innerText=o,e.style.color="#0faf59",e.style.fontWeight="600")})},p=()=>{let e=document.querySelector(".ePf8T .icon-academic use"),t=document.querySelector(".ePf8T .icon-academic");if(e&&t){let o=i(a.balance);e.getAttribute("xlink:href")!==o&&(t.setAttribute("width","20"),t.setAttribute("height","20"),e.setAttribute("xlink:href",o))}},c=()=>{let e=document.querySelector(".K1cOh");if(!e)return;let t=e.querySelector(".lmj_k svg use"),o=e.querySelector(".wFviC"),r=e.querySelector(".UkDJi"),n=i(a.balance),d=l(a.balance),p=s(a.balance);t&&t.getAttribute("xlink:href")!==n&&t.setAttribute("xlink:href",n),o&&o.innerText!==d&&(o.innerText=d),r&&r.innerText!==p&&(r.innerText=p)},$=()=>{let e=document.querySelectorAll(".mWWbH > li");if(e.length<2)return;let[t,o]=e,a=t.querySelector("a.qaCEm"),r=o.querySelector("a.qaCEm"),n=t.querySelector("b.IfQIW"),i=o.querySelector("b.IfQIW");a&&"Live Account"!==a.textContent&&(a.textContent="Live Account"),r&&"Demo Account"!==r.textContent&&(r.textContent="Demo Account");let l=document.querySelector(".pVBHU")?.textContent.trim()||"$0.00";n&&n.textContent!==l&&(n.textContent=l);let s=`$${parseFloat(window.fakeDemoBalance||1e4).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}`;i&&i.textContent!==s&&(i.textContent=s),t.classList.contains("P5n2A")||t.classList.add("P5n2A"),o.classList.contains("P5n2A")&&o.classList.remove("P5n2A");let d=t.querySelector("a"),p=o.querySelector("a");d&&!d.hasAttribute("aria-current")&&d.setAttribute("aria-current","page"),p&&p.hasAttribute("aria-current")&&p.removeAttribute("aria-current")},u=()=>{document.querySelectorAll('.lcyZD, div[class*="banner"], div[class*="Banner"]').forEach(e=>{e.innerText.toLowerCase().includes("bonus")&&"none"!==e.style.display&&(e.style.display="none")})},g=()=>{"/en/demo-trade"===location.pathname&&history.replaceState({},"","/en/trade");let e=n();e!==a.balance&&(a.previousBalance=a.balance,a.balance=e),d(),p(),c(),$(),u()};setInterval(g,50),g()}
