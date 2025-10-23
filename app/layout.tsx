import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import "react-datepicker/dist/react-datepicker.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <ClerkProvider
        appearance={{
          layout: {
            socialButtonsVariant: "iconButton",
            logoImageUrl: "/icon.png",
          },
          variables: {
            colorText: "#E0E0E0",
            colorPrimary: "#1E90FF",
            colorBackground: "#1C1F2E",
            colorInputBackground: "#333333",
            colorInputText: "#E0E0E0",
            colorTextOnPrimaryBackground: "#FFFFFF",
            colorTextSecondary: "#87CEEB",
            colorDanger: "#FF6347",
            colorWarning: "#FFA500",
            colorNeutral: "#CCCCCC",
            colorSuccess: "#32CD32",
            colorShimmer: "#444444",
          },
          elements: {
            formButtonPrimary:
              "bg-blue-600 text-white border border-blue-800 hover:bg-blue-700 hover:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg px-4 py-2 transition duration-300 ease-in-out",
            formButtonSecondary:
              "bg-gray-600 text-gray-200 border border-gray-700 hover:bg-gray-700 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg px-4 py-2 transition duration-300 ease-in-out",
            formInput:
              "border border-gray-500 p-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400",
            formLink: "text-blue-600 hover:underline hover:text-blue-400",
            formError: "text-red-500 font-bold",
            formSuccess: "text-green-500 font-bold",
            formLabel: "text-gray-200 font-medium",
            formContainer: "bg-gray-800 p-6 rounded-lg shadow-lg",
            formHeading: "text-blue-600 text-2xl font-extrabold",
            formFooter: "text-gray-400 text-sm",
            formRadio: "text-blue-600 checked:bg-blue-600",
            formCheckbox: "text-blue-600 checked:bg-blue-600",
            formTooltip: "bg-gray-700 text-white p-2 rounded-lg shadow-lg",
            formLoader:
              "border-t-4 border-blue-600 border-solid rounded-full w-12 h-12 animate-spin",
          },
        }}
      >
        <head />
        <body
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-white">
              <main>
                <Toaster />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  closeOnClick
                  pauseOnHover
                  draggable
                  pauseOnFocusLoss
                />
                {children}
              </main>
            </div>
          </Providers>
        </body>
      </ClerkProvider>
    </html>
  );
}
