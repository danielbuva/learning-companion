#!/usr/bin/env python3
"""Audit staged blobs without printing potentially sensitive matching content."""
import re,subprocess,sys
paths=subprocess.check_output(['git','diff','--cached','--name-only','--diff-filter=ACMR','-z']).decode().split('\0')
patterns=[r'art_v2_[A-Za-z0-9_]+',r'gh[pousr]_[A-Za-z0-9]{20,}',r'sk-[A-Za-z0-9_-]{20,}',r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',r'Learner Profile [—-] [A-Z][a-z]+\\n\\nThis file is learner-specific',r'Explicit interaction preferences\n\n- Default to relatively small',r'\.private/.*\.(?:txt|md)']
bad=[]
for path in filter(None,paths):
    if any(part in path.split('/') for part in ['.private','.wrangler','.sites-runtime','node_modules','test-results']):bad.append((path,'forbidden path'));continue
    blob=subprocess.check_output(['git','show',':'+path])
    if len(blob)>3_000_000:bad.append((path,'unexpected large blob'))
    text=blob.decode('utf8',errors='ignore')
    for i,p in enumerate(patterns):
        if re.search(p,text):bad.append((path,f'private/secret pattern {i+1}'))
for path,why in bad:print(f'FAIL {path}: {why}')
print(f'Audited {sum(bool(p) for p in paths)} staged files; {len(bad)} findings. Manual provenance review is still required.')
sys.exit(bool(bad))
