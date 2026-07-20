# GTX2 Website

Static marketing website for GTX2.

## Contact Form Google Forms Setup

The styled contact form in `contact.html` submits to Google Forms through a hidden iframe. This keeps the GTX2 page design while using Google Forms/Sheets to collect responses.

### Current Wiring

The form action points to the Google Forms `formResponse` endpoint:

```html
https://docs.google.com/forms/d/e/1FAIpQLSd-yO4NemsRsR572fodGnkWiYESyadb-KmdpUynTJB7yFTWLQ/formResponse
```

Current field mapping:

| Contact page field | Google Forms entry name |
| --- | --- |
| Name | `entry.297813031` |
| Company | `entry.636948711` |
| Role | `entry.1903065490` |
| Email | `entry.1425566481` |
| Message | `entry.507265127` |

### Link A New Google Form

1. Create a Google Form with matching questions: Name, Company, Role, Email, and Message.
2. In Google Forms, open the three-dot menu and choose **Get pre-filled link**.
3. Fill each field with unique test values, such as `NAME_TEST`, `COMPANY_TEST`, `ROLE_TEST`, `EMAIL_TEST@example.com`, and `MESSAGE_TEST`.
4. Copy the generated pre-filled URL.
5. In that URL, copy the form ID from `/forms/d/e/<FORM_ID>/viewform`.
6. In `contact.html`, set the form `action` to:

```html
https://docs.google.com/forms/d/e/<FORM_ID>/formResponse
```

7. In `contact.html`, replace each input or textarea `name` with the matching `entry.xxxxx` value from the pre-filled URL.
8. Keep the form `target` pointed at the hidden iframe:

```html
target="google-form-submit-frame"
```

9. Make sure this iframe remains near the form:

```html
<iframe class="google-form-frame" name="google-form-submit-frame" title="Google Form submission" hidden></iframe>
```

### Google Form Settings

- Make sure the Google Form is accepting responses.
- Turn off sign-in/domain restrictions if public visitors should be able to submit.
- Keep Company and Role optional in Google Forms if they are optional on the website.
- For Email, use a short-answer question and add Google Forms response validation for email format.
- Link the form to Google Sheets from the **Responses** tab to view each submission as one row.

### Limitations

Google Forms does not expose a readable success response to this static page. The site can validate required fields and email format before submitting, but it cannot reliably confirm that Google accepted the response.
