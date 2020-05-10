class Desk extends Sprite{
    constructor(v, w, h, m, cxt,buff) {
      super(v, w, h, m, cxt,buff);
        this.isDesk=true;
        this.isStatic = true;
        this.friction = 0.03;
        this.hasHp = false
        this.hp = Infinity;
      }

      loadImg(url){
        this.img.src = url+"desk.png"
        this.img.onload = this.load
        if(true) this.img.crossOrigin = ""
      }

      changeImg(){
        this.img.src = url + "/images/desk.png"
        this.img.onload = this.load
        if(true) this.img.crossOrigin = ""
      }
}