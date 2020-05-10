class Spring extends Sprite{
    constructor(v, w, h, m, cxt,buff) {
      super(v, w, h, m, cxt,buff);
        this.isSpring=true;
        this.isStatic = true;
        this.friction = 0.03;
        this.hasHp = false
        this.hp = Infinity;
      }

      loadImg(url){
        this.img.src = url+"spring.png"
        this.img.onload = this.load
        if(true) this.img.crossOrigin = ""
      }

      changeImg(){
        this.img.src = Constants.url+ "images/spring.png"
        this.img.onload = this.load
        if(true) this.img.crossOrigin = ""
      }
}