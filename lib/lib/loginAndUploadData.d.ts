interface TPostData2 {
    computerTime?: string;
    time?: string;
    deviceTime?: string;
    client?: {
        private?: {
            blobId?: string;
        };
    };
}
interface TPostData1 {
}
export declare function loginAndCreatePost(username: string, password: string, baseUrl: string, postData: TPostData1, dataSet: TPostData2, userId: string): Promise<unknown | null>;
export {};
