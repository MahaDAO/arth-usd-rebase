# ARTH USD Rebase tokens

This repo implements a simple rebase token that is backed by ARTH collateral but mimics the price of 1$ = 1 token. A helpful placeholder for USD-focused platforms like Curve which require the token to be pegged to 1$.

This is a rebase token. The token automatically rebases itself to match the dollar value of the underlying ARTH that is locked.

Since ARTH appreciates over time, users should see their `ARTH.usd` rebase token balance only gradually increase over time. This makes `ARTH.usd` a positive rebase token very similar to how yield bearing tokens work (like Compound's cTokens).
