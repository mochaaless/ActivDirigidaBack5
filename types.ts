import { OptionalId } from "mongodb";

export type VueloModel = OptionalId<{
  origen: string;
  destino: string
  date: string;
}>;

export type Vuelo = {
  id: string;
  origen: string;
  destino: string
  date: string;
};
