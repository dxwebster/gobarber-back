export default interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(flie: string): Promise<void>;
}
