class Body extends Rect {
  constructor(v, w, h, m) {
    super(v, w, h);
    /*les propriétés*/
    this.mass = m || 0; /*(la masse du corps)*/
    this.invMass = 1 / this.mass; /**/
    this.velocity = Vector.ZERO; /*(la vitesse du corps)*/
    this.force = Vector.ZERO; /*(la somme des forces exercées sur le corps)*/
    
    // this.isStatic = true;
    // this.canDown=true;
    // this.hasCollision = false;
    // this.removeCount = Infinity;
  }

  // setCollision(b) {
  //   this.hasCollision = b;
  // }
}
