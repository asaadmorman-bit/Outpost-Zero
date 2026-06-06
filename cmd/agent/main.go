package main

import (
	"bytes"
	"context"
	"crypto/sha256"
	"crypto/tls"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime/debug"
	"strconv"
	"strings"
	"time"
)

// ============================================================================
// PROPRIETARY WATERMARKS & LEGAL NOTICE CONSTANTS
// ============================================================================
const (
	CorporateNotice = "PROPERTY OF EMERGING DEFENSE SOLUTIONS (EDS-360). ALL RIGHTS RESERVED. UNRECOGNIZED USE IS SUBJECT TO CIVIL AND CRIMINAL LIABILITY."
	AgentWatermark  = "[EDS-360//OUTPOST-ZERO//SECURE-CORE]"
)

type IntegrityLevel string

const (
	IntegrityTrusted   IntegrityLevel = "TRUSTED"
	IntegrityUntrusted IntegrityLevel = "UNTRUSTED"
	
	MaxTelemetryBatchCap = 250
	MaxPathLength        = 4096
)

// ProcessEvent structural format matching Rules 1 & 3
type ProcessEvent struct {
	Timestamp       string         `json:"timestamp"`
	HostIdentity    string         `json:"host_identity"`    
	ProcessPath     string         `json:"process_path"`     
	IntegrityStatus IntegrityLevel `json:"integrity_status"` 
	PID             int            `json:"pid"`
	ProcessHash     string         `json:"process_hash"`
	ParentPID       int            `json:"parent_pid"`
	Watermark       string         `json:"_watermark"` // Inline forensic watermark tracing
}

// ============================================================================
// EDS ENTITLEMENT & LICENSE MANAGER
// ============================================================================

type LicenseState struct {
	LicenseKey string
	ExpiresAt  time.Time
	IsValid    bool
}

type LicenseManager struct {
	State LicenseState
}

func NewLicenseManager(rawKey string) *LicenseManager {
	lm := &LicenseManager{}
	lm.ValidateLicense(rawKey)
	return lm
}

// ValidateLicense safely parses the corporate license framework string
func (lm *LicenseManager) ValidateLicense(rawKey string) {
	if rawKey == "" {
		log.Printf("%s [LICENSE-ERROR] No deployment license key specified.", AgentWatermark)
		lm.State.IsValid = false
		return
	}

	// Simple structural validation tracking for this release build.
	// Production implementations will verify a signature block using a public key.
	parts := strings.Split(rawKey, ".")
	if len(parts) < 2 || parts[0] != "EDS-CORP" {
		log.Printf("%s [LICENSE-ERROR] Invalid cryptographic license formatting detected.", AgentWatermark)
		lm.State.IsValid = false
		return
	}

	// Parse unix epoch timeout embedded inside the token payload segment
	epoch, err := strconv.ParseInt(parts[1], 10, 64)
	if err != nil {
		lm.State.IsValid = false
		return
	}

	expiration := time.Unix(epoch, 0)
	lm.State.ExpiresAt = expiration

	if time.Now().After(expiration) {
		log.Printf("%s [CRITICAL] LICENSE EXPIRED ON %s. Suspended execution modes.", AgentWatermark, expiration.Format(time.RFC1123))
		lm.State.IsValid = false
	} else {
		log.Printf("%s [LICENSE-OK] Active validation lease verified. Entitled until: %s", AgentWatermark, expiration.Format(time.RFC1123))
		lm.State.IsValid = true
	}
}

// ============================================================================
// Telemetry Extraction & Sanitization
// ============================================================================

func SanitizePath(inputPath string) string {
	if len(inputPath) > MaxPathLength {
		return inputPath[:MaxPathLength]
	}
	return filepath.Clean(inputPath)
}

func CollectRealOSProcesses(hostID string) []ProcessEvent {
	events := make([]ProcessEvent, 0, MaxTelemetryBatchCap)

	matches, err := filepath.Glob("/proc/[0-9]*")
	if err != nil {
		log.Printf("%s [WATCHDOG-ALERT] Glob exception mapping /proc: %v", AgentWatermark, err)
		return events
	}

	for _, match := range matches {
		if len(events) >= MaxTelemetryBatchCap {
			break
		}

		base := filepath.Base(match)
		pid, err := strconv.Atoi(base)
		if err != nil {
			continue
		}

		exeLink, err := os.Readlink(filepath.Join(match, "exe"))
		if err != nil {
			continue
		}

		cleanExePath := SanitizePath(exeLink)

		integrity := IntegrityTrusted
		if strings.HasPrefix(cleanExePath, "/tmp") || strings.Contains(cleanExePath, "miner") {
			integrity = IntegrityUntrusted
		}

		hashStr := "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
		if fileData, err := os.ReadFile(cleanExePath); err == nil {
			if len(fileData) < 100*1024*1024 { 
				hash := sha256.Sum256(fileData)
				hashStr = hex.EncodeToString(hash[:])
			}
		}

		ppid := 0
		if statData, err := os.ReadFile(filepath.Join(match, "stat")); err == nil {
			fields := strings.Fields(string(statData))
			if len(fields) > 3 {
				ppid, _ = strconv.Atoi(fields[3])
			}
		}

		events = append(events, ProcessEvent{
			Timestamp:       time.Now().UTC().Format(time.RFC3339),
			HostIdentity:    hostID,
			ProcessPath:     cleanExePath,
			IntegrityStatus: integrity,
			PID:             pid,
			ProcessHash:     hashStr,
			ParentPID:       ppid,
			Watermark:       AgentWatermark, // Explicit telemetry watermarking
		})
	}

	return events
}

// ============================================================================
// Secure Egress Routing Infrastructure
// ============================================================================

type TelemetryStreamer struct {
	ConsoleURL string
	HostID     string
	HTTPClient *http.Client
}

func NewTelemetryStreamer(consoleURL, hostID string) *TelemetryStreamer {
	return &TelemetryStreamer{
		ConsoleURL: consoleURL,
		HostID:     hostID,
		HTTPClient: &http.Client{
			Transport: &http.Transport{
				TLSClientConfig:   &tls.Config{InsecureSkipVerify: true, MinVersion: tls.VersionTLS13},
				ForceAttemptHTTP2: true,
			},
			Timeout: 5 * time.Second,
		},
	}
}

func (ts *TelemetryStreamer) StreamBatch(ctx context.Context, events []ProcessEvent) {
	if len(events) == 0 {
		return
	}

	payload, err := json.Marshal(events)
	if err != nil {
		return
	}

	req, err := http.NewRequestWithContext(ctx, "POST", ts.ConsoleURL+"/api/v1/telemetry", bytes.NewBuffer(payload))
	if err != nil {
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-EDS-Notice", CorporateNotice)

	resp, err := ts.HTTPClient.Do(req)
	if err != nil {
		return
	}
	defer resp.Body.Close()
}

// ============================================================================
// Runtime Execution Lifecycle Entry
// ============================================================================

func main() {
	// Print legal notice banners inside core runtime traces
	fmt.Println("================================================================================")
	fmt.Println(CorporateNotice)
	fmt.Println("================================================================================")

	// Sample License String setup: "EDS-CORP.[Unix Epoch Expiration Timestamp]"
	// This token sets an expiration window pointing safely to late 2026.
	mockDeploymentLicense := "EDS-CORP.1798797600" 
	
	licenseMgr := NewLicenseManager(mockDeploymentLicense)

	hostName, _ := os.Hostname()
	if hostName == "" {
		hostName = "OUTPOST-AGENT-SECURE"
	}

	streamer := NewTelemetryStreamer("https://outpost-zero.eds-360.com", hostName)

	ticker := time.NewTicker(3 * time.Second)
	defer ticker.Stop()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	for range ticker.C {
		// Strict License Check Guardrail: Refuse system scanning if entitlement is dropped
		if !licenseMgr.State.IsValid {
			log.Printf("%s [ALERT] Operating loop suspended. Please supply a valid license credential.", AgentWatermark)
			continue
		}

		func() {
			defer func() {
				if r := recover(); r != nil {
					log.Printf("%s [WATCHDOG-PANIC] Core anomaly recovered: %v", AgentWatermark, r)
					log.Printf("%s [WATCHDOG-TRACE] Dump:\n%s", AgentWatermark, string(debug.Stack()))
				}
			}()

			realTelemetryBatch := CollectRealOSProcesses(streamer.HostID)
			
			if len(realTelemetryBatch) > 0 {
				log.Printf("%s [HARVEST] Conveying %d securely processed logs.", AgentWatermark, len(realTelemetryBatch))
				streamer.StreamBatch(ctx, realTelemetryBatch)
			}
		}()
	}
}