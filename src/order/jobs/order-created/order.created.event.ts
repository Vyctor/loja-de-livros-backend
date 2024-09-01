export class OrderCreatedDto {
  id: number;
  total: number;
  payment: {
    type: string;
    card_brand: string;
    card_number: string;
    card_holder: string;
    card_expiration: string;
    card_cvv: string;
  };
}
