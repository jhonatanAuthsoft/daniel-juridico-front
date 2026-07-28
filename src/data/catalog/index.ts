export type {
  SpecialtyCatalogItem,
  SpecialtyCatalogWire,
  SubspecialtyCatalogWire,
} from './catalog.types';
export {
  mapSpecialtyCatalogToCategories,
  mapSpecialtyCatalogWireToItem,
} from './catalog.mapper';
export { fetchSpecialtiesCatalog } from './catalog.api';
