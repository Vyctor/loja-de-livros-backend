export class CreateOrderDto {
  total: number;
  client: {
    email: string;
    name: string;
    surname: string;
    document: string;
    country_id: number;
    state_id: number;
    street_name: string;
    street_number: string;
    complement: string;
    zip_code: string;
    phone: string;
  };
  items: Array<{
    quantity: number;
    book_id: number;
    price: number;
  }>;
  payment: {
    type: string;
    card_brand: string;
    card_number: string;
    card_holder: string;
    card_expiration: string;
    card_cvv: string;
  };
}
