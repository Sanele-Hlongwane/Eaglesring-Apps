import crypto from "crypto";

export const verifyWebhookSignature = (
  payload: Buffer,
  sig: string,
  secret: string,
) => {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return sig === expectedSignature;
};
