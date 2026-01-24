export const TEMPLATES = [
  {
    id: "blank",
    title: "Blank Document",
    content: "<p></p>",
  },
  {
    id: "resume",
    title: "Resume",
    content: `
      <h1>Your Name</h1>
      <p>Email | Phone | LinkedIn</p>
      <h2>Experience</h2>
      <ul>
        <li>Company Name - Role</li>
      </ul>
      <h2>Education</h2>
      <p>University Name</p>
    `,
  },
  {
    id: "letter",
    title: "Formal Letter",
    content: `
      <p>Date</p>
      <p>Recipient Name</p>
      <p>Subject: </p>
      <p>Dear Sir/Madam,</p>
      <p>Your content here...</p>
      <p>Sincerely,</p>
    `,
  },
  {
    id: "meeting",
    title: "Meeting Notes",
    content: `
      <h1>Meeting Notes</h1>
      <p><strong>Date:</strong></p>
      <p><strong>Attendees:</strong></p>
      <h2>Agenda</h2>
      <ul><li></li></ul>
      <h2>Action Items</h2>
      <ul><li></li></ul>
    `,
  },
]
