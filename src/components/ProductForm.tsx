"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import type {
  Product,
  ProductDraft,
} from "@/lib/products";

// Props ที่ใช้ส่งข้อมูลระหว่าง Form กับ Explorer
type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

// ฟอร์มสำหรับเพิ่มและแก้ไขสินค้า
export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  // เก็บข้อมูลสินค้าที่กำลังกรอกในฟอร์ม
  const [draft, setDraft] =
    useState<ProductDraft>({
      title: "",
      price: 0,
      stock: 0,
      category: "beauty",
      description: "",
      brand: "",
      thumbnail: "",
      images: [],
    });

  // เมื่อเลือกสินค้าเพื่อแก้ไข จะนำข้อมูลเดิมมาแสดง
  useEffect(() => {
    if (editing) {
      setDraft({
        title: editing.title,
        price: editing.price,
        stock: editing.stock,
        category: editing.category,
        description:
          editing.description ?? "",
        brand: editing.brand ?? "",
        thumbnail:
          editing.thumbnail ?? "",
        images: editing.images ?? [],
      });
      return;
    }

    // ถ้าไม่ได้แก้ไข ให้รีเซ็ตเป็นฟอร์มเพิ่มสินค้า
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

  // อัปเดตค่าของแต่ละช่องในฟอร์ม
  function updateField<K extends keyof ProductDraft>(
    field: K,
    value: ProductDraft[K]
  ) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // ส่งข้อมูลฟอร์มไปบันทึก
  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
    >
      <h2>
        {editing
          ? "แก้ไขสินค้า"
          : "เพิ่มสินค้า"}
      </h2>

      <div className="form-grid">
        <label>
          ชื่อสินค้า
          <input
            type="text"
            value={draft.title}
            onChange={(event) =>
              updateField(
                "title",
                event.target.value
              )
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
            <option value="beauty">
              beauty
            </option>
            <option value="fragrances">
              fragrances
            </option>
            <option value="furniture">
              furniture
            </option>
            <option value="groceries">
              groceries
            </option>
            <option value="home-decoration">
              home-decoration
            </option>
            <option value="kitchen-accessories">
              kitchen-accessories
            </option>
            <option value="laptops">
              laptops
            </option>
            <option value="mens-shirts">
              mens-shirts
            </option>
            <option value="mens-shoes">
              mens-shoes
            </option>
            <option value="mens-watches">
              mens-watches
            </option>
            <option value="mobile-accessories">
              mobile-accessories
            </option>
            <option value="motorcycle">
              motorcycle
            </option>
            <option value="skin-care">
              skin-care
            </option>
            <option value="smartphones">
              smartphones
            </option>
            <option value="sports-accessories">
              sports-accessories
            </option>
            <option value="sunglasses">
              sunglasses
            </option>
            <option value="tablets">
              tablets
            </option>
            <option value="womens-bags">
              womens-bags
            </option>
            <option value="womens-dresses">
              womens-dresses
            </option>
            <option value="womens-jewellery">
              womens-jewellery
            </option>
            <option value="womens-shoes">
              womens-shoes
            </option>
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
              updateField(
                "brand",
                event.target.value
              )
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