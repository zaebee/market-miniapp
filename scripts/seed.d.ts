export function getFileSizeInBytes(filePath: string): number;
export function getFileData(fileName: string): {
  filepath: string;
  originalFileName: string;
  size: number;
  mimetype: string;
};
