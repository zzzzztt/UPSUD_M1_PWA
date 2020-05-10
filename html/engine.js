class Engine {
  constructor() {
    this.bodies = [];
    this.score = 0;

    this.nbZero = 0;
    this.start = false;
    this.finish = false;
    this.nbPig = 0;
  }

  addBody(b) {
    this.bodies.push(b);
    this.nbBegin++;
  }

  removeBody(b) {
    let i = this.bodies.findIndex(function (e) {
      return e == b;
    });
    if (i >= 0) this.bodies.splice(i, 1);
  }

  /* appelée avec un certain intervalle de temps dt (le temps qui s’est écoulé depuis la dernière mise à jour */
  update(dt) {
    // decider la fin de niveau current
    // s'il n'existe plus proc, on a gagne
    this.nbPig = 0;
      for (let i = 0; i < this.bodies.length; i++) {
        let body = this.bodies[i];
        if(body.isPig) this.nbPig++
      }
      this.finish = (this.nbPig>0)?false:true;
    
    for (let i = 0; i < this.bodies.length; i++) {
      let body = this.bodies[i];
      let isStillOn = false;
      for (let j = 0; j < this.bodies.length; j++) {
        let otherBody = this.bodies[j];
        if (body.on == otherBody && otherBody.isOn(body)) {
          // if (body.isBird || body.isFly) {
          //   console.log("find_on");
          // }
          isStillOn = true;
        }
      }
      if (isStillOn == false && !(body.isFalldown())) {
        body.on = null;
        if (body.isBird || body.isFly) {
          // console.log("XX not_find_on", body, body.velocity,"触地？", body.isFalldown());
        }
      }
    }

    /** si tous les objets sont statique, finir ce niveau*/ 
    if (this.start && !this.finish) {
      console.log("engine 开始测试",  this, this.bodies);
      // let body;
      this.nbZero = 0;
      for_block: {
        for (let i = 0; i < this.bodies.length; i++) {
          let body = this.bodies[i];
          if(body.hasHp){
            // console.log("hashp",body,body.removeCount, body.velocity)
            if(body.type ==2 && body.removeCount > 30){
              console.log("+:type2",body)
              this.nbZero++
            }else if(body.removeCount > 30 && body.velocity.norm() < 0.02 && (body.isFalldown() || (body.on&&body.on.removeCount>30)) ){
              console.log("+hashp",body)
              this.nbZero++
            }
          }else if(body.isBird){
            if(body.on || body.isFalldown() ){
              console.log("bird", body, body.on, body.isFalldown())
              this.nbZero++
            }
          }else if(body.isStatic){
            console.log("static",body)
            this.nbZero++
          }

        }
      }//for_block

      // console.log("zero数量", this.nbZero, "body长度", this.bodies.length);
      if (this.nbZero == this.bodies.length) {
        this.finish = true;
        console.log("结束", this.finish);
      } else {
        this.finish = false;
      }
    } 

    for (let i = 0; i < this.bodies.length; i++) {
      let body = this.bodies[i];
      //supprimer le body
      if (body.removeCount <= 30) {
        body.removeCount--;
      }
      if (body.removeCount <= 0) {
        console.log("remove & hp", body, body.hp);
        this.score += body.score;
        this.removeBody(body);
        console.log(engine);
      }
      if(body.origin.x > 800){
        this.removeBody(body);
        console.log("remove out canvas",body)
      }
      /** mis a jour la collision */
      for (let j = i + 1; j < this.bodies.length; j++) {
        let otherBody = this.bodies[j];

        let res = body.collision(otherBody);
     
      }


      /* ajouter le gravity sauf l'oiseau pas encore voler */
      if (Number.isFinite(body.mass)) {
        body.force = body.force.add(Constants.gravity.mult(body.mass));
      }

      /** controler le deuxieme proc */
      if(body.isPig && body.type == 2){
        // console.log("deuxieme proc",body,body.velocity,body.force,body.origin.x)
          /** intialier la vitesse */
        if(body.velocity.norm() < 0.02){
          body.velocity = new Vector(0.3,0)
          console.log("intialier la vitesse",body.velocity.x)
        }
        /** trajectoire particulier */
        if(body.origin.x > 515 && body.origin.x < 575){
          if(body.velocity.x>0){
            // console.log("vers droit")
            body.force = new Vector(0.0003 * body.mass,0)
            // console.log("nouveau",body.force, body.velocity)
          } else{
            // console.log("vers gauche")
            body.force = new Vector(-0.0003 * body.mass,0)
            // console.log("nouveau",body.force, body.velocity)
          }
        }else if(body.origin.x <= 515){
          // console.log("touche gauche")
          body.velocity = new Vector(0.03, 0)
          body.force = new Vector(0.0003 * body.mass,0)
          // console.log("noveau",body.force, body.velocity)
        }else if(body.origin.x >= 575){
          // console.log("touche droit")
          body.velocity = new Vector(-0.03,0)
          body.force = new Vector(-0.0003 * body.mass,0)
          // console.log("nouveau",body.force, body.velocity)
        }
      }

      if (!body.canDown || body.on) {
        // console.log("稳定",body)
        if (body.velocity.norm() < 0.02) {
          body.velocity = Vector.ZERO;
        } else {
          body.velocity = new Vector(
            0.8 * body.velocity.x,
            -0.8 * body.velocity.y
          );
          // if(body.isBird)console.log("测试1")
        }
      }

      if (body.isGlass && body.on) {
        if (body.velocity.norm() < 0.02) body.velocity = Vector.ZERO;
      }
      // On calcule la nouvelle accéleration :
      if (body.on == null || body.isFalldown() || (body.isPig&&body.typ ==2)) {
        let a = body.force.mult(body.invMass); //F = ma
        let delta_v = a.mult(dt);
        body.velocity = body.velocity.add(delta_v);
      } else {
        body.velocity = new Vector(body.velocity.x, 0);
        // if(body.isBird)console.log("测试")
      }
      body.force = Vector.ZERO;
      // console.log(body.force)}

      // Quand les body touchent la terre,diminuer leur vitesse
      if (body.isFalldown() && !body.isStatic) {
        if (!body.isBird || body.isFly) {
          // console.log("判断触地", body.velocity);
          if (body.velocity.norm() < 0.02) {
            // console.log("停止",body.velocity);
            // body.on = "ground";
            body.velocity = Vector.ZERO;
          } else {
            body.velocity = new Vector(
              0.8 * body.velocity.x,
              -0.8 * body.velocity.y
            );
          }
        }
      }else{
        // if(body.isStatic){
        //   console.log("触地的static", body,body.velocity)
        // }
      }

      body.move(body.velocity.mult(dt));
    }
  }
}
