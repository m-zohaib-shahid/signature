import React from "react";

export const metadata = {
  title: "Signature Intelligence Studio",
  description: "YOLOX-S ONNX Signature Detection & Verification Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}