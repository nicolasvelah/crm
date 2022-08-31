/* eslint-disable camelcase */
import { createContext } from 'react';

interface Versions {
  codigo: string | null;
  costo: number | null;
  id_marca: number | null;
  id_modelo: number | null;
  ids_colores: string | null;
  marca: string | null;
  margen: number | null;
  modelo: string | null;
  precio: number | null;
  stock: number | null;
}

export interface SelectNewVehicle {
  marca: string | null;
  modelo: string | null;
  imageVehicle: string | null;
  versions: Versions[] | null;
  dataVehicle: {
    anio: number;
    cilindraje: number;
    codigo: string;
    color: { color: string; id: number; stock: number }[];
    combustible: string;
    costo: number;
    descripcion: string;
    marca: string;
    margen: number;
    modelo: string;
    nropasajeros: number;
    numaccesorios: number;
    numserv: number;
    precio: number;
    puertas: number;
    totalstock: number;
    vin: number;
  } | null;
}

// eslint-disable-next-line import/prefer-default-export
export const CatalogContext = createContext<{
  catalog: any;
  setCatalog: Function;
  setDataTestDriver: Function;

  setDataTestDriverSelection: Function;
  setViewTestDriver: Function;
  selectNewVehicle: SelectNewVehicle | null;
  setSelectNewVehicle: Function;
}>({
  catalog: [],
  setCatalog: () => {},
  setDataTestDriver: () => {},

  setDataTestDriverSelection: () => {}, // Select Test Drive
  setViewTestDriver: () => {}, //Vista
  selectNewVehicle: null,
  setSelectNewVehicle: () => {},
});
