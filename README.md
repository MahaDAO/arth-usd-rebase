# ARTH USD Rebase tokens

This repo implements a simple rebase token that is backed by ARTH collateral but mimics the price of 1$ = 1 token. A helpful placeholder for USD-focused platforms like Curve which require the token to be pegged to 1$.

This is a rebase token. The token automatically rebases itself to match the dollar value of the underlying ARTH that is locked.

Since ARTH appreciates over time, users should see their `ARTH.usd` rebase token balance only gradually increase over time. This makes `ARTH.usd` a positive rebase token very similar to how yield bearing tokens work (like Compound's cTokens).

- ETH: [0x973F054eDBECD287209c36A2651094fA52F99a71](https://etherscan.io/address/0x973F054eDBECD287209c36A2651094fA52F99a71)
- Polygon: [0x84f168e646d31f6c33fdbf284d9037f59603aa28](https://polygonscan.com/address/0x84f168e646d31f6c33fdbf284d9037f59603aa28)
- BSC: [0x88fd584dF3f97c64843CD474bDC6F78e398394f4](https://bscscan.com/address/0x88fd584df3f97c64843cd474bdc6f78e398394f4)
