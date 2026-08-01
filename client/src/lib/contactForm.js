// ───────────────────────────────────────────────────────────────────────
// CONTACT FORM — sends submissions straight to your inbox, no backend
// ───────────────────────────────────────────────────────────────────────
// This site is fully static, so the Contact Us form submits directly to
// Web3Forms (https://web3forms.com), a service that receives the form data
// and forwards it to you as an email. There's no server or database
// involved on your side.
//
// ONE-TIME SETUP (about 2 minutes) — required before the form will work:
//   1. Go to https://web3forms.com
//   2. Enter the email address that should receive enquiries
//      (e.g. official@curatdconcepts.com) and click "Create Access Key".
//   3. Web3Forms emails you an Access Key (a long string of letters/numbers).
//   4. In the `client` folder, create a file named `.env` (copy
//      `.env.example` and rename it) and paste your key into it:
//        REACT_APP_WEB3FORMS_ACCESS_KEY=paste-your-key-here
//   5. Rebuild the site (`npm run build`) and re-upload to Hostinger.
//
// That's it — no dashboard login is needed afterwards, submissions just
// arrive by email. You can log in to web3forms.com any time to see a
// history of submissions or change the destination email.
// ───────────────────────────────────────────────────────────────────────

const WEB3FORMS_ACCESS_KEY = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY || '';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export async function submitContactForm({ name, email, phone, subject, message }) {
  if (!WEB3FORMS_ACCESS_KEY) {
    // eslint-disable-next-line no-console
    console.error(
      'REACT_APP_WEB3FORMS_ACCESS_KEY is not set — the contact form has ' +
      'nowhere to send submissions. See the setup steps at the top of ' +
      'src/lib/contactForm.js.'
    );
    const error = new Error('The contact form is not fully set up yet.');
    error.status = 0;
    throw error;
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `Curatd Concepts website enquiry: ${subject}`,
      from_name: 'Curatd Concepts Website',
      name,
      email,
      phone,
      inquiry_type: subject,
      message,
    }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // no JSON body — fall through to the generic error below
  }

  if (!response.ok || !data || data.success !== true) {
    const messageText = (data && data.message) || `Request failed with status ${response.status}`;
    const error = new Error(messageText);
    error.status = response.status;
    throw error;
  }

  return data;
}
