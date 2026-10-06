import { z } from "zod";

// -------------------- Demo Product --------------------

type DemoProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
};

const initialProducts: DemoProduct[] = [
  {
    id: "p001",
    name: "Mechanical Keyboard",
    price: 2590,
    description: "คีย์บอร์ด Mechanical สำหรับทำงานและเล่นเกม",
  },
  {
    id: "p002",
    name: "Wireless Mouse",
    price: 1290,
    description: "เมาส์ไร้สาย น้ำหนักเบา",
  },
  {
    id: "p003",
    name: "USB-C Hub",
    price: 1890,
    description: "USB-C Hub พร้อม HDMI และ Card Reader",
  },
];

// เก็บข้อมูล demo ไว้ใน global ตอน development
declare global {
  // eslint-disable-next-line no-var
  var demoProducts: DemoProduct[] | undefined;
}

const products =
  globalThis.demoProducts ?? structuredClone(initialProducts);

if (process.env.NODE_ENV !== "production") {
  globalThis.demoProducts = products;
}

// CRUD สำหรับข้อมูล demo
export function getProducts() {
  return products;
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function updateProduct(
  id: string,
  values: Pick<DemoProduct, "name" | "price" | "description">
) {
  const product = getProduct(id);

  if (!product) {
    throw new Error("Product not found");
  }

  product.name = values.name;
  product.price = values.price;
  product.description = values.description;
}

export function deleteProduct(id: string) {
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error("Product not found");
  }

  products.splice(index, 1);
}


// -------------------- Product Schema --------------------

// รายการหมวดหมู่ที่ API รองรับ
export const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
] as const;

// กำหนดและตรวจสอบรูปแบบข้อมูล Product
export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1, "กรุณากรอกชื่อสินค้า"),
  price: z.number({ error: "กรุณากรอกราคา" }).min(0, "ราคาต้องไม่ติดลบ"),
  stock: z
    .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
    .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  category: z.enum(CATEGORIES, {
    error: "กรุณาเลือกหมวดหมู่",
  }),
  description: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  thumbnail: z.string().trim().url("กรุณากรอก URL รูปภาพ").optional(),
  images: z.array(z.string().trim().url("กรุณากรอก URL รูปภาพ")).optional(),
});

// Schema สำหรับข้อมูลที่ใช้สร้าง/แก้ไขสินค้า
export const ProductDraftSchema = ProductSchema.omit({
  id: true,
});

export type ProductDraft = z.infer<typeof ProductDraftSchema>;


// -------------------- Search --------------------

// รูปแบบข้อมูลที่ API ส่งกลับมา
export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;

const API_BASE = "https://dummyjson.com";

// field ที่ใช้เรียงสินค้า
export const SORT_FIELDS = ["title", "price", "stock"] as const;

// รูปแบบค่าที่ใช้ค้นหา/กรองสินค้า
export const SearchQuerySchema = z.object({
  q: z.string().trim(),
  limit: z
    .number({ error: "กรุณากรอกจำนวนรายการ" })
    .int()
    .min(1)
    .max(30),
  sortBy: z.enum(SORT_FIELDS),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minStock: z.number().optional(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export const defaultQuery: SearchQuery = {
  q: "",
  limit: 30,
  sortBy: "title",
  category: "",
  minPrice: undefined,
  maxPrice: undefined,
  minStock: undefined,
};


// สร้าง URL สำหรับเรียก API
export function buildProductUrl(query: SearchQuery): string {
  const params = new URLSearchParams();

  params.set("q", query.q);
  params.set("limit", String(query.limit));
  params.set("sortBy", query.sortBy);
  params.set("order", "asc");
  params.set(
    "select",
    "id,title,price,stock,category,thumbnail,images"
  );

  return `${API_BASE}/products/search?${params.toString()}`;
}


// เรียก API และตรวจสอบข้อมูลที่ได้ด้วย Zod
export async function fetchProducts(
  query: SearchQuery
): Promise<ProductList> {
  const response = await fetch(buildProductUrl(query));

  if (!response.ok) {
    throw new Error(
      `เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status}`
    );
  }

  const data = await response.json();

  // เช็กว่าข้อมูลจาก API ตรงตาม Schema หรือไม่
  const result = ProductListSchema.safeParse(data);

  if (!result.success) {
    throw new Error(
      "รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้"
    );
  }

  return result.data;
}