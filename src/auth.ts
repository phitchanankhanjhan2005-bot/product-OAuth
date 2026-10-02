import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  // กำหนด Google เป็น Provider สำหรับ Login
  providers: [Google],

  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;

      const isProductManagementPage =
        /^\/products\/[^/]+\/(edit|delete)$/.test(pathname);

      // หน้าจัดการสินค้า ต้อง Login ก่อนจึงจะเข้าได้
      if (isProductManagementPage) {
        return Boolean(auth?.user);
      }

      return true;
    },
  },
});