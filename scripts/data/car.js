class Car {
  #brand;
  #model;
  speed = 0;
  isTrunkOpen = false;

  constructor(carDetails) {
    this.#brand = carDetails.brand;
    this.#model = carDetails.model;
  }

  displayInfo() {
    console.log(
      `${this.#brand} ${this.#model}, Speed: ${this.speed} km/h, Trunk: ${
        this.isTrunkOpen
      }`
    );
  }

  go() {
    this.speed <= 195 ? (this.speed += 5) : (this.speed = 200);
  }
  break() {
    this.speed >= 5 ? (this.speed -= 5) : (this.speed = 0);
  }
  openTrunk() {
    this.speed > 0 ? (this.isTrunkOpen = false) : (this.isTrunkOpen = true);
  }
  closeTrunk() {
    this.isTrunkOpen = false;
  }
}

class RaceCar extends Car {
  acceleration;

  constructor(carDetails) {
    super(carDetails);
    this.acceleration = carDetails.acceleration;
  }

  go() {
    this.speed <= 295 ? (this.speed += this.acceleration) : (this.speed = 300);
  }
  openTrunk() {
    this.isTrunkOpen = undefined;
  }

  closeTrunk() {
    this.isTrunkOpen = undefined;
  }
}

const car1 = new Car({
  brand: "Toyota",
  model: "Corolla",
});

const car2 = new Car({
  brand: "Tesla",
  model: "Model 3",
});

const raceCar = new RaceCar({
  brand: "McLaren",
  model: "F1",
  acceleration: 20,
});

raceCar.brand = "hi";

raceCar.go();
raceCar.go();
raceCar.break();
raceCar.openTrunk();

raceCar.displayInfo();

car1.openTrunk();

car2.go();
car2.break();
car2.openTrunk();
car1.displayInfo();
car2.displayInfo();
