function buildHomepageCard_() {
  return CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("AICRM"))
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newTextParagraph()
          .setText("Open an email to create a goal-linked task in the sidebar."))
    )
    .build();
}
