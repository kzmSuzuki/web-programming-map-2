// src/hooks/useJsonp.ts
import { useEffect, useState } from "react";
import jsonp from "jsonp";
import type { Data } from "../types/types";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwFjUggx5VeCi2Rm5vMg6JF2R6z0NC87kCFdj42-zwe54e7ceA6vGfR42aKrtmLqZCTlg/exec";

const useJsonp = (email: string) => {
  const [data, setData] = useState<Data[] | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const url = `${GAS_URL}?email=${encodeURIComponent(email)}`;
    jsonp(
      url,
      { param: "callback", timeout: 20000 },
      (err: Error | null, result: Data[]) => {
        if (err) {
          setError(err);
        } else {
          setData(result);
        }
      }
    );
  }, [email]);

  return { data, error };
};

export default useJsonp;
