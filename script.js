// content.js - Full merged code for Market QX Pro Enhancer
(function () {
  // --- CSS for Transaction Manager Popup ---
  const transactionStyle = document.createElement("style");
  transactionStyle.innerHTML = `
    .tx-popup-overlay { position: fixed; top:0;left:0;width:100%;height:100%;background: rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:9999; }
    .tx-popup { background:#fff;padding:20px;border-radius:12px;width:420px;font-family:Arial,sans-serif;color:#000;box-shadow:0 4px 15px rgba(0,0,0,0.2);}
    .tx-popup h2 { margin:0 0 15px;font-size:18px;text-align:center; }
    .tx-popup label { font-weight:bold;display:block;margin-top:10px;margin-bottom:4px; }
    .tx-popup input, .tx-popup select { width:100%;padding:6px 8px;margin-bottom:10px;border:1px solid #ccc;border-radius:6px;font-size:14px; }
    .tx-popup button { width:48%;padding:10px;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:14px; }
    .tx-popup .add-btn { background:#0faf59;color:white; }
    .tx-popup .cancel-btn { background:#ccc; }
    .tx-popup .btns { display:flex;justify-content:space-between; }
    .tx-popup .mode-select { display:flex; justify-content: space-between; margin-bottom:10px; }
    .tx-popup .mode-select label { flex:1; text-align:center; cursor:pointer; border:1px solid #ccc; border-radius:6px; padding:6px 0; }
    .tx-popup .mode-select input { display:none; }
    .tx-popup .mode-select label.active { background:#0faf59;color:#fff; border-color:#0faf59; }
  `;
  document.head.appendChild(transactionStyle);

  // --- Popup Function for Transaction Manager ---
  function openTransactionPopup() {
    const overlay = document.createElement("div");
    overlay.className = "tx-popup-overlay";
    overlay.innerHTML = `
      <div class="tx-popup">
        <h2>Transaction Manager</h2>

        <div class="mode-select">
          <input type="radio" name="tx-mode" id="mode-add" checked>
          <label for="mode-add" class="active">Add New</label>
          <input type="radio" name="tx-mode" id="mode-edit">
          <label for="mode-edit">Edit Existing</label>
        </div>

        <div id="edit-section" style="display:none;">
          <label>Order Number</label>
          <select id="tx-existing-order">
            <option value="">Select Order</option>
          </select>
        </div>

        <label>Date & Time</label>
        <input type="text" id="tx-date" placeholder="22/08/2025, 22:27:52" />

        <label>Status</label>
        <select id="tx-status">
          <option value="Processing">Processing</option>
          <option value="Successful">Successful</option>
          <option value="Failed">Failed</option>
        </select>

        <label>Transaction Type</label>
        <select id="tx-type">
          <option value="Deposit">Deposit</option>
          <option value="Withdrawal">Withdrawal</option>
        </select>

        <label>Payment System</label>
        <input type="text" id="tx-method" placeholder="USDT (TRC-20)" />

        <label>Amount</label>
        <input type="text" id="tx-amount" placeholder="100" />

        <div class="btns">
          <button class="cancel-btn">Cancel</button>
          <button class="add-btn">Add / Update</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // --- Mode Switching ---
    const addLabel = overlay.querySelector('label[for="mode-add"]');
    const editLabel = overlay.querySelector('label[for="mode-edit"]');
    const editSection = overlay.querySelector("#edit-section");
    const orderSelect = overlay.querySelector("#tx-existing-order");

    function updateMode() {
      if(document.getElementById("mode-add").checked){
        addLabel.classList.add("active");
        editLabel.classList.remove("active");
        editSection.style.display="none";
      }else{
        addLabel.classList.remove("active");
        editLabel.classList.add("active");
        editSection.style.display="block";
        populateOrderList();
      }
    }

    addLabel.onclick = () => { document.getElementById("mode-add").checked=true; updateMode(); };
    editLabel.onclick = () => { document.getElementById("mode-edit").checked=true; updateMode(); };

    // Cancel button
    overlay.querySelector(".cancel-btn").onclick = () => overlay.remove();

    // --- Random Order Generator ---
    function generateOrder() { return "9" + Math.floor(1000000 + Math.random() * 9000000); }

    // Populate order list
    function populateOrderList(){
      orderSelect.innerHTML = '<option value="">Select Order</option>';
      document.querySelectorAll('.---react-ui-TransactionsScreenItem-styles-module__transactions-item--imQKR').forEach(tx=>{
        const id = tx.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__id--Ttk2j')?.innerText;
        if(id) orderSelect.innerHTML += `<option value="${id}">${id}</option>`;
      });
    }

    // Pre-fill data when selecting existing order
    orderSelect.onchange = function(){
      const selected = this.value;
      if(!selected) return;
      const txDiv = Array.from(document.querySelectorAll('.---react-ui-TransactionsScreenItem-styles-module__transactions-item--imQKR')).find(x=>x.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__id--Ttk2j').innerText===selected);
      if(!txDiv) return;
      document.getElementById("tx-date").value = txDiv.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__date--n6Gnu')?.innerText || "";
      const typeText = txDiv.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__type--yRiVa')?.innerText || "Deposit";
      document.getElementById("tx-type").value = typeText;
      const methodText = txDiv.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__method--oY8r8')?.innerText || "USDT (TRC-20)";
      document.getElementById("tx-method").value = methodText;
      let amtText = txDiv.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__amount--v9Gal')?.innerText || "0";
      amtText = amtText.replace(/[^0-9.-]/g,"");
      document.getElementById("tx-amount").value = amtText;
      let statusText = txDiv.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-text--JmjRX')?.innerText || "Processing";
      if(statusText.includes("Waiting")) statusText="Processing";
      else if(statusText.includes("Processing")) statusText="Processing";
      else if(statusText.includes("Failed")) statusText="Failed";
      else statusText="Successful";
      document.getElementById("tx-status").value = statusText;
    }

    // --- Add / Update Transaction ---
    overlay.querySelector(".add-btn").onclick = () => {
      const isEdit = document.getElementById("mode-edit").checked;
      let order = generateOrder();
      const date = document.getElementById("tx-date").value || new Date().toLocaleString();
      const status = document.getElementById("tx-status").value;
      const type = document.getElementById("tx-type").value;
      const method = document.getElementById("tx-method").value || "USDT (TRC-20)";
      let amount = document.getElementById("tx-amount").value || "0";

      // Format amount
      amount = Number(amount.replace(/[^\d.]/g,"")).toLocaleString();
      amount = "$" + amount;
      let color = type==="Withdrawal" ? "#db4635" : "#0faf59";
      if(type==="Withdrawal" && !amount.startsWith("-")) amount="-"+amount;
      if(type==="Deposit" && !amount.startsWith("+")) amount="+"+amount;

      // Status Block
      let statusBlock="";
      if(status==="Processing"){
        const text = type==="Withdrawal"?"Waiting confirmation":"Processing...";
        const desc = type==="Withdrawal"?"The withdrawal is currently being processed on the side of the financial operator. Please wait - the funds should be received within 48 hours.":"Please note that payments with this method could take up to 24 hours to get processed. If it's not on your balance by that time - please submit a support ticket. The status may appear as «Failed» until the funds are actually received on our side.";
        statusBlock = `<div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-block--srWT8">
          <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-icon--iGg0J ---react-ui-TransactionsScreenItem-styles-module__muted--FGTfS">
            <svg class="icon-pending"><use xlink:href="/profile/images/spritemap.svg#icon-pending"></use></svg>
          </div>
          <span class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-text--JmjRX" style="color:#f4f4f4">${text}</span>
        </div>
        <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-processed--B3z9o">${desc}</div>`;
      }else if(status==="Successful"){
        statusBlock = `<div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-block--srWT8">
          <span class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-text--JmjRX" style="color:#0faf59">Successed</span>
        </div>`;
      }else if(status==="Failed"){
        statusBlock = `<div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-block--srWT8">
          <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-icon--iGg0J ---react-ui-TransactionsScreenItem-styles-module__danger--YdX2Q">
            <svg class="icon-close-tiny"><use xlink:href="/profile/images/spritemap.svg#icon-close-tiny"></use></svg>
          </div>
          <span class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-text--JmjRX ---react-ui-TransactionsScreenItem-styles-module__close-tiny--FF3r3">Failed</span>
        </div>`;
      }

      if(isEdit){
        const selectedOrder = orderSelect.value;
        if(!selectedOrder) return alert("Select an order to edit");
        const txDiv = Array.from(document.querySelectorAll('.---react-ui-TransactionsScreenItem-styles-module__transactions-item--imQKR'))
          .find(x=>x.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__id--Ttk2j')?.innerText===selectedOrder);
        if(!txDiv) return;
        txDiv.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__date--n6Gnu').innerText = date;
        txDiv.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__type--yRiVa').innerText = type;
        txDiv.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__method--oY8r8').innerText = method;
        txDiv.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__amount--v9Gal').innerText = amount;
        txDiv.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__amount--v9Gal').style.color=color;
        txDiv.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item__status--iqTzO').innerHTML=statusBlock;
      }else{
        const tx = document.createElement("div");
        tx.className="---react-ui-TransactionsScreenItem-styles-module__transactions-item--imQKR";
        tx.innerHTML=`
          <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__id--Ttk2j">${order}</div>
          <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__date--n6Gnu">${date}</div>
          <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status--iqTzO">${statusBlock}</div>
          <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__type--yRiVa">${type}</div>
          <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__method--oY8r8">${method}</div>
          <b class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__amount--v9Gal" style="color:${color}">${amount}</b>`;
        document.querySelector(".transactions-list__header").after(tx);
      }

      overlay.remove();
    };

    updateMode();
  }

  // Attach listener for Transaction Manager popup
  // Using MutationObserver to ensure the header is present
  function attachTransactionPopupListener() {
    const header = document.querySelector(".transactions-list__header");
    if (header) {
      header.style.cursor = "pointer";
      header.addEventListener("click", openTransactionPopup);
      console.log("Transaction Manager popup trigger attached.");
      return true;
    }
    return false;
  }

  if (!attachTransactionPopupListener()) {
    const observer = new MutationObserver((mutations, obs) => {
      if (attachTransactionPopupListener()) {
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }


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
  document.head.appendChild(spoofStyle);

  // Build country options (show Name (CODE)) with black text color
  let countryOptions = '';
  flagList.forEach(f => {
    const display = `${f.name} (${f.code.toUpperCase()})`;
    const disabled = f.active ? '' : ' disabled';
    countryOptions += `<option value="${f.code}"${disabled} style="color:black;">${display}${f.active ? '' : ' — Inactive'}</option>`;
  });

  // Function to show the spoof setup popup
  function showSpoofSetupPopup() {
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

        <div class="actions">
          <button class="btn cancel" id="codex-cancel">Cancel</button>
          <button class="btn start" id="codex-start">Start</button>
        </div>
      </div>
    `;
    document.body.appendChild(spoofOverlay);

    // Handle Cancel for Quotex Spoof
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
      // License key validation
      if (!isValidKey(key)) {
          alert('Invalid license key. Please contact admin.');
          return;
      }

      // Store values in localStorage
      localStorage.setItem('quotexSpoofData', JSON.stringify({
        name: name,
        balance: balance,
        country: country,
        key: key
      }));

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
  }

  // Function to load spoof data from localStorage and start spoofing
  function loadSpoofDataAndStart() {
    const savedData = localStorage.getItem('quotexSpoofData');
    if (savedData) {
      const data = JSON.parse(savedData);
      window.customName = data.name;
      window.fakeDemoBalance = data.balance;
      window.customFlag = data.country;
      window.userKey = data.key;
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
        <h2>Set Demo Balance</h2>
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
        window.fakeDemoBalance = newBalance;
        overlay.remove();
      } else {
        alert("Please enter a valid positive number for the demo balance.");
      }
    };
  }

  // ====== ORIGINAL SPOOF LOGIC (preserved, unchanged behavior) ======
  function startSpoof() {
    // Demo URL enforce removed as per user request

    let previousBalance = null;
    let profitLoss = 0;
    let customPosition = 2393; // Default start position

    // --- Load persisted data ---
    const persistedData = localStorage.getItem('quotexSpoofLeaderboardData');
    if (persistedData) {
      const data = JSON.parse(persistedData);
      const now = new Date().getTime();
      // Check if data is less than 24 hours old (24 * 60 * 60 * 1000 milliseconds)
      if (now - data.timestamp < 24 * 60 * 60 * 1000) {
        profitLoss = data.profitLoss;
        customPosition = data.customPosition;
        console.log("Loaded persisted leaderboard data:", { profitLoss, customPosition });
      } else {
        console.log("Persisted leaderboard data expired (older than 24 hours). Resetting.");
        localStorage.removeItem('quotexSpoofLeaderboardData');
      }
    }

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
        }
      }
    }, 1000);

    setInterval(() => {
      try {
        // This line is already present and helps, but the new logic above is more robust for initial load/redirects
        if (location.pathname === "/en/demo-trade") {
          history.pushState({}, "", "/en/trade"); // Visual spoof only (no redirect) // This line seems to be trying to change to /en/trade, which is counter-intuitive to staying on demo.
                                                  // If the goal is to *always* be on demo-trade, this line should be removed or modified.
                                                  // For the purpose of enforcing demo-trade, I'll assume this line was a remnant or intended for a different spoof aspect.
                                                  // The new logic at the start of startSpoof() will override this if it tries to redirect away from demo.
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
          if (diff !== 0) {
            profitLoss += diff;
            saveLeaderboardData(); // Save profitLoss after every change
          }
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
    innerBar.style.backgroundColor = profitLoss >= 0 ? "#0faf59" : "#db4635";
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
                if (avatarEl) avatarEl.innerHTML = getDefaultAvatarHTML();
                if (flagEl) flagEl.outerHTML = getCustomFlagHTML();
            }
        } else {
            // Smooth transition for >$40 and below 20th profit
            const fakeStart = 800;
            const fakeEnd = 21;
            const rangeStart = 40;
            const rangeEnd = profit20th !== null ? profit20th : 1000;
            const t = Math.min(1, Math.max(0, (profitLoss - rangeStart) / (rangeEnd - rangeStart)));
            const eased = 1 - (1 - t) * (1 - t);
            yourPositionDisplay = Math.round(fakeStart + (fakeEnd - fakeStart) * eased);
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
                useEl.setAttribute("xlink:href", `/profile/images/spritemap.svg#${iconHref}`);
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

        // Call the new functions for each icon location
        updateAccountLevelIcon('#root > div > div.page.app__page > header > div.header__container > div[class*="usermenu"] svg use', balance, 'header');
        updateAccountLevelIcon('#root > div > div.page.app__page > header div[class*="Usermenu-styles-module__infoLevels"] svg use', balance, 'folder');
        updateAccountLevelIcon('#root > div > div.page.app__page > header div[class*="Usermenu-Dropdown"] div[class*="levelIcon"] svg use', balance, 'dropdown');


        const percentEl = document.querySelector('[class*="__levelProfit--"]');
        if (percentEl) {
          percentEl.textContent = balance >= 10000 ? "+4% profit" : balance >= 5000 ? "+2% profit" : "+0% profit";
          percentEl.style.color = "white";
        }

        const statusTextEl = document.querySelector('[class*="__levelName--"]');
        if (statusTextEl) {
          statusTextEl.textContent = balance >= 10000 ? "VIP:" : balance >= 5000 ? "Pro:" : "Standard:";
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

          // Add event listener to Demo Account option to open demo balance popup
          // Add event listener only to the "Demo Account" text link
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
    }, 300);
  }

  // Check localStorage and decide whether to show popup or start spoofing
  loadSpoofDataAndStart();
})();

// ===== START FROM: function hideBannerSafely() =====
// (hideBannerSafely implementation remains unchanged in your content.js)

/* ================== YOUR POSITION ENGINE (UTC REMOVED) ================== */

(function () {
  "use strict";

  /* ================== CONFIG ================== */

  const BASE_KEY   = "yp_base_fixed_v1";      // ek dafa read hone wali base position
  const ACTIVE_KEY = "lb_active_index_v4";   // leaderboard override
  const PROFIT_KEY = "leaderboard_profit_diff_v2";

  const PROFIT_BANDS = [
    { min: 0,   max: 10,   improve: 1500 }, // $10 → ~1500 range
    { min: 10,  max: 100,  improve: 1000 }, // $100 → ~1000 range
    { min: 100, max: 1e9,  improve: 800  }
  ];

  const LOSS_BAND = 1200;

  /* ================== HELPERS ================== */

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
    return n + 1;
  }

  function readBaseOnce() {
    if (localStorage.getItem(BASE_KEY)) return;

    const el = document.querySelector(
      'div[class*="LeaderBoard-Position-styles-module__footer"]'
    );
    if (!el) return;

    const num = parseInt(el.textContent.replace(/\D+/g, ""), 10);
    if (!isNaN(num)) {
      localStorage.setItem(BASE_KEY, String(num));
    }
  }

  function computePosition(base, profit) {
    if (profit > 0) {
      const band =
        PROFIT_BANDS.find(b => profit >= b.min && profit < b.max) ||
        PROFIT_BANDS[PROFIT_BANDS.length - 1];

      return Math.max(1, base - rand(band.improve));
    }

    if (profit < 0) {
      return base + rand(LOSS_BAND);
    }

    return base;
  }

  function writePosition(value) {
    const el = document.querySelector(
      'div[class*="LeaderBoard-Position-styles-module__footer"]'
    );
    if (!el) return;

    const title = el.querySelector('div[class*="__title--"]');
    el.textContent = "";
    if (title) el.appendChild(title);
    el.appendChild(document.createTextNode(String(value)));
  }

  /* ================== CORE LOOP ================== */

  function runYourPosition() {
    readBaseOnce();

    const base = parseInt(localStorage.getItem(BASE_KEY), 10);
    if (isNaN(base)) return;

    const lbRank = getLeaderboardRankIfAny();
    if (lbRank !== null) {
      writePosition(lbRank);
      return;
    }

    const profit = getProfit();
    writePosition(computePosition(base, profit));
  }

  setInterval(runYourPosition, 800);
})();

/* ================== END CORE LOOP ================== */
