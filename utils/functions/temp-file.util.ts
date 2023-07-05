import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class TempFileUtil {
  /**
   * Create a temporary file from a buffer and return its path.
   */
  static createTempFileFromBuffer(): string {
    const buffer = Buffer.from('Some file content', 'utf-8');
    const tempFilePath = path.join(os.tmpdir(), '' + uuidv4() + '.jpg');
    fs.writeFileSync(tempFilePath, buffer);
    return tempFilePath;
  }

  /**
   * Delete a given file.
   */
  static deleteFile(filePath: string) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete file at ${filePath}:`, err);
    }
  }
}
