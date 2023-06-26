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
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    fetch(`emails/${mailbox}`)
      .then(response => response.json())
      .then(emails => {
        if (emails.length > 0) {
          emails.forEach(email => {
            let emailDiv = summarise_email(email);
            document.querySelector("#emails-view").appendChild(emailDiv);
            emailDiv.addEventListener('click', () => {
              read(email);
              load_email(email);
            });
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

function read(email) {
  fetch(`/emails/${email['id']}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
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

function summarise_email(email) {
  let div = document.createElement('div');
  div.className = "summary-item";

  if(email['read']) {
    div.className += " read";
  }
  
  //from
  let from = document.createElement('h5');
  from.innerHTML = email['sender'];
  //subject
  let subject = document.createElement('p');
  subject.innerHTML = email['subject'];
  //timestamp
  let timestamp = document.createElement('p');
  timestamp.innerHTML = email['timestamp'];

  div.appendChild(from);
  div.appendChild(subject);
  div.appendChild(timestamp);

  return div;
}

function load_email(email) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  let email_container = document.querySelector("#email-view");
  
  fetch(`/emails/${email['id']}`)
    .then(response => response.json())
    .then(emailObj => {
      //sender
      let sender = document.querySelector('#sender');
      sender.innerHTML = emailObj['sender'];
      //recipients
      let recipients = emailObj['recipients'];
      let recipients_list = "To: " + recipients[0];
      for(var i = 1; i<recipients.length; i++) {
        recipients_list += ", " + recipients[i];
      }
      let recipientsCont = document.querySelector('#recipients');
      recipientsCont.innerHTML = recipients_list;
      //subject
      let subject = document.querySelector('#subject');
      subject.innerHTML = emailObj['subject'];
      //body
      let body = document.querySelector('#body');
      body.innerHTML = emailObj['body'];
      //timestamp
      let timestamp = document.querySelector('#timestamp');
      timestamp.innerHTML = email['timestamp'];

      let archive_button = document.querySelector('#archive');
      if(email['archived']){
        archive_button.innerHTML = "Unarchive";
        
      } else {
        archive_button.innerHTML = "Archive";
      }

      if(email['sender'] != document.querySelector('#user').innerHTML) {
        archive_button.style.display = 'block';
        archive_button.addEventListener('click', () => {
          let archived = !email['archived']
          fetch(`emails/${email['id']}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: archived
            })
          })
          load_mailbox('inbox');
        })
      } else {
        archive_button.style.display = 'none';
      }
    })
}