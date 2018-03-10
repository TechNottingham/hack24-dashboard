// eslint-disable-next-line no-unused-vars
import m from 'mithril'
import moment from 'moment'

const MAX_TWEETS = 10

export default class EventStream {
  oninit () {
    this.events = []
    this.setupStream()
  }

  appendEvent (event) {
    if (this.events.length > MAX_TWEETS) {
      this.events.pop()
    }
    this.events.unshift(event)

    m.redraw()
  }

  setupStream () {
    function loadPrimus () {
      return new Promise((resolve) => {
        const params = new window.URLSearchParams(window.location.search)
        const streamServer = params.get('server') || 'hack24-dashboard-server.herokuapp.com'

        if (window.Primus) return resolve(streamServer)

        var script = document.createElement('script')
        script.setAttribute('src', `//${streamServer}/js/primus.min.js`)
        script.setAttribute('type', 'text/javascript')

        script.onreadystatechange = script.onload = () => resolve(streamServer)

        document.querySelector('head').appendChild(script)
      })
    }

    loadPrimus().then((streamServer) => {
      const primus = window.Primus.connect(`//${streamServer}`)

      primus.on('data', (event) => {
        if (event.event !== 'tweet') return
        event.ts = moment(event.data.ts)
        this.appendEvent(event)
      })

      primus.on('error', (err) => console.error('primus error', err))
      primus.on('reconnect', () => console.log('primus is reconnecting'))
      primus.on('online', () => console.log('primus is online'))
      primus.on('offline', () => console.log('primus is offline'))
      primus.on('open', () => console.log('primus is open'))
      primus.on('close', () => console.log('primus is closed'))
      primus.on('end', () => console.log('primus is ended'))
    })
  }

  renderTweet (tweet) {
    return (
      <li class={`event ${tweet.event}`}>
        <span class='event-user'>@{tweet.data.user.screen_name}</span>&nbsp;
        <span class='event-content'>{tweet.data.text}</span>&nbsp;
        <time class='event-ts' datetime={tweet.ts.toISOString()}>{tweet.ts.fromNow()}</time>
      </li>
    )
  }

  renderEvent (event) {
    switch (event.event) {
      case 'tweet': return this.renderTweet(event)
    }
  }

  sortEvents (events) {
    return events.sort((a, b) => b.ts.valueOf() - a.ts.valueOf())
  }

  view () {
    const { events } = this

    return (
      <div>
        <ul>
          { this.sortEvents(events).map((event) => this.renderEvent(event)) }
        </ul>
      </div>
    )
  }
}
