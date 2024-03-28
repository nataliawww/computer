import Project from './Project'
import '../../App.scss';
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap/all'

export default function Text(props) {
  const ref = useRef()
  const [currentProject, setCurrentProject] = useState();

  const onProjectClick = (project) => {
    setCurrentProject(project)
    props.onSelect(project);
  };

  useEffect(() => {
    if (props.isVisible) {
      gsap.to(ref.current, {opacity: 1, duration: 2, ease: 'power3.inOut', delay: 1});
    }
  }, [props.isVisible, ref])

  return (
    <div className="wrapper">
      <div className="header" onClick={() => onProjectClick('me')}>
          <h1 className="title">Natalia Wojtkowska</h1>
          <p className="subtitle">Creative developer</p>
        </div>
      <div className="text-container">
        <div className="text">
          <div className="project-description" ref={ref}>
          <Project projectId={currentProject} />
        </div>
          <div className="column">
            <h2>Selected projects</h2>
            <ul className="clickable projects">
              <li><a onClick={() => onProjectClick('interland')}>Google Interland</a></li>
              <li><a onClick={() => onProjectClick('xmas')}>Merry Xmas</a></li>
              <li><a onClick={() => onProjectClick('loomis')}>Loomis Pay</a></li>
              <li><a onClick={() => onProjectClick('jffd')}>Just Food For Dogs</a></li>
              <li><a onClick={() => onProjectClick('neuro')}>Neuroforbundet</a></li>
              <li><a onClick={() => onProjectClick('brooklyn')}>Brooklyn Vignettes</a></li>
              <li><a onClick={() => onProjectClick('adidas')}>Adidas EQT</a></li>
              <li><a onClick={() => onProjectClick('balloon')}>WebVR balloon ride</a></li>
              <li><a onClick={() => onProjectClick('flamingo')}>WebVR sunset</a></li>
            </ul>
          </div>
          <div className="column bottom-aligned">
            <h2>Clients</h2>
            <ul>
              <li>Google, Adidas, Lego, Oreo, Danske Bank, Interflora & more</li>
            </ul>
          </div>
          <div className="column">
            <h2>Awards</h2>
            <div className="row">
              <ul>
                <li>Awwwards Site of the Day</li>
                <li>Awwwards Developer Award</li>
                <li>Awwwards Honorable Mention</li>
                <li>European Design Awards - Bronze</li>
                <li>FWA Top 100</li>
                <li>FWA Site of the Day</li>
                <li>Guldagg</li>
              </ul>
            </div>
          </div>
          <div className="column">
            <h2>Contact</h2>
            <ul>
              <li><a href="mailto:nataliawtk@gmail.com" target="_blank">Email</a> <span className="mail">💌</span></li>
              <li><a href="https://www.linkedin.com/in/natalia-wojtkowska/" target="_blank">LinkedIn</a></li>
              <li><a href="https://twitter.com/titol92" target="_blank">Twitter</a></li>
              <li><a href="https://www.instagram.com/titolbanks/" target="_blank">Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}