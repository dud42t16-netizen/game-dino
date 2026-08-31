const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

let chao = canvas.height * 0.9090;

//dinocomeço//
let dinoLargura = canvas.width * 0.0630;
let dinoAltura = canvas.height * 0.1;

let dinoX = canvas.width * 0.125;
let dinoY = chao - dinoAltura;

let hitboxDinoLargura = dinoLargura * 0.65;
let hitboxDinoAltura = dinoAltura * 0.75;

let velocidadeY = 0;
let gravidade = 0.3;

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

let imagemDinoMorto = new Image();
imagemDinoMorto.src = "dino.png/dino_morto_1.png";
let dinoMortoAltura = canvas.height * 0.04;
//dinofim//

//CACTOCOMEÇO//
let cactoLargura = canvas.width * 0.0530;
let cactoAltura = canvas.height * 0.1;
let cactoX = canvas.width;
let cactoY = chao - cactoAltura;

let hitboxCactoLargura = cactoLargura * 0.65;
let hitboxCactoAltura = cactoAltura * 0.85;

let cactoVelocidade = 5; 
const aumentoVelocidade = 0.2;

let imagensCacto = [];

for (let i = 1; i <= 4; i++) {
    let imagem = new Image();
    imagem.src = `dino.png/cacto_${i}.png`;
    imagensCacto.push(imagem);
}

let cactoAtual = 0;
//CACTOFIM//

let imagemFundo = new Image();
imagemFundo.src = "dino.png/fundo2.jpg";

let imagemChao = new Image();
imagemChao.src = "dino.png/chao2.png";

let gameOver = false;
let pontoContado = false;
let pontuacao = 0;
let recorde = 0;

function tamanhoCanvas() {
    let larguraTela = window.innerWidth;
    let alturaTela = window.innerHeight;

    let larguraJogo = larguraTela;
    let alturaJogo = larguraTela * 9 / 16;

    if (alturaJogo > alturaTela) {
        alturaJogo = alturaTela;
        larguraJogo = alturaTela * 16 / 9;
    }

    canvas.style.width = larguraJogo + "px";
    canvas.style.height = alturaJogo + "px";
}

tamanhoCanvas();

window.addEventListener("resize", tamanhoCanvas);

function atualizar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height);

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

     let dinoHitboxX = dinoX + (dinoLargura - hitboxDinoLargura) / 2;
     let dinoHitboxY = dinoY + (dinoAltura - hitboxDinoAltura) / 2;

     let cactoHitboxX = cactoX + (cactoLargura - hitboxCactoLargura) / 2;
     let cactoHitboxY = cactoY + (cactoAltura - hitboxCactoAltura);

    if (
        !gameOver &&
        dinoHitboxX < cactoHitboxX + hitboxCactoLargura &&
        dinoHitboxX + hitboxDinoLargura > cactoHitboxX &&
        dinoHitboxY < cactoHitboxY + hitboxCactoAltura &&
        dinoHitboxY + hitboxDinoAltura > cactoHitboxY
    ) {
        gameOver = true;
        console.log("game over");
    }

     desenharChao();

     desenharDino();

     desenharCacto();

     desenharPonto();

      if (cactoX < -cactoLargura) {
          cactoX = canvas.width;
          pontoContado = false;

          cactoAtual = (cactoAtual + 1) % 4;
        }

    if (gameOver) {
        ctx.textAlign = "center";
        ctx.font = '30px Arial';
        ctx.fillStyle = "black";
        ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2.4);
        ctx.fillText("aperte R para reiniciar o jogo!", canvas.width / 2, canvas.height / 1.8);
        ctx.fillText("ou toque na tela!", canvas.width / 2, canvas.height / 1.5);

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
    if (gameOver) {
        let dinoMortoLargura =
            imagemDinoMorto.naturalWidth *
            (dinoMortoAltura / imagemDinoMorto.naturalHeight);

        ctx.drawImage(
            imagemDinoMorto,
            dinoX,
            chao - dinoMortoAltura,
            dinoMortoLargura,
            dinoMortoAltura
        );
    }
    else if (dinoY === chao - dinoAltura) {
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
    ctx.drawImage(
        imagensCacto[cactoAtual],
        cactoX,
        cactoY,
        cactoLargura,
        cactoAltura
    );
}

function desenharChao() {
    let alturaChao = 29;
    let larguraChao = imagemChao.naturalWidth * (alturaChao / imagemChao.naturalHeight);

    for (let x = 0; x < canvas.width; x += larguraChao) {
        ctx.drawImage(
            imagemChao,
            x,
            chao - alturaChao,
            larguraChao,
            alturaChao
        );
    }
}

function desenharPonto() {
     ctx.font = '30px Arial';
     ctx.fillStyle = "black"
     ctx.fillText("Pontos: " + pontuacao, canvas.width / 4, canvas.height / 10);
     ctx.fillText("recorde:🏆" + recorde, canvas.width / 2, canvas.height / 10);
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
    cactoVelocidade = 5;

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
