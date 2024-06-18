export default interface DataModel<T> {
  id: number | null;
  [key: string]: T | number | undefined | any[] | string | boolean | any;
}