export default class Util {
  static generateRandom = (lower, upper) => {
    return Math.floor(Math.random() * upper) + lower;
  }
}
