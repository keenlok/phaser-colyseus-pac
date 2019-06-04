import Phaser from 'phaser'
// import bodymovin from 'lottie-web'

export default class Boot extends Phaser.Scene {
  constructor () {
    super({key: 'boot'})
    console.log('Boot')
  }

  preload () {
    // this.load.html('loading','./static/animation/egg-wobble/demo.html')
    // let dataKey = 'assets.layers.ks.r.k'
    // let definedornot = this.load.pack('loading','./static/animation/logo/data.json', dataKey)
    // console.log(definedornot)

    this.load.json('loading', './static/animation/logo/data.json')
    // this.load.animation({'loading','./static/animation/logo/data.json'})
  }

  create () {
    // console.log(this.scene)
    console.log(this.cache)
    // console.log(this.cache.text)
    // let cache = this.cache.text

    // let hasData = cache.has('loading')    // console.log(this.scene.cache) undefined
    // this.cache = this.cache.html

    // let data = this.cache.json.get('loading');
    // this.scene.add(data)

    // this.cache.json.get('loading')
    this.scene.start('preload')
  }
}
