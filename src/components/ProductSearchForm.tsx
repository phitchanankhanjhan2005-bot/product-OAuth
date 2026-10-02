"use client";

import { useForm } from "react-hook-form";
import type { FieldErrors, Resolver } from "react-hook-form";
import {
  CATEGORIES,
  SORT_FIELDS,
  SearchQuerySchema,
  defaultQuery,
} from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

const searchQueryResolver: Resolver<SearchQuery> = (values) => {
  const result = SearchQuerySchema.safeParse(values);

  if (result.success) {
    return {
      values: result.data,
      errors: {},
    };
  }

  const errors = result.error.issues.reduce<
    Record<string, { type: string; message: string }>
  >((acc, issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName === "string") {
      acc[fieldName] = {
        type: issue.code,
        message: issue.message,
      };
    }

    return acc;
  }, {});

  return {
    values: {},
    errors: errors as FieldErrors<SearchQuery>,
  };
};

// Props สำหรับส่งข้อมูลการค้นหาไปยัง Explorer
type ProductSearchFormProps = {
  onSearch: (
    query: SearchQuery
  ) => Promise<void>;
};

// ฟอร์มสำหรับค้นหาและกรองสินค้า
export default function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {
  // จัดการค่าฟอร์ม ตรวจสอบข้อมูล และส่งข้อมูลไปค้นหา
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<SearchQuery>({
    resolver: searchQueryResolver,
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <form
      className="search-form"
      onSubmit={handleSubmit(onSearch)}
    >
      <h2>ค้นหาสินค้า</h2>

      <div className="search-grid">
        <label>
          ค้นหาชื่อสินค้า
          <input
            id="q"
            {...register("q")}
            placeholder="เช่น phone"
          />
        </label>

        <label>
          หมวดหมู่
          <select
            id="category"
            {...register("category")}
          >
            <option value="">
              ทุกหมวดหมู่
            </option>

            {CATEGORIES.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          ราคาต่ำสุด
          <input
            id="minPrice"
            type="number"
            min="0"
            {...register("minPrice", {
              setValueAs: (value: string) =>
                value === ""
                  ? undefined
                  : Number(value),
            })}
          />
        </label>

        <label>
          ราคาสูงสุด
          <input
            id="maxPrice"
            type="number"
            min="0"
            {...register("maxPrice", {
              setValueAs: (value: string) =>
                value === ""
                  ? undefined
                  : Number(value),
            })}
          />
        </label>

        <label>
          จำนวนคงเหลือขั้นต่ำ
          <input
            id="minStock"
            type="number"
            min="0"
            {...register("minStock", {
              setValueAs: (value: string) =>
                value === ""
                  ? undefined
                  : Number(value),
            })}
          />
        </label>

        <label>
          จำนวนรายการ
          <input
            id="limit"
            type="number"
            {...register("limit", {
              valueAsNumber: true,
            })}
            aria-invalid={!!errors.limit}
          />

          {errors.limit && (
            <span
              className="form-error"
              role="alert"
            >
              {errors.limit.message}
            </span>
          )}
        </label>

        <label>
          เรียงตาม
          <select
            id="sortBy"
            {...register("sortBy")}
          >
            {SORT_FIELDS.map((field) => (
              <option
                key={field}
                value={field}
              >
                {field}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className="search-button"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "กำลังค้นหา..."
          : "ค้นหา"}
      </button>
    </form>
  );
}