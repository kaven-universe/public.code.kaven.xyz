import { toDataURL } from "qrcode";

export async function GenerateQRCode(
    data: string,
    /**
     * QR Code version. If not specified the more suitable value will be calculated.
     */
    version?: number,
    /**
     * Error correction level.
     * Possible values are low, medium, quartile, high or L, M, Q, H.
     * Default: M
     */
    errorCorrectionLevel?:
        | "low"
        | "medium"
        | "quartile"
        | "high"
        | "L"
        | "M"
        | "Q"
        | "H",
    /**
     * Helper function used internally to convert a kanji to its Shift JIS value.
     * Provide this function if you need support for Kanji mode.
     */
    toSJISFunc?: (codePoint: string) => number,
) {
    return toDataURL(data, {
        errorCorrectionLevel,
        toSJISFunc,
        version,
    });
}