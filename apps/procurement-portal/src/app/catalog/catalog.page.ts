import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  selectCatalogCreating,
  selectCatalogError,
  selectCatalogItems,
  selectCatalogLoading,
  selectCatalogSearch,
} from './state/catalog.selectors';
import { catalogActions } from './state/catalog.actions';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="catalog-layout">
      <div class="panel hero">
        <h1>Catalog Management</h1>
        <p>Manage internal procurement items from one protected workspace.</p>
      </div>

      <div class="grid">
        <section class="panel">
          <div class="panel-head">
            <h2>Items</h2>
            <input
              type="search"
              [value]="searchValue"
              (input)="search(($any($event.target).value))"
              placeholder="Search by title or category"
            />
          </div>

          <p *ngIf="loading$ | async">Loading items...</p>
          <p class="error" *ngIf="error$ | async as error">{{ error }}</p>
          <p *ngIf="!(loading$ | async) && (items$ | async)?.length === 0">No catalog items yet.</p>

          <article class="item" *ngFor="let item of paginatedItems">
            <div class="item-top">
              <h3>{{ item.title }}</h3>
              <strong>\${{ item.price }}</strong>
            </div>
            <p>{{ item.description }}</p>
            <span>{{ item.category }}</span>
          </article>

          <div class="pagination" *ngIf="(items$ | async)?.length">
            <button type="button" class="pager" (click)="changePage(-1)" [disabled]="currentPage === 1">
              Previous
            </button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button type="button" class="pager" (click)="changePage(1)" [disabled]="currentPage === totalPages">
              Next
            </button>
          </div>
        </section>

        <section class="panel create-panel">
          <h2>Create Item</h2>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <label><span>Title</span><input formControlName="title" /></label>
            <label><span>Description</span><textarea rows="4" formControlName="description"></textarea></label>
            <label><span>Category</span><input formControlName="category" /></label>
            <label><span>Price</span><input type="number" step="0.01" formControlName="price" /></label>
            <button type="submit" [disabled]="form.invalid || (creating$ | async)">
              {{ (creating$ | async) ? 'Saving...' : 'Create Item' }}
            </button>
          </form>
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .catalog-layout { display: grid; gap: 1.25rem; }
      .hero { background: linear-gradient(135deg, #0f172a, #0f766e); color: white; }
      .hero h1 { color: #000; }
      .grid { display: grid; gap: 1.25rem; grid-template-columns: 1.2fr 0.9fr; }
      .panel { padding: 1.25rem; border-radius: 1rem; background: white; box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08); overflow: hidden; }
      .create-panel { min-width: 0; }
      .panel-head { display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
      form { display: grid; gap: 0.9rem; }
      label { display: grid; gap: 0.35rem; color: #334155; }
      input, textarea { width: 100%; max-width: 100%; box-sizing: border-box; padding: 0.85rem; border: 1px solid #cbd5e1; border-radius: 0.75rem; }
      button { border: 0; padding: 0.9rem 1rem; border-radius: 0.75rem; background: #1d4ed8; color: white; cursor: pointer; }
      .item { border-top: 1px solid #e2e8f0; padding: 1rem 0; }
      .item-top { display: flex; justify-content: space-between; gap: 1rem; }
      .item span { display: inline-block; padding: 0.3rem 0.55rem; background: #e2e8f0; border-radius: 999px; color: #334155; }
      .pagination { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; }
      .pager { min-width: 6.5rem; background: #e2e8f0; color: #0f172a; }
      .pager:disabled { opacity: 0.5; cursor: not-allowed; }
      .error { color: #b91c1c; }
      @media (max-width: 860px) { .grid { grid-template-columns: 1fr; } .panel-head { flex-direction: column; align-items: stretch; } }
    `,
  ],
})
export class CatalogPageComponent {
  private readonly pageSize = 3;
  private store = inject(Store);
  private fb = inject(FormBuilder);

  items$ = this.store.select(selectCatalogItems);
  loading$ = this.store.select(selectCatalogLoading);
  creating$ = this.store.select(selectCatalogCreating);
  error$ = this.store.select(selectCatalogError);
  search$ = this.store.select(selectCatalogSearch);
  searchValue = '';
  items: {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
  }[] = [];
  paginatedItems = this.items;
  currentPage = 1;
  totalPages = 1;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    category: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0.01)]],
  });

  constructor() {
    this.search$.subscribe((value) => {
      this.searchValue = value;
    });
    this.items$.subscribe((items) => {
      this.items = items;
      this.updatePagination();
    });
    this.store.dispatch(catalogActions.loadItems({}));
  }

  search(value: string) {
    this.currentPage = 1;
    this.store.dispatch(catalogActions.setSearch({ search: value }));
    this.store.dispatch(catalogActions.loadItems({ search: value }));
  }

  changePage(direction: number) {
    const nextPage = this.currentPage + direction;
    if (nextPage < 1 || nextPage > this.totalPages) {
      return;
    }

    this.currentPage = nextPage;
    this.updatePagination();
  }

  submit() {
    const { title, description, category, price } = this.form.getRawValue();
    if (!title || !description || !category || !price) {
      return;
    }

    this.store.dispatch(
      catalogActions.createItem({
        title,
        description,
        category,
        price: Number(price),
      }),
    );
    this.form.reset({ title: '', description: '', category: '', price: 0 });
    this.currentPage = 1;
  }

  private updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.items.length / this.pageSize));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedItems = this.items.slice(start, start + this.pageSize);
  }
}
