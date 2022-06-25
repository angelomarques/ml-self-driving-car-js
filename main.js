// const currentBestBrain = {
//   "levels": [
//       {
//           "inputs": [
//               0,
//               0,
//               0,
//               0.28687659479297,
//               0.6140603941789791
//           ],
//           "outputs": [
//               0,
//               1,
//               0,
//               0,
//               0,
//               1
//           ],
//           "biases": [
//               0.3038853928811958,
//               -0.30041958721590695,
//               0.28221343524368997,
//               0.014164638480047523,
//               0.08691416392861999,
//               -0.20292491235832372
//           ],
//           "weights": [
//               [
//                   -0.16730021327047293,
//                   -0.4580587303864204,
//                   -0.204128928876947,
//                   -0.01003648025902977,
//                   0.12433049371142037,
//                   -0.07334243211881594
//               ],
//               [
//                   -0.26286793929666974,
//                   -0.03815318374131833,
//                   -0.10227945394966978,
//                   -0.21198564873691075,
//                   -0.2651733904658637,
//                   -0.28567106680668425
//               ],
//               [
//                   0.10107906733185774,
//                   -0.06906056239278696,
//                   0.18898360222377603,
//                   0.2956818746596822,
//                   -0.3116150114104511,
//                   -0.12161826412219197
//               ],
//               [
//                   0.0691064652951045,
//                   -0.17575523996927667,
//                   0.3071784583691077,
//                   0.4083595113197498,
//                   -0.20090009873396852,
//                   0.03789299811433808
//               ],
//               [
//                   0.22074877829707532,
//                   0.0661311821116653,
//                   -0.09929995742010707,
//                   -0.1957106570356759,
//                   -0.1602507587364146,
//                   -0.24399270065831521
//               ]
//           ]
//       },
//       {
//           "inputs": [
//               0,
//               1,
//               0,
//               0,
//               0,
//               1
//           ],
//           "outputs": [
//               1,
//               0,
//               0,
//               0
//           ],
//           "biases": [
//               -0.1938012389662187,
//               0.20903357868760292,
//               -0.2966454421162227,
//               0.20382766960449453
//           ],
//           "weights": [
//               [
//                   -0.29586727737197666,
//                   -0.1303811580367513,
//                   -0.07487088665728159,
//                   0.2334592337363836
//               ],
//               [
//                   0.10136973504873167,
//                   0.2528423444007952,
//                   -0.015200096207138093,
//                   0.19245104428429513
//               ],
//               [
//                   -0.45632584493104245,
//                   -0.03367529089194932,
//                   -0.05913021429331784,
//                   -0.18731242881379562
//               ],
//               [
//                   0.1535383945503714,
//                   0.18485732083492742,
//                   -0.11947120516409433,
//                   0.21819469546488243
//               ],
//               [
//                   -0.23183119842151728,
//                   -0.012381754398547495,
//                   0.03811117337457019,
//                   -0.25116405237021044
//               ],
//               [
//                   0.28992565146503974,
//                   -0.19317003138041997,
//                   -0.2878336779603054,
//                   -0.10479468315059273
//               ]
//           ]
//       }
//   ]
// }

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  console.log(JSON.parse(localStorage.getItem("bestBrain")))
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
];

let animationFrame;
let isRunning = true;
animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  animationFrame = requestAnimationFrame(animate);
}

const pausedScreen = document.getElementById("pausedScreen");
document.onkeyup = (event) => {
  if (event.key == " ") {
    if (isRunning) {
      cancelAnimationFrame(animationFrame);
      isRunning = false;
      pausedScreen.style.display = "block";
    } else {
      animate();
      isRunning = true;
      pausedScreen.style.display = "none ";
    }
  }
};
