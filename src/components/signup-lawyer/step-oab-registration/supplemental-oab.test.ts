import {
  hasFilledSupplementalOabDraft,
  isCompleteSupplementalOab,
  keepCompleteSupplementalOabs,
} from './supplemental-oab';

const complete = {
  number: '654321',
  uf: 'SP',
  issueDate: '10/01/2018',
  photoUris: ['file://front.jpg', 'file://back.jpg'],
  photoKeys: ['tmp/front.jpg', 'tmp/back.jpg'],
};

describe('supplemental OAB completeness', () => {
  it('requires number, UF, issue date and both wallet photos', () => {
    expect(isCompleteSupplementalOab(complete)).toBe(true);
    expect(
      isCompleteSupplementalOab({
        ...complete,
        photoKeys: [],
        photoUris: [],
      }),
    ).toBe(false);
    expect(hasFilledSupplementalOabDraft({ ...complete, number: '' })).toBe(true);
    expect(
      hasFilledSupplementalOabDraft({
        number: '',
        uf: '',
        issueDate: '',
        photoUris: [],
        photoKeys: [],
      }),
    ).toBe(false);
  });

  it('drops empty and partial drafts', () => {
    expect(
      keepCompleteSupplementalOabs([
        {
          number: '',
          uf: '',
          issueDate: '',
          photoUris: [],
          photoKeys: [],
        },
        {
          number: 'IDUNQWIDUN',
          uf: 'SP',
          issueDate: '10/01/2018',
          photoUris: ['file://front.jpg'],
          photoKeys: ['tmp/front.jpg'],
        },
        complete,
      ]),
    ).toEqual([complete]);
  });
});
