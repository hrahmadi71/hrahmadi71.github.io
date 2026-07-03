// Edit this file to update the resume window content.
// Entries marked TODO are placeholders — replace with real details.

export interface ExperienceEntry {
  role: string
  company: string
  period: string
  highlights: string[]
}

export interface ResumeData {
  name: string
  title: string
  summary: string
  skills: string[]
  experience: ExperienceEntry[]
  links: { label: string; url: string }[]
}

export const resume: ResumeData = {
  name: 'Hamidreza Ahmadi',
  title: 'Software Engineer — Python & Backend',
  summary:
    'Software engineer specializing in Python and backend design and development, with a solid background in web development and building scalable, efficient systems. Currently diving into Agentic AI and LLM-based systems.',
  skills: [
    'Python',
    'Backend design & development',
    'Web development',
    'Scalable systems',
    'Agentic AI (learning)',
    'LLM-based systems (learning)',
  ],
  experience: [
    {
      role: 'Software Engineer', // TODO: real title
      company: 'TODO: company name',
      period: 'TODO: 20XX – present',
      highlights: [
        'TODO: what you built and its impact',
        'TODO: another highlight',
      ],
    },
    {
      role: 'TODO: previous role',
      company: 'TODO: previous company',
      period: 'TODO: 20XX – 20XX',
      highlights: ['TODO: highlight'],
    },
  ],
  links: [
    { label: 'GitHub', url: 'https://github.com/hrahmadi71' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/hrahmadi71' },
  ],
}
