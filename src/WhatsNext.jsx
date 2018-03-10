// eslint-disable-next-line no-unused-vars
import m from 'mithril'
import moment from 'moment'

export default class WhatsNext {
  constructor (vnode) {
    this.agenda = vnode.attrs.agenda
    this.show = vnode.attrs.show || 2
  }

  oninit () {
    this.updateNextItem()
  }

  updateNextItem () {
    const now = moment()
    this.nextItems = this.agenda
      .filter((item) => now.isBefore(item.start))
      .sort((a, b) => a.start.valueOf() - b.start.valueOf())

    setTimeout(() => this.updateNextItem(), 5000)
  }

  renderItems (items) {
    return items.slice(0, this.show).map((item, index) => <li class='on-next'>{item.start.format('h:mma')} {item.title}</li>)
  }

  view (vnode) {
    const { nextItems } = this
    return <ul>{nextItems.length > 0 && this.renderItems(nextItems)}</ul>
  }
}
