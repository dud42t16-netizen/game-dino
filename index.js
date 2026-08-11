const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

let chao = 361;

//dinocomeço//
let dinoLargura = 50;
let dinoAltura = 40;

let dinoX = 100;
let dinoY = chao - dinoAltura;

let velocidadeY = 0;
let gravidade = 0.5;
//dinofim//

//CACTOCOMEÇO//
let cactoLargura = 50;
let cactoAltura = 35;
let cactoX = canvas.width;
let cactoY = chao - cactoAltura;

let cactoVelocidade = 4; 
const aumentoVelocidade = 0.2;
//CACTOFIM//

let gameOver = false;
let pontoContado = false;
let pontuacao = 0;
let recorde = 0;

function tamanhoCanvas() {
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
}

function atualizar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        }

        cactoVelocidade += aumentoVelocidade;
    }

    requestAnimationFrame(atualizar);
}

tamanhoCanvas();
atualizar();

function desenharDino() {
    ctx.fillStyle = "black";
    ctx.fillRect(dinoX, dinoY, dinoLargura,dinoAltura);
}

function desenharCacto() {
    ctx.fillStyle = "black";
    ctx.fillRect(cactoX, cactoY, cactoLargura, cactoAltura);
}

function desenharPonto() {
     ctx.font = '25px Arial';
     ctx.fillStyle = "black"
     ctx.fillText("Pontos: " + pontuacao, canvas.width / 13, canvas.height / 10);
     ctx.fillText("recorde:🏆" + recorde, canvas.width / 13, canvas.height / 5);
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

document.addEventListener("keydown", teclapressionada);
window.addEventListener("resize", tamanhoCanvas);
canvas.addEventListener("touchstart", pular);
canvas.addEventListener("touchstart", toquenatela);
