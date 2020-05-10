class Sprite extends Body {
  // constructor(v, w, h, m, img, cxt, buffCan) {
  constructor(v, w, h, m, cxt, buffCan) {
    super(v, w, h, m);

    this.isBird = false;
    this.cxt = cxt;
    // this.img = img;
    this.img = new Image();
    this.w = w;
    this.h = h;
    this.buffCan = buffCan;
    this.buff = this.buffCan.getContext("2d");
    this.buff.fillStyle = "rgba(255, 255, 255, 0)";

    this.setCanDown = true;
    this.onStatic = false;
    this.isStatic = true;
    this.canDown = true;
    this.hasCollision = false;
    this.removeCount = Infinity;
  }

  load = function () {};

  draw() {
    this.cxt.drawImage(this.img, this.origin.x, this.origin.y, this.w, this.h);
    
  }

  drawImageBC(img, x, y, width, height) {
    let buffcxt = this.buffCan.getContext("2d");
    buffcxt.clearRect(0, 0, this.buffCan.width, this.buffCan.height);

    buffcxt.drawImage(img, x, y, width, height);
  }

  changeImg(){}

  fitRect(rect) {
    let rw = rect.width;
    let rh = rect.height;
    if (rw < 1) rw = 1;
    if (rh < 1) rh = 1;
    return new Rect(rect.origin, rw, rh);
  }

  cross(w) {
    this.img.crossOrigin = "anonymous";
    w.img.crossOrigin = "anonymous";
    // let orig = new Vector (w.origin.x - this.origin.x - this.width, w.origin.y - this.origin.y - this.height);
    // let rect=new Rect(orig, this.width + w.width, this.height + w.height);
    let rect = this.isOverlap(w);
    if (rect != null) {
      rect = this.fitRect(rect);
      //rect.drawRect(this.cxt)
      if (this.img && w.img) {
        let thisData = null,
          wData = null;
        this.drawImageBC(
          this.img,
          this.origin.x,
          this.origin.y,
          this.width,
          this.height
        );
        // console.log("data",this.buff.getImageData(parseInt(rect.origin.x), parseInt(rect.origin.y), parseInt(rect.w), parseInt(rect.h)).data)
        // thisData = this.buff.getImageData( parseFloat(rect.origin.x), parseFloat(rect.origin.y), parseFloat(rect.w), parseFloat(rect.h)).data;
        let thisimg = this.buff.getImageData(
          rect.origin.x,
          rect.origin.y,
          rect.width,
          rect.height
        );
        thisData = thisimg.data;
        this.drawImageBC(w.img, w.origin.x, w.origin.y, w.width, w.height);
        // wData = this.buff.getImageData(rect.origin.x,rect.origin.y,rect.w,rect.h).data;
        let wimg = this.buff.getImageData(
          rect.origin.x,
          rect.origin.y,
          rect.width,
          rect.height
        );
        wData = wimg.data;
        for (var i = 0; i < thisData.length; i += 3) {
          if (thisData[i] > 0 && wData[i] > 0) {
            return true;
          }
        }
      }
    }
    return 0;
  }

  setCollision(b) {
    this.hasCollision = b;
  }

  /* Dectection de collision entre l'objet courrant et l'objet b.

  Renvoie null si pas de collision, sinon renvoie les nouveau vecteur vitesses
  pour l'objet courant et pour b
  */

  collision(b) {
    if (this.cross(b)) {
      // s'il y des collision, diminuer le hp de cible
      if(this.isPig && this.type ==2 && b.isDesk){
        this.on = b
        if(this.velocity.norm() < Constants.limit){
          this.velocity = new Vector(0.3,0)
        }
        return false
      }else if (this.isDesk && b.isPig && b.type ==2){
        b.on =this
        return false
      }

      if (b.hasHp) {
        if (this.isStatic || this.velocity == Vector.ZERO) {
          if (b.velocity.norm() > 0.2) {
            b.hp = 0;
            // if (this.hasHp) this.hp = 0;
          } else if (b.velocity.norm() >= Constants.limit) {
            b.hp--;
            b.changeImg();
            if (this.hasHp) {
              this.hp--;
              this.changeImg();
            }
          }
        } else {
          if (this.velocity.norm() > 0.2) {
            b.hp = 0;
            // if (this.hasHp) this.hp = 0;
          } else if (this.velocity.norm() >= Constants.limit) {
            b.hp--;
            b.changeImg();
            if (this.hasHp) {
              this.hp--;
              this.changeImg();
            }
          }
        }
      }

      if (this.hasHp) {
        if (b.isStatic || b.velocity == Vector.ZERO) {
          if (this.velocity.norm() > 0.2) {
            this.hp = 0;
            // if (b.hasHp) b.hp = 0;
          } else if (this.velocity.norm() >= Constants.limit) {
            this.hp--;
            this.changeImg();
            if (b.hasHp) {
              b.hp--;
              b.changeImg()
            }
          }
        } else {
          if (b.velocity.norm() > 0.2) {
            this.hp = 0;
            // if (b.hasHp) b.hp = 0;
          } else if (b.velocity.norm() >= Constants.limit) {
            this.hp--;
            this.changeImg();
            if (b.hasHp) {
              b.hp--;
              b.changeImg()
            }
          }
        }
      }

      /** si l'oiseau touche le porc, le hp de porc sera zero */
      if (this.isBird && b.isPig) {
        // console.log("进入测试")
        b.hp = 0;
      }

      if (b.isBird && this.isPig) {
        // console.log("")
        this.hp = 0;
      }

      if (b.hasHp && b.hp <= 0 && b.removeCount > 30) {
        // console.log("b.hp", b, b.hp);
        b.changeImg();
        b.removeCount = 30;
      }

      if (this.hasHp && this.hp <= 0 && this.removeCount > 30) {
        // console.log("this.hp", this, this.hp);
        this.changeImg();
        this.removeCount = 30;
      }

      let mdiff = this.mDiff(b);
      let vectors = [
        new Vector(0, mdiff.origin.y),
        new Vector(0, mdiff.origin.y + mdiff.height),
        new Vector(mdiff.origin.x, 0),
        new Vector(mdiff.origin.x + mdiff.width, 0),
      ];

      let n = vectors[0];

      for (let i = 1; i < vectors.length; i++) {
        if (vectors[i].norm() < n.norm()) n = vectors[i];
      }

      let norm_v = this.velocity.norm();
      let norm_vb = b.velocity.norm();
      let kv = norm_v / (norm_v + norm_vb);
      let kvb = norm_vb / (norm_v + norm_vb);

      if (norm_v == 0 && norm_vb == 0) {
        if (this.invMass == 0 && b.invMass == 0) return null;
        else {
          if (this.mass <= b.mass) kv = 1;
          else kvb = 1;
        }
      }
      this.move(n.mult(kv));
      b.move(n.mult(-kvb));

      n = n.normalize();

      // (2) On calcule l'impulsion j :
      let v = this.velocity.sub(b.velocity);
      let e = Constants.elasticity; // pour les étudiants, juste faire let e = 1;

      let j = (-(1 + e) * v.dot(n)) / (this.invMass + b.invMass);

      // (3) On calcule les nouvelle vitesse:
      let new_v = this.velocity.add(n.mult(j * this.invMass));
      let new_bv = b.velocity.sub(n.mult(j * b.invMass));

      b.setCollision(true);
      this.setCollision(true);
      this.velocity = new_v;
      b.velocity = new_bv;

      let v1 = this.velocity;
      let v2 = b.velocity;
      //
      if (((b.isStatic || b.on != null ) && b.isOn(this) || b.isFalldown())) {
        // console.log("测试this 在上", this, this.hp, b, b.hp);
        if (!b.isPig && !b.isBird) {
          this.on = b;
          // console.log("this on b", this, b);
          if (this.velocity.norm() < Constants.limit) {
            this.velocity = Vector.ZERO;
          } else {
            this.velocity = v1.sub(new Vector(0.2 * v1.x, 0));
          }
        } else {
          // if(this.isBird || this.isPig) console.log("测试this", this, this.velocity, b, b.velocity);
          if (this.velocity.norm() > 0.3) {
            console.log(">0.3")
            this.velocity = v1.sub(new Vector(0.2 * v1.x, 0.2 * v1.y));
            b.velocity = v2.add(new Vector(0.2 * v1.x, 0.2 * v1.y));
          }else if(this.velocity.norm() >= Constants.limit){
            this.velocity = v1.sub(new Vector(1.5 * v1.x, 1.5 * v1.y));
            b.velocity = v2.add(new Vector(0.5 * v1.x, 0.5 * v1.y));
          }else if(this.velocity.norm() < Constants.limit ){
            // && b.velocity.norm() < Constants.limit
            this.velocity = Vector.ZERO;
            this.on = b;
          }
        }
      } else if (((this.isStatic || this.on != null ) && this.isOn(b)) || this.isFalldown()) {
        // console.log("测试b 在上", b, b.hp, this, this.hp);
        if (!this.isBird && !this.isPig) {
          b.on = this;
          // console.log("b on this", b, this);
          if (b.velocity < Constants.limit) {
            b.velocity = Vector.ZERO;
          } else {
            b.velocity = v2.sub(new Vector(0.2 * v2.x, 0));
          }
        } else {
          // if(b.isBird || b.isPig) console.log("测试b 在上", b, b.hp, this, this.hp);

          if (b.velocity.norm() > 0.3) {
            b.velocity = v2.sub(new Vector(0.2 * v2.x, 0.2 * v2.y));
            this.velocity = v1.sub(new Vector(0.2 * v2.x, 0.2 * v2.y));
          } else if(b.velocity.norm() >= Constants.limit){
            b.velocity = v2.sub(new Vector(1.5 * v2.x, 1.5 * v2.y));
            this.velocity = v1.sub(new Vector(0.5 * v2.x, 0.5 * v2.y));
          }else if( b.velocity.norm() < Constants.limit){
            // this.velocity.norm() < Constants.limit &&
            b.velocity = Vector.ZERO;
            b.on = this;
          }
          console.log("on this, b is pig/bird ", this,this.velocity,b, b.velocity)
        }
      }


      if(this.isSpring){
        b.canDown = true;
        console.log("鸟速度before",b.velocity)
        // b.velocity = b.force.add(new Vector(3 * Constants.addforce * Constants.elasticity, 3 * Constants.addforce * Constants.elasticity))
        b.velocity = b.velocity.add(new Vector( 5 * v2.x,-10* v2.y))
        console.log("鸟速度",b.velocity)
        return true
      }else if(b.isSpring){
        this.canDown = true;
        console.log("鸟速度before",this.velocity)
        // this.force = b.force.add(new Vector(3 * Constants.addforce * Constants.elasticity, 3 * Constants.addforce * Constants.elasticity))
        this.velocity = this.velocity.add(new Vector( 5 * v1.x,-10* v1.y))
        console.log("鸟速度",this.velocity)
        return true
      }

      if (this.isDesk) {
        if(b.origin.x+b.w < this.origin.x){
          b.canDown = true
          b.velocity = new Vector(0, b.velocity.y)
        }else{
          b.canDown = false;
          if (b.velocity.norm() < Constants.limit) {
            b.velocity = Vector.ZERO
            // new_bv = Vector.ZERO;
          }
        }
        this.velocity = Vector.ZERO;
        this.canDown = false
        // console.log("this 桌子碰撞 b：",this, b, b.canDown);
      } else if (b.isDesk) {
        if(this.origin.x+b.w < b.origin.x){
          b.canDown = true
          b.velocity = new Vector(0, b.velocity.y)
        }else{
          this.canDown = false;
          if (this.velocity.norm() < Constants.limit) {
            this.velocity = Vector.ZERO
            // new_v = Vector.ZERO;
          }
          b.velocity = Vector.ZERO
        }
        this.velocity = Vector.ZERO;
        this.canDown = false
        // console.log("b 桌子碰撞  this：",b,  this, this.canDown);
      }
return true
      // return { v_this: new_v, v_b: new_bv };
    }
    return false;
  }
}
