## Secure Multi-Signature Banking System

This system implements a comprehensive solution for the 4th problem statement with advanced cryptography features including TOTP authentication, threshold signatures, and secure messaging.

## System Architecture Overview

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express Server │◄──►│   MongoDB DB    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────►│ Crypto Services │
                         └─────────────────┘

User Model: Stores TOTP secrets, encrypted private keys, and nonce for replay protection
Transaction Model: Implements threshold signature scheme with partial signatures array
Message Model: End-to-end encryption with AES-GCM and digital signatures

Logic Explanation:

TOTP: Time-based one-time passwords for enhanced authentication
ECDH: Elliptic Curve Diffie-Hellman for secure key exchange
AES-GCM: Authenticated encryption for message confidentiality and integrity
Digital Signatures: ECDSA for transaction authentication and non-repudiation
Nonce System: Prevents replay attacks by ensuring unique transaction identifiers