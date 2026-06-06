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
	"strconv"
	"strings"
	"time"
)

// ============================================================================
// Core Telemetry & Command Schemas (Rules 1 & 3 Enforced)
// ============================================================================

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

// ============================================================================
// Native Linux /proc Telemetry Harvester
// ============================================================================

// CollectRealOSProcesses scans /proc to extract active process states dynamically
func CollectRealOSProcesses(hostID string) []ProcessEvent {
	var events []ProcessEvent

	// Read the /proc directory matching active PIDs
	matches, err := filepath.Glob("/proc/[0-9]*")
	if err != nil {
		log.Printf("[ERR] Failed to read /proc virtual filesystem: %v", err)
		return events
	}

	for _, match := range matches {
		base := filepath.Base(match)
		pid, err := strconv.Atoi(base)
		if err != nil {
			continue
		}

		// Read the real executable symbolic link path
		exeLink, err := os.Readlink(filepath.Join(match, "exe"))
		if err != nil {
			// Skip kernel workers or processes we lack privileges to inspect
			continue
		}

		// Filter out standard development tools to highlight potential anomalies
		integrity := IntegrityTrusted
		if strings.HasPrefix(exeLink, "/tmp") || strings.Contains(exeLink, "miner") {
			integrity = IntegrityUntrusted
		}

		// Calculate the real SHA256 file hash of the active running binary
		hashStr := "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" // Default empty hash fallback
		if fileData, err := os.ReadFile(exeLink); err == nil {
			hash := sha256.Sum256(fileData)
			hashStr = hex.EncodeToString(hash[:])
		}

		// Grab the parent process identity (PPID) from /proc/[pid]/stat
		ppid := 0
		if statData, err := os.ReadFile(filepath.Join(match, "stat")); err == nil {
			fields := strings.Fields(string(statData))
			if len(fields) > 3 {
				ppid, _ = strconv.Atoi(fields[3]) // 4th field in stat is the PPID
			}
		}

		// Enforce Rule 3 structural identity tagging
		events = append(events, ProcessEvent{
			Timestamp:       time.Now().UTC().Format(time.RFC3339),
			HostIdentity:    hostID,
			ProcessPath:     exeLink,
			IntegrityStatus: integrity,
			PID:             pid,
			ProcessHash:     hashStr,
			ParentPID:       ppid,
		})
	}

	return events
}

// ============================================================================
// Telemetry Streamer Pipeline Configuration
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
				TLSClientConfig:   &tls.Config{InsecureSkipVerify: true}, // Bypassing DNS layers for codespace verification
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

	payload, _ := json.Marshal(events) // Rule 1: Flattened Array output
	
	// Stream to the THYREOS ingestion portal endpoints
	req, _ := http.NewRequestWithContext(ctx, "POST", ts.ConsoleURL+"/api/v1/telemetry", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	
	resp, err := ts.HTTPClient.Do(req)
	if err == nil {
		defer resp.Body.Close()
	}
}

// ============================================================================
// Unified Agent Lifecycle Loop
// ============================================================================

func main() {
	hostName, _ := os.Hostname()
	if hostName == "" {
		hostName = "OUTPOST-AGENT-LIVE"
	}

	log.Printf("[INIT] Outpost Zero telemetry harvester bound to host: %s", hostName)
	
	// Point the streamer directly to your production app instance
	streamer := NewTelemetryStreamer("https://outpost-zero.eds-360.com", hostName)

	ticker := time.NewTicker(3 * time.Second)
	// ... remainder of your live execution runtime loop
	defer ticker.Stop()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	for range ticker.C {
		// Harvest real active OS logs from the running system
		realTelemetryBatch := CollectRealOSProcesses(streamer.HostID)
		
		log.Printf("[HARVEST] Gathered %d active process telemetry blocks from kernel filesystem.", len(realTelemetryBatch))
		
		// Render out stream snapshot to verify rule compliance locally
		if len(realTelemetryBatch) > 0 {
			sampleOutput, _ := json.MarshalIndent(realTelemetryBatch[:1], "", "  ")
			fmt.Printf("[STREAM SNAPSHOT]\n%s\n", string(sampleOutput))
		}

		// Dispatch straight to the central transport layer
		streamer.StreamBatch(ctx, realTelemetryBatch)
	}
}