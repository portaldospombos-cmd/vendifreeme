import os
import sys

def verify_link():
    print("--- Vendifree Link Handshake (Phase 2) ---")
    
    # 1. Verify Architecture SOPs
    sop_path = "architecture/"
    sops = ["sop_commissions.md", "sop_user_guard.md", "sop_asset_lifecycle.md"]
    for sop in sops:
        full_path = os.path.join(sop_path, sop)
        if os.path.exists(full_path):
            print(f"[OK] SOP Linked: {sop}")
        else:
            print(f"[ERROR] SOP Missing: {sop}")
            return False

    # 2. Verify .tmp directory
    if os.path.exists(".tmp/"):
        print("[OK] .tmp directory ready for ephemeral data.")
    else:
        print("[ERROR] .tmp directory missing.")
        return False

    # 3. Simulate API Verification (Stub for Supabase/Stripe)
    print("[OK] Simulated API Handshake: Ready for Supabase Connectivity.")
    print("[OK] Simulated API Handshake: Ready for Stripe Webhooks.")
    
    print("--- Handshake Successful ---")
    return True

if __name__ == "__main__":
    if verify_link():
        sys.exit(0)
    else:
        sys.exit(1)
