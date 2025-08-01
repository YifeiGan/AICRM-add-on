/***** UTILS *****/
function firstString_(v) {
  if (!v) return "";
  if (v.stringInputs && v.stringInputs.value && v.stringInputs.value.length) {
    return String(v.stringInputs.value[0]).trim();
  }
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v) && v.length) return String(v[0]).trim();
  return "";
}
function pickInsensitive_(obj, name) {
  if (!obj) return undefined;
  if (obj[name] != null) return obj[name];
  var lower = String(name).toLowerCase();
  for (var k in obj) {
    if (!obj.hasOwnProperty(k)) continue;
    if (String(k).toLowerCase() === lower) return obj[k];
  }
  return undefined;
}
function readFieldString_(modernForm, legacyForm, name) {
  var vModern = pickInsensitive_(modernForm, name);
  var sModern = firstString_(vModern);
  if (sModern) return sModern;
  var vLegacy = pickInsensitive_(legacyForm, name);
  return firstString_(vLegacy);
}
function readFieldDate_(modernForm, legacyForm, name) {
  var vModern = pickInsensitive_(modernForm, name);
  if (vModern && vModern.dateInput && typeof vModern.dateInput.msSinceEpoch === "number") {
    return new Date(vModern.dateInput.msSinceEpoch);
  }
  var legacy = readFieldString_(modernForm, legacyForm, name);
  if (legacy) {
    var t = new Date(legacy);
    if (!isNaN(t.getTime())) return t;
  }
  return "";
}
function toYMD_(date) {
  if (!(date instanceof Date)) return "";
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
}
function notify_(text) {
  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification().setText(text))
    .build();
}
function ensureTasksSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(TASKS_SHEET);
  if (!sh) {
    sh = ss.insertSheet(TASKS_SHEET);
    sh.appendRow([
      "Created At","From","Task","Linked Goal","Refer To","Due","Email Link","Notes","Status","Goal Tab"
    ]);
  }
  return sh;
}
function escapeHtml_(s) {
  return String(s || "").replace(/[&<>"']/g, function(m) {
    return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]);
  });
}
function getCurrentQuarterTab_() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var quarter = "";
  if (month >= 1 && month <= 3) {
    quarter = "Q1";
  } else if (month >= 4 && month <= 6) {
    quarter = "Q2";
  } else if (month >= 7 && month <= 9) {
    quarter = "Q3";
  } else {
    quarter = "Q4";
  }
  return quarter + " " + year;
}
function onAuth() {}

function buildHomepage(e) {
  return buildTaskListCard_();
}
