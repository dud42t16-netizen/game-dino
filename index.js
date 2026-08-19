const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

let chao = 361;

//dinocomeço//
let dinoLargura = 60;
let dinoAltura = 50;

let dinoX = 100;
let dinoY = chao - dinoAltura;

let velocidadeY = 0;
let gravidade = 0.4;

let frameDino = 0;
let contadorAnimacao = 0;
let imagensDino = [];

for (let i = 1; i <= 4; i++) {
    let imagem = new Image();
    imagem.src = `dino.png/dino_correndo_${i}.png`;
    imagensDino.push(imagem);
}

let imagemDinoPulo = new Image();
imagemDinoPulo.src = "dino.png/dino_pulando_1.png";
//dinofim//

//CACTOCOMEÇO//
let cactoLargura = 50;
let cactoAltura = 35;
let cactoX = canvas.width;
let cactoY = chao - cactoAltura;

let cactoVelocidade = 5; 
const aumentoVelocidade = 0.1;
//CACTOFIM//

let gameOver = false;
let pontoContado = false;
let pontuacao = 0;
let recorde = 0;

/*function tamanhoCanvas() {
    let canvasLargura = window.innerWidth;
    let canvasAltura = window.innerHeight;

    if (canvasLargura / 2 <= canvasAltura) {
        canvas.style.width = canvasLargura //+ //"px";
        canvas.style.height = (canvasLargura / 2) //+ //"px";
    }
    else {
        canvas.height = canvasAltura //+ "px";
        canvas.width = (canvasAltura * 2) //+ "px";
    }
}*/

function tamanhoCanvas() {
    let larguraTela = window.innerWidth;
    let alturaTela = window.innerHeight;

    let larguraJogo = larguraTela;
    let alturaJogo = larguraTela / 2;

    if (alturaJogo > alturaTela) {
        alturaJogo = alturaTela;
        larguraJogo = alturaTela * 2;
    }

    canvas.style.width = larguraJogo + "px";
    canvas.style.height = alturaJogo + "px";
}

tamanhoCanvas();

window.addEventListener("resize", tamanhoCanvas);

function atualizar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    contadorAnimacao++;
    if (contadorAnimacao >= 10) {
        contadorAnimacao = 0;
        frameDino = (frameDino + 1) % 4;
    }

    dinoY += velocidadeY;
    velocidadeY += gravidade;
    if (dinoY >= chao - dinoAltura) {
      dinoY = chao - dinoAltura;
      velocidadeY = 0;
    }

    cactoX -= cactoVelocidade;

    desenharDino();

    desenharCacto();

    desenharPonto();

     if (cactoX < -cactoLargura) {
       cactoX = canvas.width;
       pontoContado = false;
    }

    if (
        !gameOver 
        &&
        !(cactoX > dinoX + dinoLargura || cactoX + cactoLargura < dinoX)
        &&
        !(cactoY > dinoY + dinoAltura || cactoY + cactoAltura < dinoY)
    ) {
        gameOver = true;
        console.log("game over");
    }
    
    if (gameOver) {
        ctx.textAlign = "center";
        ctx.font = '30px Arial';
        ctx.fillStyle = "black";
        ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2.4);
        ctx.fillText("aperte R para reiniciar o jogo!", canvas.width / 2, canvas.height / 1.8);
        ctx.fillText("ou toque na tela!", canvas.width / 2, canvas.height / 1.5)

        return;
    }

    if (cactoX + cactoLargura < dinoX && !pontoContado) {
        pontuacao++;
        pontoContado = true;

        if (pontuacao > recorde) {
            recorde = pontuacao;
            localStorage.setItem("recorde", recorde.toString());
        }

        cactoVelocidade += aumentoVelocidade;
    }

    if (contadorAnimacao >= 10) {
       contadorAnimacao = 0;
       frameDino = 1 - frameDino;
    }

    requestAnimationFrame(atualizar);
}

tamanhoCanvas();
carregarRecorde();
atualizar();

function desenharDino() {
    if (dinoY === chao - dinoAltura) {
        ctx.drawImage(
            imagensDino[frameDino],
            dinoX,
            dinoY,
            dinoLargura,
            dinoAltura
        );
    } 
    else {
        ctx.drawImage(
            imagemDinoPulo,
            dinoX,
            dinoY,
            dinoLargura,
            dinoAltura
       );
    }
}

function desenharCacto() {
    ctx.fillStyle = "black";
    ctx.fillRect(cactoX, cactoY, cactoLargura, cactoAltura);
}

function desenharPonto() {
     ctx.font = '25px Arial';
     ctx.fillStyle = "black"
     ctx.fillText("Pontos: " + pontuacao, canvas.width / 13, canvas.height / 10);
     ctx.fillText("recorde:🏆" + recorde, canvas.width / 9, canvas.height / 5);
}

function pular() {
     if (dinoY === chao - dinoAltura) {
        velocidadeY = -10;
    }
}
function teclapressionada(evento) {
    if (evento.code === "Space") {
        pular();
    }
    if (evento.code === "KeyR" && gameOver) {
        reiniciarJogo();
        atualizar();
    }
}

function toquenatela() {
    if (gameOver) {
        reiniciarJogo();
        atualizar();
    }
    else {
        pular();
    }
}

function reiniciarJogo() {
    gameOver = false;
    pontuacao = 0;
    pontoContado = false;

    dinoY = chao - dinoAltura;
    velocidadeY = 0;
    cactoVelocidade = 4;

    cactoX = canvas.width;
}

function carregarRecorde() {
    let recordeSalvo = localStorage.getItem("recorde");

    if (recordeSalvo !== null) {
        recorde = Number(recordeSalvo);
    }
}

document.addEventListener("keydown", teclapressionada);
window.addEventListener("resize", tamanhoCanvas);
canvas.addEventListener("touchstart", pular);
canvas.addEventListener("touchstart", toquenatela);
