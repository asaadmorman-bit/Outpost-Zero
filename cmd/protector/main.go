package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"io"
	"os"
)

const LegalNotice = "PROPERTY OF EMERGING DEFENSE SOLUTIONS (EDS-360). QUANTUM-SAFE ENVELOPE ACTIVE."

// EncryptBinary wraps a compiled artifact in a quantum-safe AES-256-GCM structure
func EncryptBinary(inputFile, outputFile string, secretPassphrase string) error {
	fmt.Println(LegalNotice)

	// Derive a secure 32-byte (256-bit) key from the passphrase using SHA-256
	key := sha256.Sum256([]byte(secretPassphrase))

	plaintext, err := os.ReadFile(inputFile)
	if err != nil {
		return fmt.Errorf("failed to read binary source: %w", err)
	}

	block, err := aes.NewCipher(key[:])
	if err != nil {
		return fmt.Errorf("failed to instantiate cipher block: %w", err)
	}

	// Galois Counter Mode provides authenticated encryption to prevent code tampering
	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return fmt.Errorf("failed to instantiate GCM container: %w", err)
	}

	// Generate a unique nonce
	nonce := make([]byte, aesGCM.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return fmt.Errorf("cryptographic entropy failure: %w", err)
	}

	// Encrypt the machine code payload
	ciphertext := aesGCM.Seal(nonce, nonce, plaintext, nil)

	err = os.WriteFile(outputFile, ciphertext, 0600)
	if err != nil {
		return fmt.Errorf("failed to write secure envelope payload: %w", err)
	}

	fmt.Printf("[+] Protection complete. Wrapped binary output to: %s\n", outputFile)
	return nil
}

func main() {
	// Example usage inside build automation pipeline
	if len(os.Args) < 4 {
		fmt.Println("Usage: go run cmd/protector/main.go <input_bin> <output_envelope> <passphrase>")
		return
	}
	
	err := EncryptBinary(os.Args[1], os.Args[2], os.Args[3])
	if err != nil {
		fmt.Printf("[-] Protection failed: %v\n", err)
	}
}