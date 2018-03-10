// eslint-disable-next-line no-unused-vars
import m from 'mithril'
import moment from 'moment'

import Timer from './Timer'
import Clock from './Clock'
import WhatsOn from './WhatsOn'
import WhatsNext from './WhatsNext'
import SponsorsGallery from './SponsorsGallery'
import EventStream from './EventStream'

const agenda = [
  { start: moment('2018-03-07T20:00:00'), end: moment('2018-03-10T09:00:00'), title: 'Countdown to registration' },
  { start: moment('2018-03-10T09:00:00'), end: moment('2018-03-10T09:30:00'), title: 'Registration' },
  { start: moment('2018-03-10T09:30:00'), end: moment('2018-03-10T11:00:00'), title: 'Breakfast' },
  { start: moment('2018-03-10T11:00:00'), end: moment('2018-03-10T12:00:00'), title: 'Welcome presentation' },
  { start: moment('2018-03-10T12:00:00'), end: moment('2018-03-10T13:30:00'), title: 'Hack!' },
  { start: moment('2018-03-10T13:30:00'), end: moment('2018-03-10T15:30:00'), title: 'Lunch' },
  { start: moment('2018-03-10T15:30:00'), end: moment('2018-03-10T19:30:00'), title: 'Starling Bank Workshop' },
  { start: moment('2018-03-10T19:30:00'), end: moment('2018-03-10T21:30:00'), title: 'Evening meal & bar drinks' },
  { start: moment('2018-03-10T21:30:00'), end: moment('2018-03-11T00:00:00'), title: 'Entertainment' },
  { start: moment('2018-03-11T09:00:00'), end: moment('2018-03-11T09:30:00'), title: 'Morning briefing' },
  { start: moment('2018-03-11T09:30:00'), end: moment('2018-03-11T12:00:00'), title: 'Breakfast!' },
  { start: moment('2018-03-11T12:00:00'), end: moment('2018-03-11T14:00:00'), title: 'Stop hacking!' },
  { start: moment('2018-03-11T12:01:00'), end: moment('2018-03-11T12:05:00'), title: 'Call your Mum' },
  { start: moment('2018-03-11T12:05:00'), end: moment('2018-03-11T14:00:00'), title: 'Submit videos' },
  { start: moment('2018-03-11T14:00:00'), end: moment('2018-03-11T15:00:00'), title: 'Lunch' },
  { start: moment('2018-03-11T15:00:00'), end: moment('2018-03-11T16:30:00'), title: 'Relax, judging' },
  { start: moment('2018-03-11T16:30:00'), end: moment('2018-03-11T18:00:00'), title: 'Awards ceremony' },
  { start: moment('2018-03-11T18:00:00'), end: moment('2018-03-11T23:00:00'), title: 'Afterpartay!' }
]

const sponsors = [
  { title: 'MHR', classname: 'sponsor_mhr' },
  { title: 'Esendex', classname: 'sponsor_esendex' },
  { title: 'Experian', classname: 'sponsor_experian' },
  { title: 'Thomson Reuters', classname: 'sponsor_tr' },
  { title: 'eLife', classname: 'sponsor_elife' },
  { title: 'Microsoft', classname: 'sponsor_microsoft' },
  { title: 'UNiDAYS', classname: 'sponsor_unidays' },
  { title: 'Capital One', classname: 'sponsor_capitalone' },
  { title: 'Starling', classname: 'sponsor_starling' },
  { title: 'Cordius', classname: 'sponsor_cordius' },
  { title: 'Stkrs', classname: 'sponsor_stkrs' },
  { title: 'GitHub', classname: 'sponsor_github' },
  { title: 'Heart Internet', classname: 'sponsor_hi' },
  { title: 'Liberis', classname: 'sponsor_liberis' }
]

class Home {
  constructor () {
    this.currentTeamsCount = null
    this.mounted = false
  }

  oninit () {
    this.mounted = true
    this.updateApiStats()
  }

  onremove () {
    this.mounted = false
  }

  updateApiStats () {
    window.fetch('//api.hack24.co.uk/teams')
      .then((data) => data.json())
      .then((json) => {
        this.currentTeamsCount = json.data.length

        if (this.mounted) {
          setTimeout(() => this.updateApiStats(), 5000)
        }
      })
  }

  view () {
    const { currentTeamsCount } = this
    return (
      <div class='wrapper'>
        <div class='title'><span>logo</span></div>
        <div class='timer'><Timer start={new Date(2018, 2, 10, 12, 0, 0)} end={new Date(2018, 2, 11, 12, 0, 0)} /></div>
        <div class='clock'><Clock /></div>
        <div class='teams'><span>{currentTeamsCount === null ? '??' : currentTeamsCount}</span> teams</div>
        <div class='whatson'>
          <div><WhatsOn agenda={agenda} /></div>
          <div><em><WhatsNext agenda={agenda} /></em></div>
        </div>
        <SponsorsGallery sponsors={sponsors} interval={8000} />
        <div class='eventstream'><EventStream /></div>
      </div>
    )
  }
}

export default Home
