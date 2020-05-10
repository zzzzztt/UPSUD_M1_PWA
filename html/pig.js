class Pig extends Sprite {
  constructor(v, r, m, type, cxt,buff) {
    super(v, r * 2, r * 2, m, cxt,buff);
    this.r = r;
    this.type = type
    this.w = this.r * 2;
    this.h = this.r * 2;
    
    this.isPig = true;
    this.hasHp = true;
    this.isStatic = false;
    this.hp = 5;
    this.score = 30;
    this.friction = 0.01

  }

  loadImg(url){
    switch (this.type){
      case 1: {
        this.img.src = url + "pig01.png"
        this.img.onload = this.load;
        if(true) this.img.crossOrigin="";
        break
      }
      case 2: {
        this.img.src = url + "pig02.png"
        this.img.onload = this.load;
        if(true) this.img.crossOrigin="";
        break
      }
    }

  }

  changeImg() {
    let pigImg = new Image();
    if (test) pigImg.crossOrigin = "";

    if(this.hp<=0){
      pigImg.src = Constants.url + "images/remove.png";
    }else{
      pigImg.src = Constants.url + "images/pig02.png"
    }
    pigImg.onload = this.load;
    
    this.img = pigImg;
  }
}
