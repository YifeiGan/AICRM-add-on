/***** DROPDOWN HELPERS *****/
function goalDropdownFromList_(list) {
  var selection = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Linked Goal")
    .setFieldName("linkedGoal");
  if (!list || !list.length) {
    selection.addItem("<No goals found>", "<No goals found>", true);
    return selection;
  }
  for (var i = 0; i < list.length; i++) {
    selection.addItem(list[i], list[i], i === 0);
  }
  return selection;
}

function referToDropdown_(options) {
  var selection = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Refer to")
    .setFieldName("referTo");
  if (!options || !options.length) {
    selection.addItem("<No people listed>", "<none>", true);
    return selection;
  }
  for (var i = 0; i < options.length; i++) {
    selection.addItem(options[i].label, options[i].value, i === 0);
  }
  return selection;
}
