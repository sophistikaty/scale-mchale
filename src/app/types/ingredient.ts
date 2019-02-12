export class Ingredient {

    text: string;
    quantity: number;
    prevQuantity: number;

    constructor(text: string = '',
                quantity: number = 1) {
      this.text = text;
      this.quantity = quantity;
      this.prevQuantity = this.quantity;
    }
}
