export default function getRandomNumber(length: number): string {
  let value = "";
  for (let i = 0; i < length; i++) {
    value += Math.floor(Math.random() * 10);
  }
  return value;
}
