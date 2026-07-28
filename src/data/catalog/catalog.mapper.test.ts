import {
  mapSpecialtyCatalogToCategories,
  mapSpecialtyCatalogWireToItem,
} from './catalog.mapper';

describe('catalog.mapper', () => {
  it('maps wire items to domain items', () => {
    expect(
      mapSpecialtyCatalogWireToItem({
        codigo: 'CIVIL',
        nome: 'Direito Civil',
        subespecialidades: [{ codigo: 'CONTRATOS', nome: 'Contratos' }],
      }),
    ).toEqual({
      code: 'CIVIL',
      name: 'Direito Civil',
      subspecialties: [{ code: 'CONTRATOS', name: 'Contratos' }],
    });
  });

  it('maps catalog items to UI categories with composite ids', () => {
    expect(
      mapSpecialtyCatalogToCategories([
        {
          code: 'CIVIL',
          name: 'Direito Civil',
          subspecialties: [{ code: 'CONTRATOS', name: 'Contratos' }],
        },
      ]),
    ).toEqual([
      {
        id: 'CIVIL',
        code: 'CIVIL',
        label: 'Direito Civil',
        children: [
          {
            id: 'CIVIL:CONTRATOS',
            code: 'CONTRATOS',
            label: 'Contratos',
          },
        ],
      },
    ]);
  });
});
