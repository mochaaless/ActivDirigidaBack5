import { Collection, ObjectId } from "mongodb";
import { Vuelo, VueloModel } from "./types.ts";
import { formModelToVuelo } from "./utils.ts";

export const resolvers = {
  Query: {
    getFlights: async (
      _: unknown,
      args: { origen?: string; destino?: string },
      context: { VuelosCollection: Collection<VueloModel> },
    ): Promise<Vuelo[]> => {
      const { origen, destino } = args;

      // Construye el filtro dinámicamente según los argumentos
      const filter: Partial<VueloModel> = {};
      if (origen) filter.origen = origen;
      if (destino) filter.destino = destino;

      // Consulta la base de datos usando el filtro
      const vueloModel = await context.VuelosCollection.find(filter).toArray();

      // Convierte los resultados a Vuelo y los retorna
      return vueloModel.map((vueloModel) => formModelToVuelo(vueloModel));
    },
    getFlight: async (
      _: unknown,
      { id }: { id: string },
      context: {
        VuelosCollection: Collection<VueloModel>;
      },
    ): Promise<Vuelo | null> => {
      const vueloModel = await context.VuelosCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!vueloModel) {
        return null;
      }
      return formModelToVuelo(vueloModel);
    },
  },
  Mutation: {
    addFlight: async (
      _: unknown,
      args: { origen: string; destino: string; date: string },
      context: {
        VuelosCollection: Collection<VueloModel>;
      },
    ): Promise<Vuelo> => {
      const { origen, destino, date } = args;
      const { insertedId } = await context.VuelosCollection.insertOne({
        origen,
        destino,
        date,
      });
      const vueloModel = {
        _id: insertedId,
        origen,
        destino,
        date,
      };
      return formModelToVuelo(vueloModel!);
    },
    // deleteDinosaur: async (
    //   _: unknown,
    //   args: { id: string },
    //   context: {
    //     DinosaursCollection: Collection<VueloModel>;
    //   },
    // ): Promise<Vuelo | null> => {
    //   const id = args.id;
    //   const dinosaurModel = await context.DinosaursCollection.findOneAndDelete({
    //     _id: new ObjectId(id),
    //   });
    //   if (!dinosaurModel) {
    //     return null;
    //   }
    //   return formModelToVuelo(dinosaurModel);
    // },
  },
};
