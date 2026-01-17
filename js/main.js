/* PAGE SWITCH */
function switchPage(id){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  
  /* SIDEBAR HOVER EXPAND */
  const sidebar = document.getElementById('sidebar');
  sidebar.addEventListener('mouseenter', ()=>sidebar.classList.add('expanded'));
  sidebar.addEventListener('mouseleave', ()=>sidebar.classList.remove('expanded'));
  
  /* TIMELINE */
  ["normal","normal","warning","critical","critical"].forEach(t=>{
    const d=document.createElement("div");
    d.className=`slot ${t}`;
    document.getElementById("timelineBar").appendChild(d);
  });
  
  /* CHARTS */
  new Chart(document.getElementById("defectsChart"), {
    type:"bar",
    data:{labels:["A","B","C","D"], datasets:[{data:[12,7,5,9], backgroundColor:["#ff4d4f","#fadb14","#52c41a","#2b5cff"], barThickness:6}]},
    options:{plugins:{legend:{display:false}}}
  });
  
  new Chart(document.getElementById("yieldChart"), {
    type:"line",
    data:{labels:["W1","W2","W3","W4"], datasets:[{data:[92,95,90,93], borderColor:"#52c41a", tension:0.4}]},
    options:{plugins:{legend:{display:false}}, scales:{y:{max:100}}}
  });
  
  new Chart(document.getElementById("oeeChart"), {
    type:"line",
    data:{labels:["W1","W2","W3","W4"], datasets:[{data:[85,88,82,87], borderColor:"#9aa4ff", tension:0.4}]},
    options:{plugins:{legend:{display:false}}, scales:{y:{max:100}}}
  });
  
  new Chart(document.getElementById("scrapChart"), {
    type:"bar",
    data:{labels:["W1","W2","W3","W4"], datasets:[{data:[5,4,6,3], backgroundColor:"#9bf6ff", barThickness:6}]},
    options:{plugins:{legend:{display:false}}}
  });
  
  /* HEADER CLICK */
  document.getElementById("homeBtn").onclick = ()=>switchPage('dashboardPage');
  
  /* ================= POPOVER TOGGLE ================= */
  const anomalyTab = document.getElementById("anomalyTab");
  const maintenanceTab = document.getElementById("maintenanceTab");
  const anomalyPopover = document.getElementById("anomalyPopover");
  const maintenancePopover = document.getElementById("maintenancePopover");
  
  function togglePopover(tab, popover){
    const open = popover.style.display === "block";
    tab.classList.toggle("active", !open);
    popover.style.display = open ? "none" : "block";
    if(!open) popover.classList.add("glow");
    const sidebarWidth = document.getElementById('sidebar').offsetWidth;
    popover.style.left = sidebarWidth + 10 + "px";
    setTimeout(()=>popover.classList.remove("glow"), 3000);
  }
  
  anomalyTab.onclick = ()=>togglePopover(anomalyTab, anomalyPopover);
  maintenanceTab.onclick = ()=>togglePopover(maintenanceTab, maintenancePopover);
  