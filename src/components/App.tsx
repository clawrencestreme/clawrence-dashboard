"use client";

import { useEffect } from "react";
import { useMiniApp } from "@neynar/react";
import { HomeTab } from "~/components/ui/tabs";

export interface AppProps {
  title?: string;
}

export default function App({ title }: AppProps = { title: "Clawrence Dashboard" }) {
  const { isSDKLoaded, context, setInitialTab } = useMiniApp();

  useEffect(() => {
    if (isSDKLoaded) {
      setInitialTab("home");
    }
  }, [isSDKLoaded, setInitialTab]);

  if (!isSDKLoaded) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-500/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-amber-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-zinc-900"
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="container py-4">
        <HomeTab />
      </div>
    </div>
  );
}
