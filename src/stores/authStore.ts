import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, JwtPayload } from "@/types/auth.types";

function parseJwt(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setAccessToken: (token: string) => {
        const payload = parseJwt(token);
        if (payload) {
          set({
            accessToken: token,
            user: {
              _id: "",
              id: payload.id,
              email: payload.email,
              role: payload.role as User["role"],
              status: "active",
              isDeleted: false,
              isVerified: true,
              createdAt: "",
              updatedAt: "",
            },
            isAuthenticated: true,
          });
        }
      },

      logout: () => {
        set({ accessToken: null, user: null, isAuthenticated: false });
      },

      initialize: () => {
        const { accessToken } = get();
        if (accessToken) {
          const payload = parseJwt(accessToken);
          if (payload && payload.exp * 1000 > Date.now()) {
            set({
              user: {
                _id: "",
                id: payload.id,
                email: payload.email,
                role: payload.role as User["role"],
                status: "active",
                isDeleted: false,
                isVerified: true,
                createdAt: "",
                updatedAt: "",
              },
              isAuthenticated: true,
            });
          } else {
            set({ accessToken: null, user: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: "cu-auth",
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);
