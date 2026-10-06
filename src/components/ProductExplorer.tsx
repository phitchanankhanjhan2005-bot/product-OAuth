"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "@/lib/products";

// สถานะของการโหลดข้อมูล
type LoadState = "loading" | "error" | "ready";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => void | Promise<void>;
};

// ฟอร์มค้นหาสินค้า
function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minStock, setMinStock] = useState("");

  // ส่งเงื่อนไขการค้นหา
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    void onSearch({
      ...defaultQuery,
      q: search.trim() || "",
      category: category || "",
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minStock: minStock ? Number(minStock) : undefined,
    });
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          ค้นหาชื่อสินค้า
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </label>

        <label>
          หมวดหมู่
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            <option value="">ทั้งหมด</option>
            <option value="beauty">beauty</option>
            <option value="fragrances">fragrances</option>
            <option value="furniture">furniture</option>
            <option value="groceries">groceries</option>
            <option value="home-decoration">
              home-decoration
            </option>
            <option value="kitchen-accessories">
              kitchen-accessories
            </option>
            <option value="laptops">laptops</option>
            <option value="mens-shirts">mens-shirts</option>
            <option value="mens-shoes">mens-shoes</option>
            <option value="mens-watches">mens-watches</option>
            <option value="mobile-accessories">
              mobile-accessories
            </option>
            <option value="motorcycle">motorcycle</option>
            <option value="skin-care">skin-care</option>
            <option value="smartphones">smartphones</option>
            <option value="sports-accessories">
              sports-accessories
            </option>
            <option value="sunglasses">sunglasses</option>
            <option value="tablets">tablets</option>
            <option value="vehicle">vehicle</option>
            <option value="womens-bags">womens-bags</option>
            <option value="womens-dresses">
              womens-dresses
            </option>
            <option value="womens-jewellery">
              womens-jewellery
            </option>
            <option value="womens-shoes">womens-shoes</option>
            <option value="womens-watches">
              womens-watches
            </option>
          </select>
        </label>

        <label>
          ราคาเริ่มต้น
          <input
            type="number"
            value={minPrice}
            onChange={(event) =>
              setMinPrice(event.target.value)
            }
          />
        </label>

        <label>
          ราคาสูงสุด
          <input
            type="number"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(event.target.value)
            }
          />
        </label>

        <label>
          จำนวนคงเหลือขั้นต่ำ
          <input
            type="number"
            value={minStock}
            onChange={(event) =>
              setMinStock(event.target.value)
            }
          />
        </label>
      </div>

      <button type="submit">ค้นหา</button>
    </form>
  );
}

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

// ฟอร์มเพิ่มและแก้ไขสินค้า
function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const [draft, setDraft] = useState<ProductDraft>({
    title: "",
    price: 0,
    stock: 0,
    category: "beauty",
    description: "",
    brand: "",
    thumbnail: "",
    images: [],
  });

  // โหลดข้อมูลเดิมเมื่อเลือกแก้ไข
  useEffect(() => {
    if (editing) {
      setDraft({
        title: editing.title,
        price: editing.price,
        stock: editing.stock,
        category: editing.category,
        description: editing.description ?? "",
        brand: editing.brand ?? "",
        thumbnail: editing.thumbnail ?? "",
        images: editing.images ?? [],
      });
      return;
    }

    setDraft({
      title: "",
      price: 0,
      stock: 0,
      category: "beauty",
      description: "",
      brand: "",
      thumbnail: "",
      images: [],
    });
  }, [editing]);

  // อัปเดตข้อมูลในฟอร์ม
  function updateField<K extends keyof ProductDraft>(
    field: K,
    value: ProductDraft[K]
  ) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // ส่งข้อมูลสินค้าไปบันทึก
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>
        {editing ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
      </h2>

      <div className="form-grid">
        <label>
          ชื่อสินค้า
          <input
            type="text"
            value={draft.title}
            onChange={(event) =>
              updateField("title", event.target.value)
            }
          />
        </label>

        <label>
          ราคา
          <input
            type="number"
            value={draft.price}
            onChange={(event) =>
              updateField(
                "price",
                Number(event.target.value)
              )
            }
          />
        </label>

        <label>
          จำนวนคงเหลือ
          <input
            type="number"
            value={draft.stock}
            onChange={(event) =>
              updateField(
                "stock",
                Number(event.target.value)
              )
            }
          />
        </label>

        <label>
          หมวดหมู่
          <select
            value={draft.category}
            onChange={(event) =>
              updateField(
                "category",
                event.target.value as ProductDraft["category"]
              )
            }
          >
            <option value="beauty">beauty</option>
            <option value="fragrances">fragrances</option>
            <option value="furniture">furniture</option>
            <option value="groceries">groceries</option>
            <option value="home-decoration">
              home-decoration
            </option>
            <option value="kitchen-accessories">
              kitchen-accessories
            </option>
            <option value="laptops">laptops</option>
            <option value="mens-shirts">mens-shirts</option>
            <option value="mens-shoes">mens-shoes</option>
            <option value="mens-watches">mens-watches</option>
            <option value="mobile-accessories">
              mobile-accessories
            </option>
            <option value="motorcycle">motorcycle</option>
            <option value="skin-care">skin-care</option>
            <option value="smartphones">smartphones</option>
            <option value="sports-accessories">
              sports-accessories
            </option>
            <option value="sunglasses">sunglasses</option>
            <option value="tablets">tablets</option>
            <option value="vehicle">vehicle</option>
            <option value="womens-bags">womens-bags</option>
            <option value="womens-dresses">
              womens-dresses
            </option>
            <option value="womens-jewellery">
              womens-jewellery
            </option>
            <option value="womens-shoes">womens-shoes</option>
            <option value="womens-watches">
              womens-watches
            </option>
          </select>
        </label>

        <label>
          แบรนด์
          <input
            type="text"
            value={draft.brand ?? ""}
            onChange={(event) =>
              updateField("brand", event.target.value)
            }
          />
        </label>

        <label className="full-width">
          รายละเอียด
          <textarea
            value={draft.description ?? ""}
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
          />
        </label>

        <label className="full-width">
          URL รูปภาพหลัก
          <input
            type="url"
            value={draft.thumbnail ?? ""}
            onChange={(event) =>
              updateField(
                "thumbnail",
                event.target.value
              )
            }
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit">
          {editing
            ? "บันทึกการแก้ไข"
            : "เพิ่มสินค้า"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancel}
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}

// รับสถานะ Login จากหน้าหลัก
type ProductExplorerProps = {
  isLoggedIn: boolean;
};

export default function ProductExplorer({
  isLoggedIn,
}: ProductExplorerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] =
    useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  // แสดงผลข้อมูลสินค้าที่โหลดสำเร็จ
  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");

    console.log(
      `พบข้อมูลสินค้า ${list.products.length} รายการ`
    );
    console.log("ข้อมูลสินค้า", list.products);
  }

  // จัดการเมื่อโหลดข้อมูลไม่สำเร็จ
  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "เรียกข้อมูลไม่สำเร็จ"
    );

    setStatus("error");
    console.error(
      "เรียกข้อมูลไม่สำเร็จ",
      error
    );
  }

  // โหลดสินค้าเริ่มต้น
  useEffect(() => {
    fetchProducts(defaultQuery)
      .then(showResult)
      .catch(showError);
  }, []);

  // ค้นหาและกรองสินค้าตามเงื่อนไข
  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");

    try {
      const result = await fetchProducts(query);

      const filteredProducts =
        result.products.filter((item) => {
          if (
            query.category &&
            item.category !== query.category
          ) {
            return false;
          }

          if (
            query.minPrice !== undefined &&
            item.price < query.minPrice
          ) {
            return false;
          }

          if (
            query.maxPrice !== undefined &&
            item.price > query.maxPrice
          ) {
            return false;
          }

          if (
            query.minStock !== undefined &&
            item.stock < query.minStock
          ) {
            return false;
          }

          return true;
        });

      showResult({
        ...result,
        products: filteredProducts,
      });
    } catch (error) {
      showError(error);
    }
  }

  // เพิ่มหรือแก้ไขสินค้า
  function saveProduct(draft: ProductDraft) {
    if (!isLoggedIn) {
      return;
    }

    if (editingProduct) {
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? {
                ...draft,
                id: editingProduct.id,
              }
            : product
        )
      );

      setEditingProduct(null);
      return;
    }

    setProducts([
      ...products,
      {
        ...draft,
        id: Date.now(),
      },
    ]);
  }

  // ลบสินค้า
  function removeProduct(id: number) {
    if (!isLoggedIn) {
      return;
    }

    setProducts(
      products.filter(
        (product) => product.id !== id
      )
    );

    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
  }

  return (
    <main className="product-page">
      <header className="page-header">
        <h1>รายการสินค้า</h1>

        <p>
          {isLoggedIn
            ? "ค้นหา เพิ่ม แก้ไข และลบสินค้า"
            : "ค้นหาสินค้า"}
        </p>
      </header>

      {/* ทุกคนสามารถค้นหาได้ */}
      <ProductSearchForm onSearch={loadProducts} />

      {/* แสดงฟอร์มเฉพาะผู้ที่ Login */}
      {isLoggedIn && (
        <ProductForm
          editing={editingProduct}
          onSave={saveProduct}
          onCancel={() =>
            setEditingProduct(null)
          }
        />
      )}

      <section aria-live="polite">
        {status === "loading" && (
          <p className="message">
            กำลังโหลดข้อมูล...
          </p>
        )}

        {status === "error" && (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        )}

        {status === "ready" &&
          products.length === 0 && (
            <p className="message">
              ไม่พบสินค้าที่ตรงกับเงื่อนไข
            </p>
          )}

        {status === "ready" &&
          products.length > 0 && (
            <>
              <h2 className="result-title">
                สินค้า {products.length} รายการ
              </h2>

              <div className="product-grid">
                {products.map((item) => (
                  <article
                    className="product-card"
                    key={item.id}
                  >
                    <div className="product-image">
                      {item.images?.[0] ||
                      item.thumbnail ? (
                        <img
                          src={
                            item.images?.[0] ??
                            item.thumbnail
                          }
                          alt={item.title}
                        />
                      ) : (
                        <span>ไม่มีรูปภาพ</span>
                      )}
                    </div>

                    <div className="product-info">
                      <h3>{item.title}</h3>

                      <span className="category">
                        {item.category}
                      </span>

                      <div className="product-details">
                        <p>
                          <strong>ราคา:</strong>{" "}
                          {item.price}
                        </p>

                        <p>
                          <strong>คงเหลือ:</strong>{" "}
                          {item.stock}
                        </p>
                      </div>

                      {/* ปุ่มแก้ไข/ลบเฉพาะตอน Login */}
                      {isLoggedIn && (
                        <div className="product-actions">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProduct(item)
                            }
                          >
                            แก้ไข
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeProduct(item.id)
                            }
                          >
                            ลบ
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
      </section>
    </main>
  );
}