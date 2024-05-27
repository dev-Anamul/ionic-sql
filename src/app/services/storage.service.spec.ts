import { DbnameVersionService } from './dbname-version.service';
import { SQLiteService } from './sqlite.service';
import { StorageService } from './storage.service';
describe('StorageService', () => {
  it('should create an instance', () => {
    const sqliteService = new SQLiteService();
    const dbVerService = new DbnameVersionService();
    expect(new StorageService(sqliteService, dbVerService)).toBeTruthy();
  });
});
