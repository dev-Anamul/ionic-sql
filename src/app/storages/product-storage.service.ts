import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { SQLiteService } from '../services/sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class ProductStorageService {
  public productList: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >([]);
  private databaseName: string = 'myuserdb';
  private db!: SQLiteDBConnection;
  private isProductReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqliteService: SQLiteService) {
    this.initializeDatabase().then(() => {
      console.log('ProductStorageService initialized');
    });
  }

  async initializeDatabase() {
    try {
      // create and/or open the database
      this.db = await this.sqliteService.retrieveConnection(
        this.databaseName,
        false
      );

      await this.db.execute(
        `CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, description TEXT, active INTEGER DEFAULT 1);`
      );
      await this.getProducts();
    } catch (error) {
      console.log('database init', error);
    }
  }
  productState() {
    return this.isProductReady.asObservable();
  }
  fetchProducts(): Observable<Product[]> {
    return this.productList.asObservable();
  }

  async loadProducts() {
    const products: Product[] = (await this.db.query('SELECT * FROM products;'))
      .values as Product[];
    this.productList.next(products);
  }
  async getProducts() {
    await this.loadProducts();
    this.isProductReady.next(true);
  }
  async addProduct(name: string, price: number, description: string) {
    const sql = `INSERT INTO products (name, price, description) VALUES (?, ?, ?);`;
    await this.db.run(sql, [name, price, description]);
    await this.getProducts();
  }

  async updateProductById(id: string, active: number) {
    const sql = `UPDATE products SET active=${active} WHERE id=${id}`;
    await this.db.run(sql);
    await this.getProducts();
  }
  async deleteProductById(id: string) {
    const sql = `DELETE FROM products WHERE id=${id}`;
    await this.db.run(sql);
    await this.getProducts();
  }
}
