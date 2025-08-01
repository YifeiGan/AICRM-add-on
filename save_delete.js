/***** DELETE TASK *****/
function deleteTask_(e) {
  var idx = Number(e.parameters.idx);
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(TASKS_SHEET);
  var data = sh.getDataRange().getValues();
  var rowToDelete = data.length - idx;
  if (rowToDelete > 1) sh.deleteRow(rowToDelete);
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(buildTaskListCard_()))
    .setNotification(CardService.newNotification().setText("Task deleted"))
    .build();
}

/***** SAVE TASK *****/
function saveTask_(e) {
  var form = (e && e.commonEventObject && e.commonEventObject.formInputs) || {};
  var title = form.taskTitle && form.taskTitle.stringInputs.value[0];
  var linkedGoal = form.linkedGoal && form.linkedGoal.stringInputs.value[0];
  var referTo = form.referTo && form.referTo.stringInputs.value[0];
  var notes = form.notes && form.notes.stringInputs.value[0];
  var dueObj = form.due && form.due.dateInput && form.due.dateInput.msSinceEpoch ? new Date(form.due.dateInput.msSinceEpoch) : null;
  var due = dueObj ? (dueObj.getFullYear() + "-" + String(dueObj.getMonth()+1).padStart(2,'0') + "-" + String(dueObj.getDate()).padStart(2,'0')) : "";
  var sh = ensureTasksSheet_();
  sh.appendRow([new Date(), "", title, linkedGoal, referTo, due, "", notes, "To-Do", ""]);
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(buildTaskListCard_()))
    .setNotification(CardService.newNotification().setText("Task saved"))
    .build();
}
