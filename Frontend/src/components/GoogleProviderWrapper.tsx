"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

const Client_ID = process.env.NEXT_PUBLIC_Client_ID || "";

export default function GoogleProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GoogleOAuthProvider clientId={Client_ID}>{children}</GoogleOAuthProvider>;
}
