/** Wire / domain types for `GET /catalogos/especialidades`. */

export type SubspecialtyCatalogWire = {
  codigo: string;
  nome: string;
};

export type SpecialtyCatalogWire = {
  codigo: string;
  nome: string;
  subespecialidades: SubspecialtyCatalogWire[];
};

export type SpecialtyCatalogItem = {
  code: string;
  name: string;
  subspecialties: {
    code: string;
    name: string;
  }[];
};
