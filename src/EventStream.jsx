// eslint-disable-next-line no-unused-vars
import m from 'mithril'
import moment from 'moment'

export default class EventStream {
  oninit () {
    this.events = []
    // const codesleuth = { screen_name: 'codesleuth', name: 'Dave', profile_image_url: '' }
    // this.events = [
    //   { ts: moment().subtract(10, 'minutes'), event: 'tweet', data: { text: 'Hello world', user: codesleuth } },
    //   { ts: moment().subtract(9, 'minutes'), event: 'tweet', data: { text: 'Crazy 🐳🐳 long tweet that 🐳🐳 doesnt fit on the screen omg omg omg omg omg omg omg omg omg omg omg omg omg omg omg omg omg omg omg omg', user: codesleuth } }
    // ].sort((a, b) => b.ts.valueOf() - a.ts.valueOf())
    this.setupStream()
  }

  appendEvent (event) {
    if (this.events.length > 8) {
      this.events.pop()
    }
    this.events.unshift(event)

    m.redraw()
  }

  setupStream () {
    const ws = new window.WebSocket('ws://hack24-dashboard-server.herokuapp.com')
    // const ws = new window.WebSocket('ws://localhost:1235')
    ws.onopen = function () {
      ws.send('message to send')
    }
    ws.onmessage = (evt) => {
      const event = JSON.parse(evt.data)
      if (event.event !== 'tweet') return
      event.ts = moment(event.ts)
      this.appendEvent(event)
    }
    ws.onclose = function () {
      this.ws = undefined

      // Reconnect after 5 seconds
      setTimeout(() => this.setupStream(), 5000)
    }

    this.ws = ws
  }

  renderTweet (tweet) {
    return (
      <li class={`event ${tweet.event}`}>
        <span class='event-user'>@{tweet.data.user.screen_name}</span>&nbsp;
        <span class='event-content'>{tweet.data.text}</span>&nbsp;
        <span class='event-ts'>{tweet.ts.fromNow()}</span>
      </li>
    )
  }

  renderEvent (event) {
    switch (event.event) {
      case 'tweet': return this.renderTweet(event)
    }
  }

  view () {
    const { events } = this

    return (
      <div>
        <ul>
          { events.map((event) => this.renderEvent(event)) }
        </ul>
      </div>
    )
  }
}
