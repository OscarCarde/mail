- [x] View Email: When a user clicks on an email, the user should be taken to a view where they see the content of that email.
  - [x] You’ll likely want to make a GET request to /emails/<email_id> to request the email.
  - [x] Your application should show the email’s sender, recipients, subject, timestamp, and body.
  - [x] You’ll likely want to add an additional div to inbox.html (in addition to emails-view and compose-view) for displaying the email. Be sure to update your code to hide and show the right views when navigation options are clicked.
  - [ ] See the hint in the Hints section about how to add an event listener to an HTML element that you’ve added to the DOM.
  - [ ] Once the email has been clicked on, you should mark the email as read. Recall that you can send a PUT request to /emails/<email_id> to update whether an email is read or not.