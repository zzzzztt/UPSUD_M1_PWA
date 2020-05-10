class Bird extends Sprite {
  // constructor(v, r, m, type, img, cxt,buff) {
  // super(v, r * 2, r * 2, m, img, cxt,buff);
  constructor(v, r, m, type, cxt, buff) {
    super(v, r * 2, r * 2, m, cxt, buff);
    this.r = r;
    this.w = this.r * 2;
    this.h = this.r * 2;
    // this.img = new Image();
    // = img;
    this.cxt = cxt;
    this.isBird = true;
    this.isReady = false;
    this.isFly = false;
    this.hasHp = false;

    this.isStatic = false;
    this.friction = 0.01;
    this.type = type;
    this.score = 0;
  }

  loadImg(url) {
    switch (this.type) {
      case 1: {
        this.img.src = url + "bird.png";
        this.img.onload = this.load;
        if (true) this.img.crossOrigin = "";
        break;
      }
      case 2: {
        this.img.src = url + "bird2.png";
        this.img.onload = this.load;
        if (true) this.img.crossOrigin = "";
        break;
      }
      case 3: {
        this.img.src = url + "bird3.png";
        this.img.onload = this.load;
        if (true) this.img.crossOrigin = "";
        break;
      }
    }
  }
  draw() {
    if (this.isReady) {
      if (!this.isFly) {
        // console.log("cxt",this.cxt)
        this.cxt.beginPath();
        this.cxt.moveTo(140, 210);
        this.cxt.lineTo(this.origin.x + this.r, this.origin.y + this.r);
        this.cxt.lineTo(180, 210);
        this.cxt.lineWidth = 4;
        this.cxt.stroke();
      }
    }
    // if(this.isFly) console.log(this.on)
    // console.log("bird.v",this.velocity)
    this.cxt.drawImage(this.img, this.origin.x, this.origin.y, this.w, this.h);
  }
  setPos(v) {
    this.origin = v;
  }

  setMass() {
    switch (this.type) {
      case 1:
        this.mass = Constants.mass1;
        break;
      case 2:
        this.mass = Constants.mass2;
        break;
      case 3:
        this.mass = Constants.mass1;
        break;
    }

    this.invMass = 1 / this.mass;
  }
}
