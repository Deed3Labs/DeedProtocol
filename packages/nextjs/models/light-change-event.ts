export interface LightChangeEvent<TParent> {
  value: any;
  name: keyof TParent;
}
