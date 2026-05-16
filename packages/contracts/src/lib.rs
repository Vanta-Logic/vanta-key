#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Bytes, Env, Symbol,
};

// Storage keys
const ADMIN_KEY: Symbol = symbol_short!("ADMIN");
const INIT_KEY: Symbol = symbol_short!("INIT");

// Event topics
const TOPIC_STORED: Symbol = symbol_short!("stored");
const TOPIC_REVOKED: Symbol = symbol_short!("revoked");

/// On-chain representation of an access policy.
#[contracttype]
#[derive(Clone)]
pub struct SecretPolicy {
    pub client_identity: Address,
    pub resource_hash: Bytes,
    pub expiration_ledger: u32,
}

#[contract]
pub struct VantaKeyContract;

#[contractimpl]
impl VantaKeyContract {
    /// Initialize the contract with an admin address. Panics if already initialized.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&INIT_KEY) {
            panic!("already initialized");
        }
        env.storage().instance().set(&INIT_KEY, &true);
        env.storage().instance().set(&ADMIN_KEY, &admin);
    }

    /// Store a policy keyed by its resource_hash. Overwrites any existing policy for the same hash.
    pub fn store_policy(env: Env, policy: SecretPolicy) {
        env.storage()
            .persistent()
            .set(&policy.resource_hash, &policy);
        env.events().publish(
            (TOPIC_STORED, policy.resource_hash.clone()),
            policy.expiration_ledger,
        );
    }

    /// Returns true if a policy for resource_hash exists and has not expired.
    pub fn verify_stored(env: Env, resource_hash: Bytes) -> bool {
        match env
            .storage()
            .persistent()
            .get::<Bytes, SecretPolicy>(&resource_hash)
        {
            Some(policy) => env.ledger().sequence() <= policy.expiration_ledger,
            None => false,
        }
    }

    /// Revoke a stored policy. Only the admin may call this.
    pub fn revoke_policy(env: Env, resource_hash: Bytes) {
        let admin: Address = env.storage().instance().get(&ADMIN_KEY).unwrap();
        admin.require_auth();
        env.storage().persistent().remove(&resource_hash);
        env.events()
            .publish((TOPIC_REVOKED, resource_hash), true);
    }

    /// Return the stored policy for resource_hash, or None if not found.
    pub fn get_policy(env: Env, resource_hash: Bytes) -> Option<SecretPolicy> {
        env.storage()
            .persistent()
            .get::<Bytes, SecretPolicy>(&resource_hash)
    }
}

#[cfg(test)]
mod tests;
