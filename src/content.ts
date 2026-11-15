// Single source of truth. Facts come from the CV (Rastafari_Sarzona_Resume.pdf) and, for BANTAY, the thesis defense deck.
// Phone number is deliberately absent: it lives only in public/cv.pdf.

export const profile = {
  name: 'Rastafari Khaliel Sarzona',
  short: 'R. K. Sarzona',
  roles: ['AI Specialist', 'Web Development', 'Automation'],
  location: 'Angeles City, Pampanga, Philippines',
  remote: 'Open to remote work',
  summary:
    'Welcome to my portfolio. I build AI systems, web applications and automations that save people time. Take a look around, and get in touch if you would like to work together.',
  email: 'rastafarisarzona2@gmail.com',
  linkedin: 'https://linkedin.com/in/rastafari-sarzona',
  github: 'https://github.com/lerchenlied-010',
  // Set to '/cv.pdf' once the file is in public/. Empty hides every CV link so nothing 404s.
  cv: '',
}

export type Project = {
  id: string
  name: string
  title: string
  period: string
  summary: string
  stack: string[]
  shots: { src: string; alt: string; caption: string; width: number; height: number }[]
  team?: string
  link?: { href: string; label: string }
}

// BANTAY facts come from the thesis defense deck (BANTAY Presentation.pptx, October 2026) and the CV.
// Screenshots are the app screens from that deck, copied unedited into public/projects/bantay/.
export const projects: Project[] = [
  {
    id: 'bantay',
    name: 'BANTAY',
    title: 'Turning handwritten barangay blotters into searchable records',
    period: 'Thesis · Angeles University Foundation · 2025–2026',
    summary:
      'Barangay Anunas wrote every incident report by hand in logbooks, so finding an old case took up to half an hour and monthly reports were counted by hand. BANTAY reads those pages, sorts each incident, and puts everything on one dashboard.',
    stack: ['Python', 'Flask', 'SQLite', 'Ollama', 'Gemma 4', 'SEA-LION', 'Google Cloud Vision', 'Gemini', 'Chart.js', 'Leaflet.js'],
    shots: [
      { src: '/projects/bantay/dashboard.png', width: 1878, height: 916, alt: 'BANTAY incident dashboard with record counts, review status and Katarungang Pambarangay referability totals', caption: 'The dashboard: every case at a glance.' },
      { src: '/projects/bantay/scan.png', width: 1228, height: 409, alt: 'New Blotter Record page with an upload field for a scanned logbook page', caption: 'Scanning a handwritten page.' },
      { src: '/projects/bantay/records.png', width: 1684, height: 863, alt: 'All Records table with filters for category, purok, status and date', caption: 'All records, searchable and filterable.' },
      { src: '/projects/bantay/hotspot-map.png', width: 1674, height: 526, alt: 'Hotspot map of incidents around Angeles City', caption: 'Where incidents are reported.' },
    ],
    team: 'With Jonnard Enzo Santos, Art Elvin Miranda and De Andre Antonio Williams · Adviser Dr. Joey S. Aviles · Built for Barangay Anunas, Angeles City',
  },
  {
    id: 'tanaw',
    name: 'TANAW',
    title: 'Explaining, in pesos, why a Meralco bill changed',
    period: 'Hackathon · Meralco IDOL 2026 · Team Stiletto',
    summary:
      'A Meralco bill gives you a total, not a reason. TANAW reads the PDF statement on the phone, checks the bill against its own arithmetic, and splits the change from last month into pesos: Meralco’s published rates, the weather, and how much power you used. If the numbers do not add up, it helps you send a dispute that staff can triage.',
    stack: ['JavaScript', 'PWA', 'pdf.js', 'Node.js', 'Capacitor', 'Ollama', 'Qwen 2.5', 'PaddleOCR', 'Open-Meteo API'],
    shots: [
      { src: '/projects/tanaw/explain.png', width: 780, height: 1688, alt: 'TANAW result screen: your bill rose ₱475, split into using more electricity (+₱391) and Meralco’s rates (+₱84)', caption: 'Why the bill changed, in pesos.' },
      { src: '/projects/tanaw/check.png', width: 780, height: 1688, alt: 'TANAW check screen with two of four self-checks failed after a charge was changed by ₱500', caption: 'The bill is checked against its own numbers.' },
      { src: '/projects/tanaw/dispute.png', width: 780, height: 1688, alt: 'TANAW lists three strong flags and a ready-made message to Meralco', caption: 'A planted error becomes a ready-made dispute.' },
      { src: '/projects/tanaw/dashboard.png', width: 1440, height: 900, alt: 'TANAW staff dashboard listing one strong-evidence dispute case', caption: 'The staff triage dashboard (a concept, not connected to Meralco).' },
    ],
    team: 'Meralco IDOL Hackathon 2026, Challenge 2: Know Your Bill, Manage Your Usage · Screenshots use a SYNTHETIC sample bill priced at real Meralco rates',
    link: { href: 'https://github.com/msmeralco/TeamStiletto', label: 'View the code on GitHub' },
  },
  {
    id: 'laredo',
    name: '24/7 Laredo',
    title: 'A local news website that updates itself',
    period: 'Freelance · Remote, for a client in Laredo, Texas · 2026',
    summary:
      '24/7 Laredo is a free, independent news outlet for Laredo and Webb County. I helped build its 14-page website on GoHighLevel, so the newsroom can publish a story once and see it appear across the whole site.',
    stack: ['GoHighLevel', 'HTML', 'CSS', 'JavaScript', 'RSS', 'Open-Meteo API', 'Google Analytics 4', 'Google AdSense', 'schema.org SEO', 'Python', 'Node.js'],
    shots: [
      { src: '/projects/laredo/home.png', width: 1440, height: 900, alt: '24/7 Laredo home page with a breaking news bar, top story, weather widget and sponsored placements', caption: 'The home page: top story, live weather and breaking-news bar.' },
      { src: '/projects/laredo/news.png', width: 1440, height: 900, alt: '24/7 Laredo Current News page with category tabs and a top story', caption: 'News, filtered by category.' },
      { src: '/projects/laredo/weather.png', width: 1440, height: 900, alt: '24/7 Laredo weather page with current conditions and a seven-day forecast', caption: 'Live Laredo weather and forecast.' },
      { src: '/projects/laredo/home-mobile.png', width: 780, height: 1688, alt: '24/7 Laredo home page on a phone', caption: 'The same site on a phone.' },
    ],
    link: { href: 'https://247laredo.com/', label: 'Visit 247laredo.com' },
  },
  {
    id: 'brewview',
    name: 'BrewView',
    title: 'A coffee review site that reads the mood of every review',
    period: 'Web project · 2025',
    summary:
      'BrewView is a coffee-shop website where customers rate drinks and write reviews. The site reads each review, tells whether it is positive, neutral or negative, and gives staff a dashboard to manage the menu and see how customers feel.',
    stack: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap 5', 'Chart.js', 'HTML', 'CSS'],
    shots: [
      { src: '/projects/brewview/home.png', width: 1440, height: 900, alt: 'BrewView home page with the headline Elevate Your Coffee Experience and a mountain view with a coffee cup', caption: 'The home page.' },
      { src: '/projects/brewview/home-mobile.png', width: 780, height: 1688, alt: 'BrewView home page on a phone', caption: 'The same page on a phone.' },
    ],
  },
]

// `core` is the day-to-day toolkit, shown as highlighted chips. `more` is everything else, shown as plain text.
export const skills = [
  {
    group: 'Frontend',
    core: ['React', 'React Native', 'Angular', 'HTML', 'CSS', 'Sass/SCSS', 'JavaScript', 'TypeScript'],
    more: ['Chart.js', 'Leaflet.js', 'GoHighLevel', 'Google Analytics 4', 'SEO and schema.org markup'],
  },
  {
    group: 'Backend',
    core: ['Node.js', 'Express.js', 'Python', 'Java', 'SQL', 'MongoDB', 'Firebase', 'Supabase'],
    more: ['Flask', 'PHP', 'MySQL', 'SQLite', 'REST APIs', 'Jinja2', 'C++', 'Git and GitHub', 'pytest', 'Jupyter and Google Colab'],
  },
  {
    group: 'AI and data',
    core: ['LLM evaluation', 'OCR', 'Ollama', 'Gemma 4', 'SEA-LION', 'Gemini (Vertex AI)'],
    more: ['Google Cloud Vision', 'Tesseract', 'PaddleOCR', 'pandas', 'NumPy', 'Data labeling and quality review'],
  },
  {
    group: 'Design',
    core: ['Figma'],
    more: ['Responsive page layout', 'Technical documentation and circuit diagrams'],
  },
]

// Tour order. `id` doubles as the section anchor and the desk object that opens it.
export const stops = [
  { id: 'desk', label: 'Desk' },
  { id: 'bantay', label: 'BANTAY' },
  { id: 'tanaw', label: 'TANAW' },
  { id: 'laredo', label: '24/7 Laredo' },
  { id: 'brewview', label: 'BrewView' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const

export type StopId = (typeof stops)[number]['id']
