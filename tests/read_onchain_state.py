import json, base64, urllib.request

ALPH = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
STATES = {0: "Proposed", 1: "Locked", 2: "Verified", 3: "Settled", 4: "Cancelled"}


def b58(b: bytes) -> str:
    n = int.from_bytes(b, "big")
    s = ""
    while n > 0:
        n, r = divmod(n, 58)
        s = ALPH[r] + s
    nzero = 0
    for byte in b:
        if byte == 0:
            nzero += 1
        else:
            break
    return "1" * nzero + s


req = urllib.request.Request(
    "http://127.0.0.1:8899",
    data=json.dumps({
        "jsonrpc": "2.0", "id": 1,
        "method": "getProgramAccounts",
        "params": ["592x9qBjrwDiZiVfAuaAqqghnYJvygQFsXLBp5Yqxt3R", {"encoding": "base64"}],
    }).encode(),
    headers={"Content-Type": "application/json"},
)
res = json.loads(urllib.request.urlopen(req).read())

print(f"total contas: {len(res['result'])}\n")
for acc in res["result"]:
    raw = base64.b64decode(acc["account"]["data"][0])
    n = len(raw)
    if n == 226:
        bump = raw[8]
        proposer = b58(raw[9:41])
        partner = b58(raw[41:73])
        vows = int.from_bytes(raw[73:81], "little")
        state = STATES.get(raw[201], f"?{raw[201]}")
        print(f"COMMITMENT {acc['pubkey'][:10]} | vows={vows} state={state} bump={bump}")
        print(f"   proposer: {proposer}")
        print(f"   partner : {partner[:12]}...{partner[-6:]}")
        print(f"   codeHashProp={raw[137:169].hex()[:20]} | codeHashPart={raw[169:201].hex()[:20]}")
    elif n == 57:
        balance = int.from_bytes(raw[41:49], "little")
        locked = int.from_bytes(raw[49:57], "little")
        owner = b58(raw[9:41])
        flag = " <-- MUDOU" if balance != 100 or locked else ""
        print(f"VAULT {acc['pubkey'][:10]} | owner={owner} | balance={balance} locked={locked}{flag}")
    else:
        print(f"?? {acc['pubkey'][:10]} | {n} bytes")