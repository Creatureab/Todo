"use client";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // clear auth (example)
    localStorage.removeItem("token");

    router.push("/login");
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutPage;
