import { signIn, signOut } from "../auth";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  userName?: string | null;
};

export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) {
  // ถ้า Login แล้ว ให้แสดงชื่อและปุ่ม Logout
  if (isLoggedIn) {
    return (
      <div>
        <span>สวัสดี {userName ?? "ผู้ใช้งาน"}</span>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit">Logout</button>
        </form>
      </div>
    );
  }

  // ถ้ายังไม่ Login ให้แสดงปุ่ม Login ด้วย Google
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <button type="submit">Login with Google</button>
    </form>
  );
}