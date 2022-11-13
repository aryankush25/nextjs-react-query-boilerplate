import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/router";
import clsx from "clsx";
import { isPresent } from "../src/utils/helpers";

import "../styles/globals.css";

const queryClient = new QueryClient();

const RoutingProgressBar = () => {
  const [width, setWidth] = useState("");
  const router = useRouter();

  useEffect(() => {
    let timeoutId1: string | number | NodeJS.Timer | null | undefined = null;
    let timeoutId2: string | number | NodeJS.Timer | null | undefined = null;

    const handleRouteChange = () => {
      setWidth("w-1");
      timeoutId1 = setTimeout(() => {
        setWidth((width) => (width === "w-full" ? width : "w-9/12"));
      }, 100);
    };

    const handleRouteChangeComplete = () => {
      setWidth("w-full");
      timeoutId2 = setTimeout(() => {
        timeoutId1 && clearInterval(timeoutId1);
        setWidth("");
      }, 500);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);

      timeoutId1 && clearInterval(timeoutId1);
      timeoutId2 && clearInterval(timeoutId2);
    };
  }, [router.events]);

  return (
    <div className="fixed w-full h-1">
      <div
        className={clsx(
          "h-1 bg-blue-600 transition-all ease-out duration-500",
          isPresent(width) ? width : "hidden"
        )}
      />
    </div>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RoutingProgressBar />

      <Component {...pageProps} />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
