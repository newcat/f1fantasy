import axios from "axios";

export class Request {

    private readonly axiosInstance = axios.create({
        baseURL: "https://ergast.com/api/f1/"
    });

    private lastRequest?: number;

    private waitThrottle(): Promise<void> {
        return new Promise((res, rej) => {
            const updateLastRequest = () => { this.lastRequest = Date.now(); };
            if (!this.lastRequest || (Date.now() - this.lastRequest) > 1000) {
                updateLastRequest();
                res();
            } else {
                 setTimeout(() => {
                    updateLastRequest();
                    res();
                }, 1000 - Date.now() + this.lastRequest);
            }
        });
    }

}

export const RequestInstance = new Request();
