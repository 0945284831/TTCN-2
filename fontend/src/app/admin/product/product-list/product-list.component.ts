
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ProductService, Product } from "../../../../assets/service/product.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Danh sách sản phẩm';
  imageWidth = 100;
  imageHeight = 100;
  imageMargin = 10;
  errorMessage = '';
  sub!: Subscription;

  private _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.performFilter(value);
  }

  filteredProducts: Product[] = [];
  products: Product[] = [];

  constructor(private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {}

  performFilter(filterBy: string): Product[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: Product) =>
      product.productName.toLocaleLowerCase().includes(filterBy));
  }



  ngOnInit(): void {
    this.sub = this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.filteredProducts = this.products;
      },
      error: err => this.errorMessage = err
    });
  }

  onAddProductClick() {
    // Chuyển hướng đến trang thêm sản phẩm
    this.router.navigate(['add'], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onRatingClicked(message: string): void {
    this.pageTitle = 'Product List: ' + message;
  }

  visible: boolean = false;

  position: string = 'center';

  // showDialog(position: string) {
  //       this.position = position;
  //       this.visible = true;
  //   }

     // Assuming filteredProducts is an array of products
    dialogVisibilities: boolean[] = [];
  
    // Other component logic...
  
    showDialog(index: number) {
      this.dialogVisibilities[index] = true;
    }
  
    hideDialog(index: number) {
      this.dialogVisibilities[index] = false;
    }
}