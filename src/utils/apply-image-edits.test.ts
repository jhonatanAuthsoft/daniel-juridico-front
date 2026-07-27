import { cropImage, rotateImage } from './apply-image-edits';

jest.mock('expo-image-manipulator', () => ({
  SaveFormat: { JPEG: 'jpeg' },
  manipulateAsync: jest.fn(async (uri: string, actions: unknown[]) => ({
    uri: `${uri}-edited`,
    actions,
  })),
}));

const { manipulateAsync } = jest.requireMock('expo-image-manipulator') as {
  manipulateAsync: jest.Mock;
};

describe('apply-image-edits', () => {
  beforeEach(() => {
    manipulateAsync.mockClear();
  });

  it('returns the same uri when rotation is a full turn', async () => {
    await expect(rotateImage('file://a.jpg', 360)).resolves.toBe('file://a.jpg');
    expect(manipulateAsync).not.toHaveBeenCalled();
  });

  it('persists a 90 degree rotation', async () => {
    await expect(rotateImage('file://a.jpg', 90)).resolves.toBe('file://a.jpg-edited');
    expect(manipulateAsync).toHaveBeenCalledWith(
      'file://a.jpg',
      [{ rotate: 90 }],
      expect.objectContaining({ format: 'jpeg' }),
    );
  });

  it('crops to the given rect', async () => {
    await expect(
      cropImage('file://a.jpg', { originX: 10, originY: 20, width: 100, height: 80 }),
    ).resolves.toBe('file://a.jpg-edited');

    expect(manipulateAsync).toHaveBeenCalledWith(
      'file://a.jpg',
      [{ crop: { originX: 10, originY: 20, width: 100, height: 80 } }],
      expect.objectContaining({ format: 'jpeg' }),
    );
  });
});
