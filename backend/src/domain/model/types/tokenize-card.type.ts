export type TokenizeCardRequest = {
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  cardHolder: string;
};

export type TokenizeCardResponse = {
  tokenId: string;
  brand: string;
  lastFour: string;
};
