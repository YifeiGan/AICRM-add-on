/***** GET GOALS FROM SHEET *****/
function getGoalsByHeader_() {
  var ss = SpreadsheetApp.openById(GOALS_SOURCE_SHEET_ID);
  var currentTabName = getCurrentQuarterTab_();
  var sh = ss.getSheetByName(currentTabName);
  if (!sh) return [];
  var headerRow = GOALS_HEADER_ROW || 1;
  var lastRow = sh.getLastRow();
  var lastCol = sh.getLastColumn();
  if (lastRow <= headerRow) return [];
  var colIndex = 0;
  var headers = sh.getRange(headerRow, 1, 1, lastCol).getValues()[0];
  var target = String(GOALS_COLUMN_HEADER_NAME || "").trim().toLowerCase();
  for (var c = 0; c < headers.length; c++) {
    var h = String(headers[c] || "").trim().toLowerCase();
    if (h === target) { colIndex = c + 1; break; }
  }
  if (!colIndex && GOALS_FALLBACK_COLUMN_INDEX > 0) {
    colIndex = GOALS_FALLBACK_COLUMN_INDEX;
  }
  if (!colIndex) return [];
  var numRows = lastRow - headerRow;
  var values = sh.getRange(headerRow + 1, colIndex, numRows, 1).getValues();
  var out = [];
  var seen = {};
  for (var i = 0; i < values.length; i++) {
    var g = String(values[i][0] || "").trim();
    if (!g) continue;
    var key = g.toLowerCase();
    if (seen[key]) continue;
    seen[key] = true;
    out.push(g);
  }
  out.sort(function(a, b){ return a.localeCompare(b); });
  return out;
}

/***** GET REFER TO OPTIONS FROM SHEET *****/
function getReferToOptions_() {
  var ss = SpreadsheetApp.openById(REFER_TO_SHEET_ID);
  var sh = ss.getSheetByName(REFER_TO_TAB);
  if (!sh) return [];
  var lastRow = sh.getLastRow();
  var lastCol = sh.getLastColumn();
  if (lastRow <= REFER_TO_HEADER_ROW) return [];
  var headers = sh.getRange(REFER_TO_HEADER_ROW, 1, 1, lastCol).getValues()[0].map(function(h){
    return String(h || "").trim();
  });
  function findColByCandidates(cands) {
    var targetSet = {};
    for (var i = 0; i < cands.length; i++) targetSet[cands[i].toLowerCase()] = true;
    for (var c = 0; c < headers.length; c++) {
      var h = headers[c].toLowerCase();
      if (targetSet[h]) return c + 1; // 1-based
    }
    return 0;
  }
  var cFirst = findColByCandidates(REFER_FIRST_NAME_HEADERS);
  var cLast  = findColByCandidates(REFER_LAST_NAME_HEADERS);
  var cEmail = findColByCandidates(REFER_EMAIL_HEADERS);
  var cFull  = findColByCandidates(REFER_FULL_NAME_HEADERS); // optional fallback
  if (!cEmail) return [];
  var numRows = lastRow - REFER_TO_HEADER_ROW;
  var data = sh.getRange(REFER_TO_HEADER_ROW + 1, 1, numRows, lastCol).getValues();
  var out = [];
  var seen = {};
  for (var r = 0; r < data.length; r++) {
    var row = data[r];
    var email = String(row[cEmail - 1] || "").trim();
    if (!email) continue;
    var first = cFirst ? String(row[cFirst - 1] || "").trim() : "";
    var last  = cLast  ? String(row[cLast  - 1] || "").trim() : "";
    var fullName = "";
    if (first || last) {
      fullName = (first + " " + last).trim();
    } else if (cFull) {
      fullName = String(row[cFull - 1] || "").trim();
    }
    var label = fullName ? (fullName + " <" + email + ">") : email;
    var key = email.toLowerCase();
    if (seen[key]) continue;
    seen[key] = true;
    out.push({ label: label, value: email });
  }
  out.sort(function(a, b) { return a.label.localeCompare(b.label); });
  return out;
}

