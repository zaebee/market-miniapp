import path from 'path';
import fs from 'fs-extra';
import { getFileData, getFileSizeInBytes } from '../../scripts/seed';

jest.mock('fs-extra');

describe('Seed Script Utilities', () => {
  const sampleFile = 'coffee-beans.jpg';
  
  beforeEach(() => {
    (fs.statSync as unknown as jest.Mock).mockReturnValue({ size: 12345 });
  });

  it('getFileSizeInBytes should return correct size', () => {
    const filePath = path.join('data', 'uploads', sampleFile);
    const size = getFileSizeInBytes(filePath);
    expect(size).toBe(12345);
  });

  it('getFileData should return correct metadata', () => {
    const data = getFileData(sampleFile);
    expect(data).toHaveProperty('filepath');
    expect(data.filepath).toContain(sampleFile);
    expect(data).toHaveProperty('originalFileName', sampleFile);
    expect(data).toHaveProperty('size', 12345);
    expect(data).toHaveProperty('mimetype', 'image/jpeg');
  });
});