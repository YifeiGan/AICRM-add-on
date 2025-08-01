/***** MAIN TASK LIST CARD *****/
function buildTaskListCard_() {
  var section = CardService.newCardSection();
  var tasks = getRecentTasks_();

  if (tasks.length === 0) {
    section.addWidget(CardService.newTextParagraph().setText("No tasks found."));
  } else {
    for (var i = 0; i < tasks.length; i++) {
      var task = tasks[i];
      var detailAction = CardService.newAction()
        .setFunctionName("showTaskDetail_")
        .setParameters({ idx: String(i) });
      var deleteAction = CardService.newAction()
        .setFunctionName("deleteTask_")
        .setParameters({ idx: String(i) });

      // Correct: use ButtonSet, not setButton twice, and never use newIconButton
      var buttonSet = CardService.newButtonSet()
        .addButton(CardService.newTextButton().setText("Details").setOnClickAction(detailAction))
        .addButton(CardService.newTextButton().setText("Delete").setOnClickAction(deleteAction));

      section.addWidget(
        CardService.newDecoratedText()
          .setText("<b>" + escapeHtml_(task.title) + "</b>")
          .setBottomLabel(
            (task.due ? "Due: " + task.due + " | " : "") +
            (task.linkedGoal ? "Goal: " + task.linkedGoal + " | " : "") +
            (task.referTo ? "Refer: " + task.referTo : "")
          )
          .setOnClickAction(detailAction)  // 点击整行跳Details
      );
      section.addWidget(
        CardService.newTextButton()
          .setText("Delete")
          .setOnClickAction(deleteAction)
      );
    }
  }
  // Add new task button
  section.addWidget(CardService.newTextButton()
    .setText("Add Task")
    .setOnClickAction(CardService.newAction().setFunctionName("showCreateTaskCard_")));

  // Refresh button
  var refreshAction = CardService.newAction().setFunctionName("refreshTaskList_");
  section.addWidget(CardService.newTextButton().setText("Refresh").setOnClickAction(refreshAction));

  return CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("AICRM Tasks"))
    .addSection(section)
    .build();
}

/***** TASK CREATION CARD *****/
function showCreateTaskCard_(e) {
  var section = CardService.newCardSection();
  section.addWidget(CardService.newTextInput().setFieldName("taskTitle").setTitle("Task Title"));
  section.addWidget(CardService.newTextInput().setFieldName("linkedGoal").setTitle("Linked Goal"));
  section.addWidget(CardService.newTextInput().setFieldName("referTo").setTitle("Refer to"));
  section.addWidget(CardService.newDatePicker().setTitle("Due Date").setFieldName("due"));
  section.addWidget(CardService.newTextInput().setFieldName("notes").setTitle("Notes").setMultiline(true));
  section.addWidget(CardService.newTextButton().setText("Save").setOnClickAction(
    CardService.newAction().setFunctionName("saveTask_")));
  section.addWidget(CardService.newTextButton().setText("Back").setOnClickAction(
    CardService.newAction().setFunctionName("refreshTaskList_")));
  var nav = CardService.newNavigation().pushCard(
    CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle("Create Task")).addSection(section).build()
  );
  return CardService.newActionResponseBuilder().setNavigation(nav).build();
}

/***** TASK DETAIL CARD *****/
function showTaskDetail_(e) {
  var idx = Number(e.parameters.idx);
  var tasks = getRecentTasks_();
  if (isNaN(idx) || idx < 0 || idx >= tasks.length) return notify_("Task not found.");
  var task = tasks[idx];
  var section = CardService.newCardSection();
  section.addWidget(CardService.newTextParagraph().setText("<b>" + task.title + "</b>"));
  section.addWidget(CardService.newTextParagraph().setText("Due: " + (task.due || "-")));
  section.addWidget(CardService.newTextParagraph().setText("Goal: " + (task.linkedGoal || "-")));
  section.addWidget(CardService.newTextParagraph().setText("Refer to: " + (task.referTo || "-")));
  section.addWidget(CardService.newTextParagraph().setText("Notes: " + (task.notes || "-")));
  // 返回主界面按钮
  section.addWidget(CardService.newTextButton().setText("Back").setOnClickAction(
    CardService.newAction().setFunctionName("refreshTaskList_")));
  var nav = CardService.newNavigation().pushCard(
    CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle("Task Details")).addSection(section).build()
  );
  return CardService.newActionResponseBuilder().setNavigation(nav).build();
}

/***** REFRESH LIST *****/
function refreshTaskList_(e) {
  return CardService.newNavigation().updateCard(buildTaskListCard_());
}

/***** GET RECENT TASKS *****/
function getRecentTasks_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(TASKS_SHEET);
  if (!sh) return [];
  var data = sh.getDataRange().getValues();
  if (data.length <= 1) return [];
  var out = [];
  for (var i = data.length - 1; i > 0 && out.length < 10; i--) {
    var row = data[i];
    out.push({
      createdAt: row[0],
      from: row[1],
      title: row[2],
      linkedGoal: row[3],
      referTo: row[4],
      due: row[5],
      notes: row[7],
      status: row[8]
    });
  }
  return out;
}