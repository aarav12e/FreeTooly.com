// MD5 implementation written directly from the published algorithm
// specification (message padding + 64-round compression using the
// standard per-round shift table and sine-derived constants).
export function md5(input) {
  const K = [];
  for (let i = 0; i < 64; i += 1) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32);
  }

  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  function leftRotate(x, c) {
    return (x << c) | (x >>> (32 - c));
  }

  function add32(a, b) {
    return (a + b) | 0;
  }

  function padMessage(bytes) {
    const bitLen = bytes.length * 8;
    const out = bytes.slice();
    out.push(0x80);
    while (out.length % 64 !== 56) out.push(0);
    for (let i = 0; i < 8; i += 1) {
      out.push(Math.floor(bitLen / 2 ** (8 * i)) & 0xff);
    }
    return out;
  }

  const messageBytes = Array.from(new TextEncoder().encode(input));
  const bytes = padMessage(messageBytes);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const chunkCount = bytes.length / 64;

  for (let chunk = 0; chunk < chunkCount; chunk += 1) {
    const M = new Array(16);
    for (let j = 0; j < 16; j += 1) {
      const offset = chunk * 64 + j * 4;
      M[j] =
        bytes[offset] |
        (bytes[offset + 1] << 8) |
        (bytes[offset + 2] << 16) |
        (bytes[offset + 3] << 24);
    }

    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;

    for (let i = 0; i < 64; i += 1) {
      let F;
      let g;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }

      F = add32(add32(add32(F, A), K[i]), M[g]);
      A = D;
      D = C;
      C = B;
      B = add32(B, leftRotate(F, S[i]));
    }

    a0 = add32(a0, A);
    b0 = add32(b0, B);
    c0 = add32(c0, C);
    d0 = add32(d0, D);
  }

  function toHexLE(n) {
    let hex = "";
    for (let i = 0; i < 4; i += 1) {
      hex += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0");
    }
    return hex;
  }

  return toHexLE(a0) + toHexLE(b0) + toHexLE(c0) + toHexLE(d0);
}
