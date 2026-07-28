/** BrasilAPI municipality item. */
export type BrasilApiMunicipio = {
  nome: string;
  codigo_ibge: string;
};

/** City option for address selects (value = city name for API payloads). */
export type CityByUf = {
  code: string;
  name: string;
};
