class Stone extends Sprite {
  constructor(v, w, h, m, cxt,buff) {
    super(v, w, h, m, cxt,buff);

    this.isStone = true;
    this.hasHp = true;
    this.isStatic = false;
    this.friction = 0.0002;
    this.hp = 3;
    this.score = 15;
  }

  loadImg(url){
    this.img.src = url+"stone.png"
    this.img.onload = this.load
    if(true) this.img.crossOrigin = ""
  }

  changeImg() {
  }

}
