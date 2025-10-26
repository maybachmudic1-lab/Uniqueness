import { useState, useEffect } from "react";

export function useTikTokBrowser() {
  const [isTikTok, setIsTikTok] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    
    const tiktokBrowser = /TikTok/i.test(userAgent) || 
                          /BytedanceWebview/i.test(userAgent) ||
                          /musical_ly/i.test(userAgent);
    
    setIsTikTok(tiktokBrowser);
    setIsLoading(false);
  }, []);

  return { isTikTok, isLoading };
}
