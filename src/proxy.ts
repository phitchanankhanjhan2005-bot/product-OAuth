// เติม: ชื่อที่ Next 16 ใช้ปกป้องเส้นทาง แทน middleware เดิม 
export const auth = async (..._args: any[]) => {
  return undefined;
};

export { auth as proxy };

export const config = {
  matcher: ["/products/:id/edit", "/products/:id/delete"],
}; 