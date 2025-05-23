This site uses [Formspree](https://formspree.io) to process the contact form.

Steps to activate the form:
1. Create a free account on Formspree and create a new form.
2. Copy the form ID provided by Formspree (e.g. `https://formspree.io/f/abcde123`).
3. Edit `forms/contact.php` and replace `your-form-id` with your actual ID.
4. Optionally adjust the recipient email settings inside your Formspree dashboard.

When the form is submitted, `forms/contact.php` forwards the request to your
Formspree endpoint and returns `OK` on success so the front-end script can show
the "sent" message.
