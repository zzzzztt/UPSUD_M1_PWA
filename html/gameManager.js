let canBg = document.getElementById("myCanvasBg");
let cxtBg = canBg.getContext("2d");
let canM = document.getElementById("myCanvasMove");
let cxtM = canM.getContext("2d");
// let buff = document.getElementById("myCanvasMove");s
let canvasList = document.getElementById("cds");
let buff = document.createElement("canvas");
buff.width = 800; //
buff.height = 400;

let interval;
let renderer;
let engine = new Engine();
let bdList = [];
let nb_bd = 0;
console.log("debuts", nb_bd);
let bd;

let myajax;
let nb_level;
let total_level = 2;
let score = 0;
let score_win;

let test = true;
load = function () {};
// let url = "http://localhost:8081/html/";
let url = Constants.url
let wImg = new Image();
if (test) wImg.crossOrigin = "";
wImg.src = url + "images/welcome.png";
wImg.onload = load;
// wImg.crossOrigin = "";

let startImg = new Image();
if (test) startImg.crossOrigin = "";
startImg.src = url + "images/start.png";
startImg.onload = load;
// startImg.crossOrigin = "";

let restImg = new Image();
if (test) restImg.crossOrigin = "";
restImg.src = url + "images/restart.png";
restImg.onload = load;
// restImg.crossOrigin = "";

let nextImg = new Image();
if (test) nextImg.crossOrigin = "";
nextImg.src = url + "images/next.png";
nextImg.onload = load;
// nextImg.crossOrigin = "";

let winImg = new Image();
if (test) winImg.crossOrigin = "";
winImg.src = url + "images/bg_win.png";
winImg.onload = load;

let loseImg = new Image();
if (test) loseImg.crossOrigin = "";
loseImg.src = url + "images/bg_lose.png";
loseImg.onload = load;

//load image
function loadBgImage(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.addEventListener("error", () => {
      reject("error loading " + url);
    });
    img.addEventListener("load", () => {
      resolve(img);
    });

    img.src = url;
  });
}

//afficher le scence
async function bgShow(cxt) {
  let bgImg = await loadBgImage("images/bg.png");
  cxt.drawImage(bgImg, 0, 0, 800, 400);
  // setTimeout(alert("loaded bg"),500);

  let ssImg1 = await loadBgImage("images/slingshot1.png");
  let ssImg2 = await loadBgImage("images/slingshot2.png");
  cxt.drawImage(ssImg1, 130, 190, 37, 94);
  cxt.drawImage(ssImg2, 155, 190, 40, 150);
}

// function getCoordInDocumentExample(coords) {
//   // console.log("coords",coords);
//   // var coords = document.getElementById("myCanvasMove");
//   coords.addEventListener("click", function (e) {
//     var pointer = getCoordInDocument(e);
//     var coord = document.getElementById("coord");
//     // console.log("coord", coord);
//     coord.innerHTML = "X,Y=(" + pointer.x + ", " + pointer.y + ")";
//   });
// }

// function getCoordInDocument(e) {
//   e = e || window.event;
//   var x =
//     e.pageX ||
//     e.clientX +
//       (document.documentElement.scrollLeft || document.body.scrollLeft);
//   var y =
//     e.pageY ||
//     e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
//   return { x: x, y: y };
// }

/* verifier le souris est dans la circle*/
/* cx, cy: centre de la cicle *
 ** cr : rayon de la cicle
 ** mx, my: position du souris
 ** cxt : context
 */
function inCircle(cx, cy, cr, mx, my, cxt) {
  cxt.beginPath();
  cxt.arc(cx, cy, cr, 0, 2 * Math.PI);
  return cxt.isPointInPath(mx, my);
}

function inRect(cx, cy, cw, ch, mx, my, cxt) {
  cxt.beginPath();
  cxt.rect(cx, cy, cw, ch);
  return cxt.isPointInPath(mx, my);
}

function addBird(e) {
    coord.innerHTML = "CURRENT LEVEL :" + nb_level + " and SCORE :" + engine.score
    canM.onmousemove = null;
    canM.onmousedown = null;
    canM.onmouseup = null;
    let x = e.clientX;
    let y = e.clientY;
    if (inRect(0, 0, canM.width, canM.height, x, y, cxtM)) {
      // console.log("pos de bd",bd.origin.x, bd.origin.y)
      let bd_up = new Bird(new Vector(bd.origin.x, bd.origin.y),bd.r,bd.mass,bd.type,cxtM, buff);
      let bd_down = new Bird(new Vector(bd.origin.x, bd.origin.y),bd.r,bd.mass,bd.type,cxtM, buff);
      bd_up.loadImg(url + "images/");
      bd_down.loadImg(url + "images/");
      bd_up.isFly = true
      bd_down.isFly = true
      // console.log("oiseaux ajoutees",bd_up,bd_down)
      engine.addBody(bd_up);
      engine.addBody(bd_down);
      bd_up.velocity = bd.velocity;
      bd_down.velocity = bd.velocity;
      bd_up.force = bd_up.force.add(new Vector(
        2 * Constants.addforce * Constants.elasticity,
        -2 * Constants.addforce * Constants.elasticity
      ));
      bd.force = bd.force.add(new Vector(
        Constants.addforce * Constants.elasticity,
        0
      ))
      bd_down.force = bd_down.force.add(new Vector(
        2 * Constants.addforce * Constants.elasticity,
        2 * Constants.addforce * Constants.elasticity
      ));
      // console.log("engine apres ajouter les oiseaux",engine)
      // i++
    }
  
}

function speedUp(e) {
    // coord.innerHTML = "CURRENT LEVEL :" + nb_level + " and SCORE :" + engine.score
    canM.onmousemove = null;
    canM.onmousedown = null;
    canM.onmouseup = null;
    let x = e.clientX;
    let y = e.clientY;
    if (inRect(0, 0, canM.width, canM.height, x, y, cxtM)) {
      bd.force = bd.force.add(new Vector(
        Constants.addforce * Constants.elasticity,
        0)
      );
    }
}

/*deplacer l'oiseau au debut */
function drag() {
  let move_x, move_y;
  var coord = document.getElementById("coord");
  canM.onmousemove = function (e) {
    /* limiter le rayon que l'oiseau peut ete modifie par utilisateur */
    move_x = e.clientX;
    move_y = e.clientY;
    // if(!(inCircle(160, 270, 55, move_x, move_y, cxtM))){
    if (!inCircle(160, 210, 55, move_x, move_y, cxtM)) {
      // console.log("not in rayon");
      let arc = Math.atan((160 - move_x) / (210 - move_y));
      // console.log((arc * 180) / 3.14);
      let turn = move_y > 210 ? 1 : -1;
      move_x = 160 + 55 * turn * Math.sin(arc);
      move_y = 210 + 55 * turn * Math.cos(arc);
    }
    if (move_x < 160) {
      // console.log("move_x", move_x);
      coord.innerHTML = "ready to fly";
    } else {
      coord.innerHTML = " ";
    }
    /* redessiner le canvasMove 先清除之前的然后重新绘制*/
    bd.setPos(new Vector(move_x - bd.r, move_y - bd.r));
    // console.log("bd.x", bd.origin.x);
    // console.log("darg img",  move_x - 15,move_y - 15);
  };
  canM.onmouseup = function (e) {
    canM.onmousemove = null;
    canM.onmousedown = null;
    canM.onmouseup = null;

    if (e.clientX > 160) {
      bd.setPos(new Vector(160 - bd.r, 210 - bd.r));
      canM.onmousedown = listenMouseDown;
    } else {
      bd.setPos(new Vector(move_x - bd.r, move_y - bd.r));
      bd.setMass();
      bd.force = new Vector(
        Math.abs(160 - move_x) * Constants.elasticity,
        (210 - move_y) * Constants.elasticity
      );
      bd.isFly = true;
      // console.log("type",bd, bd.type)
      // let i = 1;
      if (bd.type == 3 && bd.isFly) {
        // coord.innerHTML = "CURRENT LEVEL :" + nb_level + " and SCORE :" + engine.score + " Click to separate the bird";
        canM.onmousedown = addBird;
      }else if(bd.type == 2 && bd.isFly){
        canM.onmousedown = speedUp;
      }

      nb_bd++;
      setTimeout(function () {
        setBird();
      }, 1000);

      // console.log("engine after fly",engine)
    }
  };
}
function listenMouseDown(e) {
  // return new Promise((resolve, reject) => {
  console.log("listenMouseDown");
  canM.onmousedown = null;
  let xd = e.clientX;
  let yd = e.clientY;
  if (inCircle(160, 210, bd.r, xd, yd, cxtM)) {
    drag();
  } else {
    canM.onmousedown = listenMouseDown;
  }
  // });
}

function callbackFunction(result, methodName) {
  // console.log("commencer lire level.json");
  score_win = 0;
  score = 0;
  // bdList = [];
  // bd = null
  engine.finish = false;
  engine.start = false;
  for (
    let i = 0;
    i < Object.keys(result["level" + nb_level].birds).length;
    i++
  ) {
    let birds = result["level" + nb_level].birds[i];
    let bird = new Bird(
      new Vector(birds.x, birds.y),
      birds.r,
      Infinity,
      birds.type,
      // bd3Img,
      cxtM,
      buff
    );
    bdList.push(bird);
    bird.loadImg(url + "images/");
    // console.log("push ", bdList);
    engine.addBody(bird);
  }

  for (
    let i = 0;
    i < Object.keys(result["level" + nb_level].springs).length;
    i++
  ) {
    let springs = result["level" + nb_level].springs[i];
    let spring = new Spring(
      new Vector(springs.x, springs.y),
      springs.w,
      springs.h,
      Infinity,
      // flowerImg,
      cxtM,
      buff
    );
    spring.loadImg(url + "images/");
    engine.addBody(spring);
  }

  for (
    let i = 0;
    i < Object.keys(result["level" + nb_level].stones).length;
    i++
  ) {
    let stones = result["level" + nb_level].stones[i];
    let stone = new Stone(
      new Vector(stones.x, stones.y),
      stones.w,
      stones.h,
      Constants.stonemass,
      // stoneImg,
      cxtM,
      buff
    );
    score_win += stone.score / 2;
    stone.loadImg(url + "images/");
    engine.addBody(stone);
  }

  for (
    let i = 0;
    i < Object.keys(result["level" + nb_level].woods).length;
    i++
  ) {
    let woods = result["level" + nb_level].woods[i];
    let wood = new Wood(
      new Vector(woods.x, woods.y),
      woods.w,
      woods.h,
      Constants.woodmass,
      // woodImg,
      cxtM,
      buff
    );
    score_win += wood.score / 2;
    wood.loadImg(url + "images/");
    engine.addBody(wood);
  }

  for (
    let i = 0;
    i < Object.keys(result["level" + nb_level].desks).length;
    i++
  ) {
    let desks = result["level" + nb_level].desks[i];
    let desk = new Desk(
      new Vector(desks.x, desks.y),
      desks.w,
      desks.h,
      Infinity,
      // deskImg,
      cxtM,
      buff
    );
    desk.loadImg(url + "images/");
    engine.addBody(desk);
  }

  for (
    let i = 0;
    i < Object.keys(result["level" + nb_level].glass).length;
    i++
  ) {
    let glass = result["level" + nb_level].glass[i];
    let glas = new Glass(
      new Vector(glass.x, glass.y),
      glass.w,
      glass.h,
      Constants.glassmass,
      // glassImg,
      cxtM,
      buff
    );
    score_win += glas.score / 2;
    glas.loadImg(url + "images/");
    engine.addBody(glas);
  }

  for (
    let i = 0;
    i < Object.keys(result["level" + nb_level].pigs).length;
    i++
  ) {
    let pigs = result["level" + nb_level].pigs[i];
    let pig = new Pig(
      new Vector(pigs.x, pigs.y),
      pigs.r,
      Constants.pigmass,
      pigs.type,
      // pigImg2,
      cxtM,
      buff
    );
    score_win += pig.score / 2;
    pig.loadImg(url + "images/");
    engine.addBody(pig);
  }
  console.log("finish loadjson", engine, "level", nb_level);
}

// lire le fichier jons pour obetenir les donnees de chaque niveau
function loadJson() {
  console.log("start loadJson");
  // return new Promise(function (s, f) {
  myajax = $.ajax({
    //url: "http://tp-ssh1.dep-informatique.u-psud.fr/~tingting.zhu/jsonp.php",
    // url: "http://localhost:8081/html/levels.json",
    url:Constants.url + "/levels.json",
    type: "GET",
    dataType: "json",
    async: false,
    success: function (data) {
      callbackFunction(data);
    },
  });
  // });
}

async function play() {
  // console.log("start play");
  bgShow(cxtBg);

  loadJson();

  //mettre les oiseau un par un
  $.when(myajax).done(
    (setBird = function () {
      // if (bd)
      //   console.log("进入setbird", bd, bd.on, bd.isFalldown(), bd.origin.x);
      if (
        !bd ||
        (bd.on = !null || bd.isFalldown() || bd.origin.x > canM.width)
      ) {
        if (nb_bd < bdList.length) {
          // console.log("nb bd", nb_bd, bd);
          bd = bdList[nb_bd];
          bd.isReady = true;
          // console.log("nouveau", nb_bd, bd);
          bd.setPos(new Vector(160 - bd.r, 210 - bd.r));
          canM.onmousedown = listenMouseDown;
        }
      } else {
        setBird();
      }

      if (nb_bd == bdList.length) {
        engine.start = true;
        console.log("engine start", engine.start);
      }
    })
  );

  // let renderer
  renderer = new Renderer(engine);
  // let interval;
  interval = setInterval(function () {
    try {
      cxtM.clearRect(0, 0, canM.width, canM.height);
      renderer.update(1000 / 60);
      // console.log("finish获取测试", engine.finish)
      if(bd.type == 3 && bd.isFly){
      coord.innerHTML =
        "CURRENT LEVEL :" + nb_level + " and SCORE :" + engine.score + " !! Click to separate the bird";
      }else if(bd.type == 2 && bd.isFly){
        coord.innerHTML =
        "CURRENT LEVEL :" + nb_level + " and SCORE :" + engine.score + " !! Click to speed up";
      }else{
        coord.innerHTML =
        "CURRENT LEVEL :" + nb_level + " and SCORE :" + engine.score;
      }
      /** decider gagner ou perdre et continue*/
      if (engine.finish) {
        console.log("engine finish", engine.finish);
        if (engine.nbPig == 0) {
          coord.innerHTML = "SCORE :" + engine.score + " GO TO NEXT LEVEL ";
          console.log("win");
          afterWin();
          return;
        } else {
          coord.innerHTML = "SCORE :" + engine.score + " RESTART THIS LEVEL";
          console.log("lose");
          afterLose();
          return;
        }
      }
    } catch (e) {
      clearInterval(interval);
      throw e;
    }
  }, 1000 / 60);
}

function rePlay() {
  cxtM.clearRect(0, 0, 800, 400);
  engine = new Engine();
  engine.bodies = [];
  score_win = 0;
  score = 0;
  play();
}

function afterWin() {
  bdList = []
  nb_bd =0;
  setTimeout(clearInterval(interval), 2000);
  if (nb_level == total_level) {
    cxtM.drawImage(winImg, 0, 0, canM.width, canM.height);
    coord.innerHTML = "YOU WIN THE GAME, CLICK F5 TO RELOAD THE GAME";
  } else {
    cxtM.drawImage(nextImg, 300, 200, 200, 100);
    bdList = [];
    nb_bd = 0;
    canM.onmousedown = function (ev) {
      // if (this != ev.target) return;
      if (inRect(300, 200, 200, 100, ev.clientX, ev.clientY, cxtM)) {
        // console.log("click");
        nb_level++;
        coord.innerHTML = "current level: " + nb_level;
        console.log("current level", nb_level);
        cxtM.clearRect(0, 0, 800, 400);
        canM.onmousedown = null;
        rePlay();
      }
    };
  }
}

function afterLose() {

  cxtM.drawImage(loseImg, 300, 200, 200, 100);
  cxtM.drawImage(restImg, 300, 200, 200, 100);
  setTimeout(clearInterval(interval), 2000);
  bdList = [];
  nb_bd = 0;
  canM.onmousedown = function (ev) {
    // if (this != ev.target) return;
    if (inRect(300, 200, 200, 100, ev.clientX, ev.clientY, cxtM)) {
      // console.log("click");
      // nb_level++
      coord.innerHTML = "current level: " + nb_level;
      console.log("current niveau", nb_level);
      cxtM.clearRect(0, 0, 800, 400);
      canM.onmousedown = null;
      rePlay();
    }
  };
}

function gameManager() {
  this.welcome = function () {
    cxtM.drawImage(wImg, 0, 0, 800, 400);
    cxtM.drawImage(startImg, 330, 320, 140, 70);
    canM.onmousedown = function (ev) {
      // if (this != ev.target) return;
      if (inRect(330, 320, 140, 70, ev.clientX, ev.clientY, cxtM)) {
        // console.log("click");
        coord.innerHTML = "current level: " + nb_level;
        nb_level = 1;
        cxtM.clearRect(0, 0, 800, 400);
        canM.onmousedown = null;
        play();
      }
    };
  };
}
