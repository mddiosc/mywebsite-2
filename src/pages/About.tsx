import { AboutContact, AboutContent, AboutHero, TechnologyGrid } from '../components'
import { useAboutData } from '../hooks/useAboutData'

const About = () => {
  const { skills, stats, technologies, biographyParagraphs } = useAboutData()

  return (
    <>
      <AboutHero biographyParagraphs={biographyParagraphs} />
      <AboutContent biographyParagraphs={biographyParagraphs} stats={stats} />
      <TechnologyGrid technologies={technologies} skills={skills} />
      <AboutContact />
    </>
  )
}

export default About
