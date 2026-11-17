import { Fragment, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { profile, projects, skills, stops, type Project } from './content'

const Scene = lazy(() => import('./Scene'))

function hasWebGL() {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

function initialSimple() {
  if (new URLSearchParams(location.search).has('simple')) return true
  try {
    const saved = localStorage.getItem('view')
    if (saved) return saved === 'simple'
  } catch {}
  return !hasWebGL()
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// Year shown in the stop stamp: a project's latest year, otherwise this year.
function stopYear(id: string) {
  return projects.find((p) => p.id === id)?.period.match(/\d{4}/g)?.at(-1) ?? String(new Date().getFullYear())
}

export function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
}

// Shared class strings. Each is used in more than one place below.
const frameHover = 'hover:shadow-[inset_0_0_0_1px_var(--color-white)]'
const section =
  'relative z-1 grid min-h-svh px-(--gutter) pointer-events-none compact:grid-cols-[minmax(0,1fr)] compact:items-start simple:mx-auto simple:block simple:min-h-0 simple:max-w-[46rem] simple:py-6'
const stopSection = `${section} grid-cols-[1fr_minmax(0,36rem)] items-center pt-26 pb-[12vh] compact:pt-[56svh] compact:pb-[12svh]`
// Reading panel: black, framed with the poster's hairline.
const sheet =
  'sheet pointer-events-auto col-start-2 bg-panel p-[clamp(1.5rem,3vw,2.75rem)] text-white shadow-[inset_0_0_0_1px_var(--color-line),0_20px_40px_-12px_rgb(0_0_0/0.7)] compact:col-start-1'
const h2 = 'font-display text-[length:clamp(2rem,3.4vw,3rem)] leading-[0.95] tracking-[-0.02em] uppercase'
const h3 = 'text-lg leading-[1.3] font-semibold'
const tags = 'flex flex-wrap gap-1.5'

type Shot = Project['shots'][number]

// Full-size screenshot in a native modal <dialog>: Esc, the close button or a click outside the image closes it.
function Lightbox({ shot, onClose }: { shot: Shot | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (shot) ref.current?.showModal()
  }, [shot])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      aria-label={shot?.caption}
      className="m-auto max-h-none max-w-none bg-transparent p-0 text-white backdrop:bg-black/85 backdrop:backdrop-blur-sm"
    >
      {shot && (
        <figure className="flex flex-col items-center gap-3 p-4">
          <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} className="block h-auto max-h-[85svh] w-auto max-w-[92vw] rounded-[2px] bg-[#f2f2f2] object-contain" />
          <figcaption className="flex w-full items-center justify-between gap-4 text-sm text-muted">
            {shot.caption}
            <button type="button" className="btn" onClick={() => ref.current?.close()} autoFocus>
              Close
            </button>
          </figcaption>
        </figure>
      )}
    </dialog>
  )
}

function ProjectSheet({ p }: { p: Project }) {
  const [open, setOpen] = useState<Shot | null>(null)
  return (
    <article className={sheet}>
      <Lightbox shot={open} onClose={() => setOpen(null)} />
      {p.award && (
        <p className="mb-3 inline-block bg-accent px-[0.6rem] py-[0.3rem] text-xs font-semibold tracking-[0.12em] text-white uppercase">{p.award}</p>
      )}
      <h2 className={h2}>{p.name}</h2>
      <p className="mt-2 text-lg font-medium">{p.title}</p>
      <p className="mt-[0.6rem] text-sm text-muted">{p.period}</p>
      <p className="mt-5 text-[1.0625rem]">{p.summary}</p>

      <h3 className={`${h3} mt-9`}>Stack</h3>
      <ul className={`${tags} mt-3`} aria-label="Stack">
        {p.stack.map((s) => (
          <li key={s} className="frame px-[0.55rem] py-[0.4rem] text-[0.6875rem]">
            {s}
          </li>
        ))}
      </ul>

      <h3 className={`${h3} mt-9`}>Screens</h3>
      {/* Phone-shaped shots sit side by side (two or three a row); wide shots take the full row. */}
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(min(8.5rem,100%),1fr))] items-start gap-x-4 gap-y-6">
        {p.shots.map((s) => (
          <figure key={s.src} className={s.height > s.width ? undefined : 'col-span-full'}>
            {/* Plain click opens the lightbox; Ctrl/Cmd/middle-click still opens the file in a new tab. */}
            <a
              href={s.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open full size: ${s.caption}`}
              aria-haspopup="dialog"
              className="group block rounded-[2px]"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                e.preventDefault()
                setOpen(s)
              }}
            >
              <img
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full rounded-[2px] bg-[#f2f2f2] shadow-[0_0_0_1px_var(--color-line)] transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:shadow-[0_0_0_1px_var(--color-white)]"
              />
            </a>
            <figcaption className="mt-2 text-[0.8125rem] leading-[1.4] text-muted">{s.caption}</figcaption>
          </figure>
        ))}
      </div>

      {p.link && (
        <a className="btn mt-8" href={p.link.href} target="_blank" rel="noreferrer">
          {p.link.label}
        </a>
      )}
      {p.team && <p className="mt-5 text-sm text-muted">{p.team}</p>}
    </article>
  )
}

export default function App() {
  const [simple, setSimple] = useState(initialSimple)
  const [active, setActive] = useState(0)
  // Continuous tour position: 2.4 means 40% of the way from stop 2 to stop 3.
  const progress = useRef(0)

  useEffect(() => {
    document.documentElement.classList.toggle('simple', simple)
    try {
      localStorage.setItem('view', simple ? 'simple' : 'desk')
    } catch {}
  }, [simple])

  useEffect(() => {
    const sections = stops.map((s) => document.getElementById(s.id)!)
    const update = () => {
      const mid = scrollY + innerHeight * 0.5
      let i = sections.length - 1
      while (i > 0 && sections[i].offsetTop > mid) i--
      const el = sections[i]
      const t = Math.min(1, Math.max(0, (mid - el.offsetTop) / el.offsetHeight))
      // Hold the camera on a stop while its sheet is read; travel only near the end.
      const travel = i < sections.length - 1 ? Math.max(0, (t - 0.72) / 0.28) : 0
      progress.current = i + travel
      setActive(i)
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => {
      removeEventListener('scroll', update)
      removeEventListener('resize', update)
    }
  }, [])

  return (
    <>
      {!simple && (
        <Suspense fallback={null}>
          <Scene progress={progress} active={active} reducedMotion={reducedMotion} onSelect={goTo} />
        </Suspense>
      )}

      {/* Black shade so sheets scrolling underneath never collide with the bar. */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-2 flex items-center gap-6 bg-linear-to-b from-black/92 from-58% to-black/0 px-(--gutter) pt-[1.1rem] pb-7 *:pointer-events-auto">
        <a className="mr-auto font-bold tracking-[-0.01em] no-underline" href="#desk">
          {profile.short}
        </a>
        {/* On phones the rail becomes a scrollable strip along the bottom edge, faded where more stops wait. */}
        <nav
          aria-label="Tour stops"
          className="flex gap-1.5 simple:hidden compact:fixed compact:inset-x-0 compact:top-auto compact:bottom-0 compact:overflow-x-auto compact:bg-black compact:px-(--gutter) compact:pt-3 compact:pb-[max(0.75rem,env(safe-area-inset-bottom))] compact:shadow-[0_-1px_0_rgb(244_244_244/0.12)] compact:[mask-image:linear-gradient(to_right,#000_82%,transparent)] compact:[scrollbar-width:none]"
        >
          {stops.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`group frame ${frameHover} aria-[current=true]:bg-white aria-[current=true]:text-black aria-[current=true]:shadow-none compact:flex-none`}
              aria-current={i === active ? 'true' : undefined}
            >
              <span className="tabular-nums opacity-60 group-aria-[current=true]:text-accent group-aria-[current=true]:opacity-100">
                {String(i + 1).padStart(2, '0')}
              </span>{' '}
              {s.label}
            </a>
          ))}
        </nav>
        <div className="flex gap-1.5">
          <button type="button" className={`frame ${frameHover}`} onClick={() => setSimple(!simple)} aria-pressed={simple}>
            {simple ? 'Desk view' : 'Simple view'}
          </button>
          {profile.cv && (
            <a className={`frame ${frameHover}`} href={profile.cv} download>
              CV
            </a>
          )}
        </div>
      </header>

      {/* Poster date stack, bottom left: the stop number in red over its year and name.
          From the first project on; on the desk stop the name already heads the page. Phones give this edge to the rail. */}
      {!simple && active > 0 && (
        <p
          className="pointer-events-none fixed bottom-[clamp(1.25rem,4vh,2.5rem)] left-(--gutter) z-1 flex flex-col font-display text-[length:clamp(2.25rem,4.8vw,4.5rem)] leading-[0.9] tracking-[-0.02em] uppercase compact:hidden"
          aria-hidden="true"
        >
          <span className="text-accent tabular-nums">{String(active + 1).padStart(2, '0')}</span>
          <span>{stopYear(stops[active].id)}</span>
          <span>{stops[active].label}</span>
        </p>
      )}

      <main className="simple:pb-16">
        {/* Hero: the copy sits under the poster name, which the scene draws (its height arrives as --name-h). */}
        <section
          id="desk"
          className={`${section} grid-cols-[minmax(0,36rem)_1fr] items-start pt-[calc(76px+var(--name-h,0px)+2rem)] pb-[12vh] compact:pt-[calc(76px+var(--name-h,0px)+1.25rem)] compact:pb-[12svh] simple:pt-24 simple:pb-10`}
        >
          <div className="pointer-events-auto">
            {/* Desk view: the scene shows the name, so the heading stays for screen readers only. */}
            <h1 className="font-display text-[length:clamp(2.75rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.02em] uppercase desk:sr-only compact:text-[length:clamp(2.5rem,13vw,4rem)]">
              {profile.name}
            </h1>
            <p className="mt-5 text-lg font-semibold">
              {/* The separator ends each role and stays with it, so a line never starts with a lone dot. */}
              {profile.roles.map((r, i) => (
                <Fragment key={r}>
                  {i > 0 && ' '}
                  <span className="whitespace-nowrap">{i < profile.roles.length - 1 ? `${r} ·` : r}</span>
                </Fragment>
              ))}
            </p>
            <p className="mt-3 max-w-[44ch]">{profile.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a className="btn" href="#bantay">
                Start the tour
              </a>
              <a
                className="inline-block text-sm font-semibold tracking-[0.08em] uppercase decoration-1 hover:decoration-accent"
                href={`mailto:${profile.email}`}
              >
                Email me
              </a>
            </div>
            <p className="mt-6 text-sm text-muted compact:hidden simple:hidden" aria-hidden="true">
              Scroll, or click anything on the desk.
            </p>
          </div>
        </section>

        {projects.map((p) => (
          <section key={p.id} id={p.id} className={stopSection}>
            <ProjectSheet p={p} />
          </section>
        ))}

        <section id="skills" className={stopSection}>
          <article className={sheet}>
            <h2 className={h2}>Skills</h2>
            <div className="mt-7 flex flex-col gap-7">
              {skills.map((g) => (
                <section key={g.group} aria-labelledby={`skills-${g.group}`}>
                  <h3 id={`skills-${g.group}`} className={h3}>
                    {g.group}
                  </h3>
                  {/* Core skills are framed tags; the rest is quieter text. */}
                  <ul className={`${tags} mt-[0.6rem]`} aria-label={`${g.group}, core`}>
                    {g.core.map((i) => (
                      <li key={i} className="frame px-[0.7rem] py-2 text-[0.8125rem]">
                        {i}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-[0.7rem] text-[0.9375rem] text-muted">
                    <span className="font-semibold text-white">Also:</span> {g.more.join(', ')}
                  </p>
                </section>
              ))}
            </div>
          </article>
        </section>

        <section id="contact" className={stopSection}>
          <article className={sheet}>
            <h2 className={h2}>Let’s talk</h2>
            <p className="mt-4">
              {profile.location}. {profile.remote}.
            </p>
            <ul className="mt-6 mb-8 flex flex-col gap-[0.4rem] text-[length:clamp(1.125rem,1.6vw,1.375rem)] font-semibold">
              {[
                { href: `mailto:${profile.email}`, label: profile.email },
                { href: profile.linkedin, label: 'LinkedIn', external: true },
                { href: profile.github, label: 'GitHub', external: true },
              ].map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    className="hover:decoration-accent hover:decoration-2"
                    {...(c.external && { target: '_blank', rel: 'noreferrer' })}
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
            {profile.cv && (
              <a className="btn" href={profile.cv} download>
                Download CV (PDF)
              </a>
            )}
          </article>
        </section>
      </main>
    </>
  )
}
