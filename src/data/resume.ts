// Edit this file to update the resume window content.

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
  title: 'Technical Lead — Backend & AI Solutions | Python, Django, FastAPI, AI Agents',
  summary:
    'Software engineer and technical lead with over 10 years of experience designing, building, deploying, and maintaining large-scale software systems. Core expertise in backend engineering with Python, Django, FastAPI, PostgreSQL, Celery, Docker, Kubernetes, and CI/CD. Currently leading the development of AI-powered CRM solutions at Nobitex — flow-based chatbots, retrieval-augmented generation systems, and AI agents for ticket automation — with a research background in automatic software refactoring using reinforcement learning, published in Information and Software Technology.',
  skills: [
    'Python',
    'Django & Django REST Framework',
    'FastAPI',
    'PostgreSQL',
    'Celery',
    'Docker & Kubernetes',
    'CI/CD pipelines',
    'AI Agents & RAG systems',
    'Backend design & development',
    'Software architecture (Domain-Driven Design)',
  ],
  experience: [
    {
      role: 'Technical Lead',
      company: 'Nobitex',
      period: 'April 2024 – present',
      highlights: [
        'Lead the design, development, and deployment of AI-powered CRM solutions for support and operations teams.',
        'Built and delivered three major solutions: a flow-based chatbot, a retrieval-augmented generation chatbot, and AI agents for ticket automation.',
        'Automated handling of user-submitted tickets, reducing manual workload and improving response efficiency.',
        'Oversee maintenance, support, and enhancement of CRM-based products, including the company’s ticketing system.',
        'Mentor team members and support best practices in backend development, AI integration, and software delivery.',
      ],
    },
    {
      role: 'Software Engineer',
      company: 'Nobitex',
      period: 'May 2021 – March 2024',
      highlights: [
        'Developed and maintained CRM, support, operations, and reporting systems.',
        'Built backend services and internal tools using Python, Django, Django REST Framework, PostgreSQL, and Celery.',
        'Improved reliability, maintainability, and usability of systems used by support and operations teams.',
      ],
    },
    {
      role: 'Django Instructor (Bootcamp)',
      company: 'Quera',
      period: 'June 2025 – August 2025',
      highlights: [
        'Taught Django and backend development concepts to bootcamp students.',
        'Mentored learners on web development, authentication, Django admin, class-based views, and practical backend patterns.',
      ],
    },
    {
      role: 'Software Engineer',
      company: 'Arman Rayan Sharif',
      period: 'September 2019 – April 2021',
      highlights: [
        'Worked on Aipaa.ir, a platform providing pre-trained AI services, as a full-stack developer using Django and Django REST Framework.',
        'Collaborated on front-end development of the platform built with Angular.js.',
        'Served as Quality Assurance Specialist from December 2020 to April 2021.',
      ],
    },
    {
      role: 'Business Analyst',
      company: 'Daneshgar Technology Co. Ltd.',
      period: 'October 2018 – March 2019',
      highlights: [
        'Analyzed requirements and defined user stories and workflows for a banking collateral-management subsystem.',
        'Created UML and BPMN diagrams and collaborated with the development team to ensure the design was properly implemented.',
      ],
    },
  ],
  links: [
    { label: 'GitHub', url: 'https://github.com/hrahmadi71' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/hrahmadi71' },
    { label: 'Stack Overflow', url: 'https://stackoverflow.com/users/8342406/hamidreza' },
  ],
}
