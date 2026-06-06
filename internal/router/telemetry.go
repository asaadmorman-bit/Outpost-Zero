package router

// HardwareTokenSignature slots the physical WebAuthn/YubiKey cryptosprints.
type HardwareTokenSignature struct {
	CredentialID string `json:"credential_id"`
	ClientData   string `json:"client_data"`
	Signature    string `json:"signature"`
	UserPresence bool   `json:"user_presence"`
}

// HighPrivilegeCommand enforces structural parsing for THYREOS control actions.
type HighPrivilegeCommand struct {
	CommandID         string                 `json:"command_id"`
	Action            string                 `json:"action"` // e.g., "PROCESS_TERMINATION"
	TargetHost        string                 `json:"target_host"`
	TargetPID         int                    `json:"target_pid"`
	UpstreamValidator string                 `json:"upstream_validator_id"`
	TokenValidation   HardwareTokenSignature `json:"hardware_token_validation"`
}

import (
	"bytes"
	"context"
	"crypto/tls"
	"crypto/x509"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

// (Re-using the core ProcessEvent model from previous steps)
type IntegrityLevel string
const (
	IntegrityTrusted   IntegrityLevel = "TRUSTED"
	IntegrityUntrusted IntegrityLevel = "UNTRUSTED"
)

type ProcessEvent struct {
	Timestamp       string         `json:"timestamp"`
	HostIdentity    string         `json:"host_identity"`
	ProcessPath     string         `json:"process_path"`
	IntegrityStatus IntegrityLevel `json:"integrity_status"`
	PID             int            `json:"pid"`
	ProcessHash     string         `json:"process_hash"`
	ParentPID       int            `json:"parent_pid"`
}

// TelemetryStreamer handles the long-lived mTLS session connection pool.
type TelemetryStreamer struct {
	ConsoleURL string
	HostID     string
	HTTPClient *http.Client
}

// NewTelemetryStreamer sets up secure mTLS configuration utilizing TLS 1.3
func NewTelemetryStreamer(consoleURL, hostID, certFile, keyFile, caFile string) (*TelemetryStreamer, error) {
	// Load agent's public/private key pair for identity verification
	agentCert, err := tls.LoadX509KeyPair(certFile, keyFile)
	if err != nil {
		return nil, fmt.Errorf("failed to load agent credentials: %w", err)
	}

	// Load THYREOS root CA certificate
	caCert, err := os.ReadFile(caFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read console root CA: %w", err)
	}
	caCertPool := x509.NewCertPool()
	caCertPool.AppendCertsFromPEM(caCert)

	// Modern TLS 1.3 configuration rules
	tlsConfig := &tls.Config{
		Certificates: []tls.Certificate{agentCert},
		RootCAs:      caCertPool,
		MinVersion:   tls.VersionTLS13, // Force cryptographic safety
	}

	// Force Go's underlying transport network engine to handle native HTTP/2 multiplexing
	transport := &http.Transport{
		TLSClientConfig:   tlsConfig,
		ForceAttemptHTTP2: true, 
		MaxIdleConns:      10,
		IdleConnTimeout:   30 * time.Second,
	}

	return &TelemetryStreamer{
		ConsoleURL: consoleURL,
		HostID:     hostID,
		HTTPClient: &http.Client{Transport: transport},
	}, nil
}

// StreamBatch ships a flattened event array to the backend over the established connection pool
func (ts *TelemetryStreamer) StreamBatch(ctx context.Context, events []ProcessEvent) error {
	if len(events) == 0 {
		return nil
	}

	// Enforce Rule 1: Flattened array marshalling
	payload, err := json.Marshal(events)
	if err != nil {
		return fmt.Errorf("serialization panic prevented: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", ts.ConsoleURL+"/api/v1/telemetry", bytes.NewBuffer(payload))
	if err != nil {
		return fmt.Errorf("failed to form telemetry block payload: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Outpost-Host", ts.HostID)

	resp, err := ts.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("telemetry ingestion pipeline link interrupted: %w", err)
	}
	defer resp.Body.Close()

	// Handle standard HTTP/2 response checks safely
	if resp.StatusCode != http.StatusAccepted && resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("THYREOS console rejected payload (%d): %s", resp.StatusCode, string(body))
	}

	return nil
}