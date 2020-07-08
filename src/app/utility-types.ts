export declare type NormalizedType<T> = {
    [P in keyof T]:
    T[P] extends boolean | string | number | Array<boolean | string | number>
    ? T[P]
    : T[P] extends Array<any> ? number[] : number
};
