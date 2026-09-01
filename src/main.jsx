import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { exploration, profile, skillGroups } from './data/portfolio'
import './styles.css'

const sections = ['Home', 'About', 'Skills', 'Projects', 'Education', 'Resume', 'Contact']
const Icon = ({ name, size = 18 }) => {
  const paths = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />, external: <><path d="M14 5h5v5" /><path d="M19 5 10 14" /><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>,
    github: <><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.18-3.37-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.61.07-.6.07-.6 1 .07 1.54 1.02 1.54 1.02.9 1.51 2.35 1.08 2.92.83.09-.64.35-1.08.64-1.33-2.22-.25-4.56-1.1-4.56-4.95 0-1.1.4-2 1.03-2.7-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.03A9.5 9.5 0 0 1 12 6.45c.85 0 1.7.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.41.1 2.66.64.7 1.03 1.6 1.03 2.7 0 3.86-2.34 4.7-4.57 4.95.36.31.68.9.68 1.82v2.7c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></>,
    linkedin: <><path d="M6.5 9.5V18M6.5 6.3v.1M10.5 18v-4.7c0-1.7 1-2.5 2.3-2.5s2.2.8 2.2 2.5V18M10.5 11v-1.5M15 11v-1.5" /><rect x="3" y="3" width="18" height="18" rx="2" /></>,
    sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.2 8.2 0 1 0 20 14.2Z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />, close: <path d="m6 6 12 12M18 6 6 18" />,
    down: <path d="m7 10 5 5 5-5" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'))
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('theme', theme) }, [theme])
  return [theme, setTheme]
}

function Reveal({ children, className = '' }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .65, ease: [0.16, 1, .3, 1] }}>{children}</motion.div>
}

function AuroraMark() { return <div className="mark" aria-hidden="true"><span></span><span></span><span></span></div> }

function App() {
  const [theme, setTheme] = useTheme(); const [open, setOpen] = useState(false); const [active, setActive] = useState('Home'); const reduced = useReducedMotion()
  useEffect(() => {
    const observers = sections.map(name => { const el = document.getElementById(name.toLowerCase()); if (!el) return null; const ob = new IntersectionObserver(([e]) => e.isIntersecting && setActive(name), { rootMargin: '-35% 0px -55%' }); ob.observe(el); return ob }); return () => observers.forEach(o => o?.disconnect())
  }, [])
  const go = (name) => { setOpen(false); document.getElementById(name.toLowerCase())?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }) }
  const parent = { hidden: {}, show: { transition: { staggerChildren: .11, delayChildren: .12 } } }; const child = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: .7, ease: [0.16, 1, .3, 1] } } }
  return <>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="noise" />
    <header className="nav"><button className="brand" onClick={() => go('Home')} aria-label="Go to home"><AuroraMark /><span>RONAK<span className="muted">.DEV</span></span></button><nav className="desktop-nav" aria-label="Main navigation">{sections.map(s => <button key={s} className={active === s ? 'active' : ''} onClick={() => go(s)}>{s}</button>)}</nav><div className="nav-actions"><button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} /></button><button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}><Icon name={open ? 'close' : 'menu'} /></button></div></header>
    <AnimatePresence>{open && <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{sections.map(s => <button key={s} onClick={() => go(s)}>{s}</button>)}</motion.nav>}</AnimatePresence>
    <main>
      <section id="home" className="hero section"><div className="hero-copy"><motion.div variants={parent} initial="hidden" animate="show"><motion.p variants={child} className="eyebrow"><i></i> Available for learning &amp; collaboration</motion.p><motion.h1 variants={child}>Building what’s <em>next.</em></motion.h1><motion.p variants={child} className="hero-intro">I’m <strong>Ronak Prajapati</strong>, a student Python developer exploring practical software, AI, and the systems behind modern technology.</motion.p><motion.div variants={child} className="cta-row"><button className="button primary" onClick={() => go('Projects')}>View projects <Icon name="arrow" /></button><button className="button secondary" onClick={() => go('Contact')}>Contact me</button></motion.div></motion.div><button className="scroll-cue" onClick={() => go('About')}>Scroll to discover <Icon name="down" size={15} /></button></div>
        <motion.div className="hero-art" initial={reduced ? false : { opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: .28 }} aria-label="Abstract Python and digital systems illustration"><div className="art-orbit orbit-a"></div><div className="art-orbit orbit-b"></div><div className="node n1"></div><div className="node n2"></div><div className="node n3"></div><div className="code-card card-a"><span>01</span><code>import future</code></div><div className="code-card card-b"><span>02</span><code>build() → learn()</code></div><div className="core"><div className="core-ring"></div><div className="core-symbol">&lt;/&gt;</div></div><div className="art-caption">SYSTEM / 001<br/><b>IN DEVELOPMENT</b></div></motion.div></section>
      <section id="about" className="section about"><Reveal><p className="eyebrow"><i></i> About</p><div className="split-heading"><h2>Curiosity is my<br/><em>starting point.</em></h2><p>I’m a student developer with a strong interest in using Python to turn ideas into useful, thoughtful software. I’m continuously expanding into AI, machine learning, backend development, and the modern tools shaping what comes next.</p></div></Reveal><div className="principles">{[['01','Make it useful','Practical software should solve a real need.'],['02','Keep learning','Every project is an opportunity to explore deeper.'],['03','Build with care','Good details make technology feel human.']].map(x => <Reveal key={x[0]}><article className="principle"><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article></Reveal>)}</div></section>
      <section id="skills" className="section skills"><Reveal><p className="eyebrow"><i></i> Technical foundation</p><h2>A growing toolkit<br/>for <em>making things.</em></h2></Reveal><div className="skill-grid">{skillGroups.map((group, i) => <Reveal key={group.label}><article className="skill-group"><div><span className="group-number">0{i + 1}</span><h3>{group.label}</h3></div><ul>{group.skills.map(skill => <li key={skill}><span className="skill-dot"></span>{skill}</li>)}</ul></article></Reveal>)}</div></section>
      <section id="projects" className="section projects"><Reveal><div className="section-top"><div><p className="eyebrow"><i></i> Selected work</p><h2>Projects with<br/><em>purpose.</em></h2></div><span className="project-count">01 / 01</span></div></Reveal><Reveal><article className="project-card"><div className="project-visual"><div className="field-lines"></div><div className="project-mark"><span>S</span></div><div className="sprout"><i></i><i></i><b></b></div><p>SHASYA / SETU</p></div><div className="project-content"><p className="project-kicker">Featured project · In development</p><h3>ShasyaSetu</h3><p>A developing project shaped around a meaningful problem space. ShasyaSetu is an opportunity to apply thoughtful software design, practical technology, and a learning-first mindset to something that matters.</p><div className="tags"><span>Python</span><span>Software development</span><span>Prototype</span></div><button className="text-link" onClick={() => alert('Project details will be added as ShasyaSetu develops.')}>Project details <Icon name="arrow" size={17} /></button></div></article></Reveal></section>
      <section id="education" className="section education"><Reveal><p className="eyebrow"><i></i> Education</p><h2>Learning in<br/><em>motion.</em></h2></Reveal><Reveal><div className="timeline"><div className="timeline-line"></div><article><span className="timeline-dot"></span><p>Current</p><h3>NEW LJIET</h3><span>Student</span></article><article><span className="timeline-dot"></span><p>University</p><h3>Gujarat Technological University</h3><span>GTU</span></article></div></Reveal></section>
      <section className="section exploring"><Reveal><div className="explore-copy"><p className="eyebrow"><i></i> In progress</p><h2>Currently<br/><em>exploring.</em></h2><p>The edges of what I know are where I like to spend my time.</p></div></Reveal><div className="explore-list">{exploration.map((item, i) => <Reveal key={item}><article><span>0{i + 1}</span><h3>{item}</h3><div className="explore-arrow"><Icon name="arrow" /></div></article></Reveal>)}</div></section>
      <section id="resume" className="section resume"><Reveal><div className="resume-box"><div><p className="eyebrow"><i></i> Resume</p><h2>A concise view<br/>of my <em>journey.</em></h2><p>My resume will be available here soon. The links are ready for the final PDF.</p></div><div className="resume-actions"><a href={profile.resumeUrl} className="button primary" target="_blank" rel="noreferrer">View resume <Icon name="external" /></a><a href={profile.resumeUrl} className="button secondary" download>Download resume <Icon name="down" /></a><small>Add your file at <code>public/resume.pdf</code></small></div></div></Reveal></section>
      <section id="contact" className="section contact"><Reveal><p className="eyebrow"><i></i> Get in touch</p><h2>Let’s make<br/><em>something useful.</em></h2><a className="email" href={`mailto:${profile.email}`}>{profile.email}<Icon name="arrow" /></a><div className="socials"><a href={profile.github} target="_blank" rel="noreferrer"><Icon name="github" /> GitHub <Icon name="external" size={14} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" /> LinkedIn <Icon name="external" size={14} /></a></div></Reveal></section>
    </main><footer><button className="brand" onClick={() => go('Home')}><AuroraMark /><span>RONAK<span className="muted">.DEV</span></span></button><p>© {new Date().getFullYear()} Ronak Prajapati · Python Developer</p><button onClick={() => go('Home')} className="back-top">Back to top <Icon name="arrow" size={16} /></button></footer>
  </>
}
createRoot(document.getElementById('root')).render(<App />)
