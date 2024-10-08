import { ChangeEvent, useCallback, useRef, useState } from "react";
import { debounce } from "../../utils/deboucne";
import { fetchData } from "../../utils/fetch-data";
export const useInput = () => {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>();
    const [ result, setResult ] = useState<string[]>();
    const lastPromise = useRef<Promise<string[]>>();

    const ignoreRequest = (promise: Promise<string[]>) => {
        return lastPromise.current !== promise;
      }
    const handleResponse = useCallback((promise: Promise<string[]>, callback: () => void) => {
        if(ignoreRequest(promise)) return;
        callback();
        setLoading(false);
        lastPromise.current = undefined;
    }, [lastPromise]);
    const onChange = useCallback(debounce(async (e: ChangeEvent) => {
        const value = (e.target as HTMLInputElement).value;
        setLoading(true);
        setError("");
        setResult([]);
        let promise = fetchData(value);
        lastPromise.current = promise;
        promise
            .then(data => {
                handleResponse(promise, () => setResult(data));
            })
            .catch(err => {
                handleResponse(promise, () => setError((err as string)));
            })
        }, 100),
        []
    );
    return {
        loading, error, result,
        onChange
    }
}