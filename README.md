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

