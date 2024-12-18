import { test, expect } from '@playwright/test';
import { Client, Wallet, xrpToDrops } from 'xrpl';

function getNet(networkType) {
    if (networkType === 'testnet') {
        return "wss://s.altnet.rippletest.net:51233";
    } else if (networkType === 'devnet') {
        return "wss://s.devnet.rippletest.net:51233";
    } else {
        throw new Error('Invalid network type');
    }
}

test('XRPL Connection and Wallet Funding Test', async ({ page }) => {
    const networkType = 'testnet'; // or 'devnet', depending on your needs
    const net = getNet(networkType);
    
    const client = new Client(net);
    
    try {
        await client.connect();
        expect(client.isConnected()).toBeTruthy();
        console.log('Connected to XRPL');

        // Set faucet host based on network type
        let faucetHost = null;
        if (networkType === 'testnet') {
            faucetHost = 'faucet.altnet.rippletest.net';
        } else if (networkType === 'devnet') {
            faucetHost = 'faucet.devnet.rippletest.net';
        }

        // Create and fund a new wallet
        const fundResult = await client.fundWallet(null, { faucetHost });
        const my_wallet = fundResult.wallet;

        console.log("Funded wallet address:", my_wallet.address);
        console.log("Funded wallet seed:", my_wallet.seed);
        console.log("Funded wallet balance:", fundResult.balance);

        expect(my_wallet).toBeDefined();
        expect(my_wallet.address).toBeDefined();
        expect(my_wallet.seed).toBeDefined();
        expect(fundResult.balance).toBeGreaterThan(0);

    } catch (error) {
        console.error("Error:", error);
        throw error;
    } finally {
        await client.disconnect();
        console.log('Disconnected from XRPL');
    }
});

test('XRPL Transaction Test', async ({ page }) => {
    const networkType = 'testnet';
    const net = getNet(networkType);
    
    const client = new Client(net);
    
    try {
        await client.connect();
        expect(client.isConnected()).toBeTruthy();
        console.log('Connected to XRPL');

        // Create two test wallets
        const wallet1 = await client.fundWallet();
        const wallet2 = await client.fundWallet();

        console.log("Wallet 1 address:", wallet1.wallet.address);
        console.log("Wallet 2 address:", wallet2.wallet.address);

        // Prepare a payment transaction
        const prepared = await client.autofill({
            "TransactionType": "Payment",
            "Account": wallet1.wallet.address,
            "Destination": wallet2.wallet.address,
            "Amount": xrpToDrops("10") // Send 10 XRP
        });

        // Sign the transaction
        const signed = wallet1.wallet.sign(prepared);

        // Submit the transaction
        const tx = await client.submitAndWait(signed.tx_blob);

        console.log("Transaction result:", tx.result.meta.TransactionResult);
        expect(tx.result.meta.TransactionResult).toBe("tesSUCCESS");

    } catch (error) {
        console.error("Error:", error);
        throw error;
    } finally {
        await client.disconnect();
        console.log('Disconnected from XRPL');
    }
});