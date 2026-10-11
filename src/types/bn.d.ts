// Minimal type declaration for sha.js (browserify crypto stream).
declare module 'sha.js' {
  interface Hash {
    update(data: string | Uint8Array, encoding?: string): Hash;
    digest(encoding?: string): Uint8Array | Buffer;
  }
  function sha(alg: string): Hash;
  export default sha;
}
declare module 'bn.js' {
  class BN {
    constructor(value: number | string | Uint8Array | number[] | { toString(): string }, radix?: string, endian?: string);
    toString(radix?: number | string, endian?: string, length?: number): string;
    toArrayLike(ArrayType: any, endian?: string, length?: number): Uint8Array;
    toBuffer(endian?: string, length?: number): Buffer;
    toNumber(): number;
    eq(other: BN | number): boolean;
    isZero(): boolean;
    cmp(other: BN): number;
    add(other: BN): BN;
    sub(other: BN): BN;
    mul(other: BN): BN;
    div(other: BN): BN;
    mod(other: BN): BN;
    neg(): BN;
    abs(): BN;
  }
  export { BN as default, BN };
}