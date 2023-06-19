- [x] Mailbox: When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.
  - [x] You’ll likely want to make a GET request to /emails/<mailbox> to request the emails for a particular mailbox.
  - [x] When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.
  - [x] When a mailbox is visited, the name of the mailbox should appear at the top of the page (this part is done for you).
  - [x] Each email should then be rendered in its own box (e.g. as a <div> with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.
  - [ ] If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.