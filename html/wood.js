class Wood extends Sprite{
    constructor(v, w, h, m, cxt,buff) {
      super(v, w, h, m, cxt,buff);

        this.isWood=true;
        this.hasHp = true;
        this.isStatic = false;
        this.friction = 0.03;
        this.hp = 2;
        this.score = 15;
      }

      loadImg(url){
        this.img.src = url+"wood.png"
        this.img.onload = this.load
        if(true) this.img.crossOrigin = ""
      }

      changeImg() {
        let stoneImg = new Image();
        if (test) stoneImg.crossOrigin = "";
    
        stoneImg.src = Constants.url + "images/st12.png";
        stoneImg.onload = load;
        this.img = stoneImg;
      }
}