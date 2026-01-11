import path from 'path';
// @ts-ignore
import { getFileData, getFileSizeInBytes } from '../../scripts/seed';

describe('Seed Script Utilities', () => {
  const sampleFile = 'coffee-beans.jpg';
  
  it('getFileSizeInBytes should return correct size', () => {
    // We assume the file exists in data/uploads
    const filePath = path.join('data', 'uploads', sampleFile);
    const size = getFileSizeInBytes(filePath);
    expect(typeof size).toBe('number');
    expect(size).toBeGreaterThan(0);
  });

  it('getFileData should return correct metadata', () => {
    const data = getFileData(sampleFile);
    expect(data).toHaveProperty('filepath');
    expect(data.filepath).toContain(sampleFile);
    expect(data).toHaveProperty('originalFileName', sampleFile);
    expect(data).toHaveProperty('size');
    expect(typeof data.size).toBe('number');
    expect(data).toHaveProperty('mimetype', 'image/jpeg');
  });
});
