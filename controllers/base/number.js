exports.methods = {
  generateRandomArbitraryNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  pseudoNumber: {
    check: (number) => {
      return number === 1;
    },
    generate: () => {
      return this.methods.generateRandomArbitraryNumber(0, 1);
    },
    execute: (type, previousData, option = 1) => {
      let pseudoNumber = this.methods.pseudoNumber;
      if (type === "random") {
        let number = pseudoNumber.generate();
        return {
          number: number,
          check: pseudoNumber.check(number),
        };
      } else if (type === "row") {
        if (option === 1) {
          if (previousData === 0) return 1;
          else if (previousData === 1) return 0;
          else return 0;
        }
      }
    },
  },
  primeNumber: {
    check: (number) => {
      if (number <= 1) {
        return false;
      }
      for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
          return false;
        }
      }
      return true;
    },
    generate: () => {
      return this.methods.generateRandomArbitraryNumber(0, 100);
    },
    execute: (type, previousData) => {
      let primeNumber = this.methods.primeNumber;
      if (type === "random") {
        let number = primeNumber.generate();
        return {
          number: number,
          check: primeNumber.check(number),
        };
      } else if (type === "row") {
        let nextNumber = previousData + 1;
        while (!primeNumber.check(nextNumber)) {
          nextNumber++;
        }
        return nextNumber;
      }
    },
  },
  fibonacciNumber: {
    check: (number, a = 0, b = 1) => {
      if (number === 0 || number === 1) {
        return true;
      }
      let nextNumber = a + b;
      if (nextNumber === number) {
        return true;
      } else if (nextNumber > number) {
        return false;
      }
      return this.methods.fibonacciNumber.check(number, b, nextNumber);
    },
    generate: () => {
      return this.methods.generateRandomArbitraryNumber(0, 100);
    },
    execute: (type, previousData) => {
      let fibonacciNumber = this.methods.fibonacciNumber;
      if (type === "random") {
        let number = fibonacciNumber.generate();
        return {
          number: number,
          check: fibonacciNumber.check(number),
        };
      } else if (type === "row") {
        let n = previousData;
        if (n < 0 || n === null) return 0;
        let a = 0;
        let b = 1;
        while (b <= n) {
          const temp = b;
          b = a + b;
          a = temp;
        }
        return b;
      }
    },
  },
};
