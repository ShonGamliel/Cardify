export default interface UserInterface {
  userid: number;
  name: string;
  email: string;
  joinDate: string;
  cards: Array<number>;
  businessAccount: Boolean;
}