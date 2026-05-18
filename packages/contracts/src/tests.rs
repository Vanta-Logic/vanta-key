#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation, Events, Ledger},
    vec, Address, Bytes, Env, IntoVal,
};

fn make_env() -> Env {
    Env::default()
}

fn make_hash(env: &Env, seed: u8) -> Bytes {
    Bytes::from_array(env, &[seed; 32])
}

fn make_policy(env: &Env, expiration_ledger: u32) -> SecretPolicy {
    SecretPolicy {
        client_identity: Address::generate(env),
        resource_hash: make_hash(env, 0xab),
        expiration_ledger,
    }
}

fn deploy(env: &Env) -> (VantaKeyContractClient, Address) {
    let admin = Address::generate(env);
    let contract_id = env.register(VantaKeyContract, ());
    let client = VantaKeyContractClient::new(env, &contract_id);
    env.mock_all_auths();
    client.initialize(&admin);
    (client, admin)
}

// 1. Full happy path: initialize → store_policy → verify_stored → revoke_policy → verify_stored returns false
#[test]
fn test_happy_path() {
    let env = make_env();
    let (client, _admin) = deploy(&env);

    let policy = make_policy(&env, 1000);
    let hash = policy.resource_hash.clone();

    client.store_policy(&policy);
    assert!(client.verify_stored(&hash));

    client.revoke_policy(&hash);
    assert!(!client.verify_stored(&hash));
}

// 2. Expired policy: store_policy → advance ledger → verify_stored returns false
#[test]
fn test_expired_policy() {
    let env = make_env();
    let (client, _admin) = deploy(&env);

    let policy = make_policy(&env, 100);
    let hash = policy.resource_hash.clone();

    client.store_policy(&policy);
    assert!(client.verify_stored(&hash));

    // Advance ledger past expiration
    env.ledger().set_sequence_number(101);
    assert!(!client.verify_stored(&hash));
}

// 3. Double initialize panics
#[test]
#[should_panic(expected = "already initialized")]
fn test_double_initialize_panics() {
    let env = make_env();
    let (client, _) = deploy(&env);
    let second_admin = Address::generate(&env);
    client.initialize(&second_admin);
}

// 4. Unauthorized revoke panics
#[test]
#[should_panic]
fn test_unauthorized_revoke_panics() {
    let env = make_env();
    let (client, _admin) = deploy(&env);

    let policy = make_policy(&env, 1000);
    let hash = policy.resource_hash.clone();
    client.store_policy(&policy);

    // Do NOT mock auths — revoke should fail auth check
    env.set_auths(&[]);
    client.revoke_policy(&hash);
}

// 5. get_policy on unknown hash returns None
#[test]
fn test_get_policy_unknown_returns_none() {
    let env = make_env();
    let (client, _admin) = deploy(&env);

    let unknown = make_hash(&env, 0xff);
    assert!(client.get_policy(&unknown).is_none());
}

// 6. Overwrite policy with same resource_hash
#[test]
fn test_overwrite_policy() {
    let env = make_env();
    let (client, _admin) = deploy(&env);

    let hash = make_hash(&env, 0x01);
    let policy_v1 = SecretPolicy {
        client_identity: Address::generate(&env),
        resource_hash: hash.clone(),
        expiration_ledger: 500,
    };
    let policy_v2 = SecretPolicy {
        client_identity: Address::generate(&env),
        resource_hash: hash.clone(),
        expiration_ledger: 2000,
    };

    client.store_policy(&policy_v1);
    client.store_policy(&policy_v2);

    let stored = client.get_policy(&hash).unwrap();
    assert_eq!(stored.expiration_ledger, 2000);
}

// 7. Events emitted in correct order
#[test]
fn test_events_emitted_in_order() {
    let env = make_env();
    let (client, _admin) = deploy(&env);

    let policy = make_policy(&env, 1000);
    let hash = policy.resource_hash.clone();

    client.store_policy(&policy);
    client.revoke_policy(&hash);

    let events = env.events().all();
    // Two events: stored then revoked
    assert_eq!(events.len(), 2);

    let (_, stored_topics, _): (_, soroban_sdk::Vec<soroban_sdk::Val>, _) =
        events.get(0).unwrap();
    let (_, revoked_topics, _): (_, soroban_sdk::Vec<soroban_sdk::Val>, _) =
        events.get(1).unwrap();

    // First topic of each event is the action symbol
    let stored_action: Symbol = stored_topics.get(0).unwrap().try_into_val(&env).unwrap();
    let revoked_action: Symbol = revoked_topics.get(0).unwrap().try_into_val(&env).unwrap();

    assert_eq!(stored_action, symbol_short!("stored"));
    assert_eq!(revoked_action, symbol_short!("revoked"));
}
