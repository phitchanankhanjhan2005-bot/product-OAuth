import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  providers: [Google],

  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;

      // หน้าจัดการสินค้า
      const isProductManagementPage =
        /^\/products\/[^/]+\/(edit|delete)$/.test(pathname);

      // ถ้ายังไม่ได้ Login ห้ามเข้าแก้ไข/ลบ
      if (isProductManagementPage) {
        return Boolean(auth?.user);
      }

      // หน้าอื่น ๆ เช่น ค้นหาสินค้า เข้าได้โดยไม่ต้อง Login
      return true;
    },
  },
});