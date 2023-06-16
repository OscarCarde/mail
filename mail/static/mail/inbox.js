document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  document.querySelector("#compose-form").addEventListener("submit", event => {
    event.preventDefault();
    send()
      .then(() => {
        load_mailbox('sent');
      })
    
  });
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === 'inbox') {
    getInboxMails()
      .then(emails => {
        if (emails.length > 0) {
          emails.forEach(email => {
            let email_p = document.createElement("p");
            email_p.innerHTML = email["id"];
            document.querySelector("#emails-view").appendChild(email_p);
          });
        } else {
          let noEmails = document.createElement('h3');
          noEmails.innerHTML = "No emails";
          document.querySelector("#emails-view").appendChild(noEmails);
        }
      })
      .catch(error => {
        console.log("Something went wrong while trying to retreive the emails fom the API", error);
      });
  }
}


function send() {
  let recipients = document.querySelector('#compose-recipients').value;
  let subject = document.querySelector('#compose-subject').value;
  let body = document.querySelector('#compose-body').value;

  return fetch("/emails", {
    method:'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result)
  })
}

function getInboxMails() {
  return fetch("emails/inbox")
    .then(response => response.json())
    .then(emails =>  emails);
}