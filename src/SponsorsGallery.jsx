// eslint-disable-next-line no-unused-vars
import m from 'mithril'

export default class SponsorsGallery {
  constructor (vnode) {
    this.sponsors = vnode.attrs.sponsors
    this.interval = vnode.attrs.interval
  }

  oninit () {
    this.currentSponsorIndex = -1
    this.rotateSponsor()
  }

  rotateSponsor () {
    const nextIndex = this.currentSponsorIndex + 1
    this.currentSponsorIndex = nextIndex === this.sponsors.length ? 0 : nextIndex
    this.currentSponsor = this.sponsors[this.currentSponsorIndex]

    setTimeout(() => this.hideSponsor(), this.interval)

    m.redraw()
  }

  hideSponsor () {
    this.currentSponsor = undefined

    setTimeout(() => this.rotateSponsor(), 300)

    m.redraw()
  }

  view (vnode) {
    const { currentSponsor } = this
    return (
      <div class={`sponsors ${currentSponsor ? currentSponsor.classname : ''}`}>
        <span>sponsors</span>
      </div>
    )
  }
}
