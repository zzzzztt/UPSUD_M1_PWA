class Rect {
    constructor (v, w, h) {
        this.origin = v;
        Object.defineProperty ( this, "width", { writable: false, value : w });
        Object.defineProperty ( this, "height", { writable: false, value : h });
        
    }

    move (v) {
        this.origin = this.origin.add(v);
    }
    drawRect(cxt){
    cxt.fillStyle = "#ff0000";
    cxt.fillRect(this.origin.x,this.origin.y,this.width,this.height);
  }

    mDiff (w) {
        let orig = new Vector (w.origin.x - this.origin.x - this.width,
			   w.origin.y - this.origin.y - this.height);
        return new Rect(orig, this.width + w.width, this.height + w.height);
    }

    hasOrigin () {
    
        return (this.origin.x < 0 && this.origin.x + this.width > 0)
          && (this.origin.y < 0 && this.origin.y + this.height > 0)
    }
    
    isOn(rct){ 
        let rc1=this.formRct(this)
        let rc2=rct.formRct(rct)
        let x1have=(rc1.x1<=rc2.x1)&&(rc2.x1<=rc1.x2)
        let x2have=(rc1.x1<=rc2.x2)&&(rc2.x2<=rc1.x2)
        let y1have=(rc1.y1<=rc2.y1)&&(rc2.y1<=rc1.y2)
        let y2have=(rc1.y1<=rc2.y2)&&(rc2.y2<=rc1.y2)
        return Math.abs(rc2.y2-rc1.y1)< 2 && (x1have||x2have);
    }

    isOverlap(rct){
    let rc1=this.formRct(this)
    let rc2=rct.formRct(rct)
    let x1have=(rc1.x1<=rc2.x1)&&(rc2.x1<=rc1.x2)
    let x2have=(rc1.x1<=rc2.x2)&&(rc2.x2<=rc1.x2)
    let y1have=(rc1.y1<=rc2.y1)&&(rc2.y1<=rc1.y2)
    let y2have=(rc1.y1<=rc2.y2)&&(rc2.y2<=rc1.y2)

    let xContain=rc2.x1<=rc1.x1&&rc2.x2>=rc1.x2
    let yContain=rc2.y1<=rc1.y1&&rc2.y2>=rc1.y2

    let inter=(x1have ||x2have)&&(y1have||y2have)
    let halfcontain=(x1have ||x2have)&&(!y1have&&!y2have)
    let halfcontain2=(!x1have &&!x2have)&&(y1have||y2have)
    let contain=!x1have&&!x2have&&!y1have&&!y2have
    if(this.isDesk&&rct.isWood)
    {
        //console.log(this,rc1)
       // console.log("x1:",x1have,"x2:",x2have,"y1:",y1have,"y2:",y2have)
    }
    if (inter||contain||halfcontain||halfcontain2)
    {
        if(x1have&&x2have&&y1have&&y1have)
        {
             return new Rect(new Vector(rc2.x1,rc2.y1),rc2.x2-rc2.x1,rc2.y2-rc2.y1)
        }
        if(x1have)
        {
            if(yContain)
                return new Rect(new Vector(rc2.x1,rc1.y1),rc1.x2-rc2.x1,rc1.y2-rc1.y1)
            if(y1have&&y2have)
                return new Rect(new Vector(rc2.x1,rc2.y1),rc1.x2-rc2.x1,rc2.y2-rc2.y1)
            if(y1have)
                return new Rect(new Vector(rc2.x1,rc2.y1),rc1.x2-rc1.x1,rc1.y2-rc2.y1)
            if(y2have)
                return new Rect(new Vector(rc2.x1,rc1.y1),rc1.x2-rc2.x1,rc2.y2-rc1.y1)
        }else if(x2have)
        {
            if(yContain)
                return new Rect(new Vector(rc1.x1,rc1.y1),rc2.x2-rc1.x1,rc1.y2-rc1.y1)
            if(y1have&&y2have)
                return new Rect(new Vector(rc1.x1,rc2.y1),rc2.x2-rc1.x1,rc2.y2-rc2.y1)
            if(y1have)
                return new Rect(new Vector(rc1.x1,rc2.y1),rc2.x2-rc1.x1,rc1.y2-rc2.y1)
            if(y2have)
                return new Rect(new Vector(rc1.x1,rc1.y1),rc2.x2-rc1.x1,rc2.y2-rc1.y1)

        }else
        {
            if(y1have)
            {
                return new Rect(new Vector(rc1.x1,rc2.y1),rc1.x2-rc1.x1,rc1.y2-rc2.y1)
            }
            else if(y2have)
            {
                return new Rect(new Vector(rc1.x1,rc1.y1),rc1.x2-rc1.x1,rc2.y2-rc1.y1)
            }
            else
            {
                if(xContain)
                return new Rect(new Vector(rc1.x1,rc1.y1),rc1.x2-rc1.x1,rc1.y2-rc1.y1)
            }
        }
    }
    return null
     }

    createRct(a,b,c,d){
        return new Rect(new Vector(a,b),Math.abs(a-c),Math.abs(b-d))
    }
    formRct(rct){
        return {x1:rct.origin.x,x2:rct.origin.x+rct.width,y1:rct.origin.y,y2:rct.origin.y+rct.height }
    }


    isFalldown(){
        // if(log){
        //     console.log("down log",this.origin.y,this.width)
        // }
       return this.origin.y+this.height>= 340
    }
}
