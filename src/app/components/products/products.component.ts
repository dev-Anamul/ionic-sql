import { Component, OnInit } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductStorageService } from 'src/app/storages/product-storage.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true,
})
export class ProductsComponent implements OnInit {
  name: string = '';
  price: number = 0;
  description: string = '';
  productList: Product[] = [];
  isWeb: any;

  constructor(
    private productStorageService: ProductStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    try {
      this.productStorageService
        .productState()
        .pipe(
          switchMap((res) => {
            if (res) {
              return this.productStorageService.fetchProducts();
            } else {
              return of([]); // Return an empty array when res is false
            }
          })
        )
        .subscribe((data) => {
          this.productList = data; // Update the user list when the data changes
        });
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  toUser() {
    this.router.navigate(['/home']);
  }

  async createProduct() {
    await this.productStorageService.addProduct(
      this.name,
      this.price,
      this.description
    );
    this.name = '';
    this.price = 0;
    this.description = '';
  }

  async deleteProduct(product: Product) {
    await this.productStorageService.deleteProductById(product.id.toString());
  }
}
