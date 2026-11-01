import { useCallback, useEffect, useState } from 'react'
import useLenis from './hooks/useLenis'
import useActiveSection from './hooks/useActiveSection'
import { ScrollTrigger } from './lib/gsap'
import { chapters } from './lib/chapters'
import AnimatedBackground from './components/AnimatedBackground'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import ScrollIndicator from './components/ScrollIndicator'
import AudioControl from './components/AudioControl'
import Hero from './sections/Hero'
import About from './sections/About'
import Destinations from './sections/Destinations'
import History from './sections/History'
import VisionMission from './sections/VisionMission'
import Group from './sections/Group'
import Contact from './sections/Contact'
import Footer from './components/Footer'

export default function App() {
  const [phase, setPhase] = useState('loading') // loading → reveal → done
  useLenis()
  const active = useActiveSection()
  const entered = phase !== 'loading'

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (phase === 'done') {
      window.__lenis?.start()
      document.body.style.overflow = ''
      ScrollTrigger.refresh()
    } else {
      window.__lenis?.stop()
      document.body.style.overflow = 'hidden'
    }
  }, [phase])

  const onReveal = useCallback(() => setPhase('reveal'), [])
  const onDone = useCallback(() => setPhase('done'), [])

  return (
    <>
      <AnimatedBackground />
      <Navbar visible={entered} active={active} />
      <ScrollIndicator visible={entered} active={active} />
      <AudioControl enabled={entered} />

      <main className="relative z-10">
        <Hero play={entered} />
        <About />
        <Destinations />
        <History />
        <VisionMission />
        <Group />
        <Contact />
        <Footer />
      </main>

      {phase !== 'done' && <LoadingScreen onReveal={onReveal} onDone={onDone} />}
    </>
  )
}