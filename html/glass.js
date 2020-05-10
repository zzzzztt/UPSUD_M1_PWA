class Glass extends Sprite {
  constructor(v, w, h, m, cxt, buff) {
    super(v, w, h, m, cxt, buff);

    this.isGlass = true;
    this.hasHp = true;
    this.isStatic = false;
    this.friction = 0.01;
    this.hp = 2;
    this.score = 15;
  }

  loadImg(url){
    this.img.src = url+"glass.png"
    this.img.onload = this.load
    if(true) this.img.crossOrigin = ""
  }

  changeImg() {
    let glassImg = new Image();
    if (test) glassImg.crossOrigin = "";

    glassImg.src = Constants.url + "images/glass2.png";
    glassImg.onload = load;
    this.img = glassImg;
  }
}
