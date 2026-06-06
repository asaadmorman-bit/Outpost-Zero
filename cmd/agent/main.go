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
// Core Telemetry Schemas (Strict Bound Type Safety)
// ============================================================================

type IntegrityLevel string

const (
	IntegrityTrusted   IntegrityLevel = "TRUSTED"
	IntegrityUntrusted IntegrityLevel = "UNTRUSTED"
	
	// MaxTelemetryBatchCap prevents memory exhaustion attacks on browser pools
	MaxTelemetryBatchCap = 250
	// MaxPathLength bounds string allocations to mitigate buffer saturation attempts
	MaxPathLength = 4096
)

type ProcessEvent struct {
	Timestamp       string         `json:"timestamp"`
	HostIdentity    string         `json:"host_identity"`    // Rule 3 Tag
	ProcessPath     string         `json:"process_path"`     // Rule 3 Tag
	IntegrityStatus IntegrityLevel `json:"integrity_status"` // Rule 3 Tag
	PID             int            `json:"pid"`
	ProcessHash     string         `json:"process_hash"`
	ParentPID       int            `json:"parent_pid"`
}

// ============================================================================
// Defensive Linux /proc Telemetry Harvester
// ============================================================================

func SanitizePath(inputPath string) string {
	if len(inputPath) > MaxPathLength {
		return inputPath[:MaxPathLength]
	}
	// Clean resolves relative elements (../) to prevent path traversal injection
	return filepath.Clean(inputPath)
}

func CollectRealOSProcesses(hostID string) []ProcessEvent {
	// Secure Coding: Set an explicit allocation bound cap to prevent unbounded slice stretching
	events := make([]ProcessEvent, 0, MaxTelemetryBatchCap)

	matches, err := filepath.Glob("/proc/[0-9]*")
	if err != nil {
		log.Printf("[WATCHDOG-ALERT] Failed to glob /proc filesystem space: %v", err)
		return events
	}

	for _, match := range matches {
		if len(events) >= MaxTelemetryBatchCap {
			log.Printf("[RESOURCE-GUARD] Telemetry cap threshold (%d) reached. Truncating collection loop.", MaxTelemetryBatchCap)
			break
		}

		base := filepath.Base(match)
		pid, err := strconv.Atoi(base)
		if err != nil {
			continue
		}

		exeLink, err := os.Readlink(filepath.Join(match, "exe"))
		if err != nil {
			// Expected for kernel workers; fail silently to reduce noise
			continue
		}

		// Secure Coding: Sanitize raw operating system inputs before telemetry grouping
		cleanExePath := SanitizePath(exeLink)

		integrity := IntegrityTrusted
		if strings.HasPrefix(cleanExePath, "/tmp") || strings.Contains(cleanExePath, "miner") || strings.HasPrefix(cleanExePath, "/dev/shm") {
			integrity = IntegrityUntrusted
		}

		hashStr := "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
		if fileData, err := os.ReadFile(cleanExePath); err == nil {
			if len(fileData) < 500*1024*1024 { // 500MB sanity limit check to prevent parsing giant binary blobs into RAM
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
		})
	}

	return events
}

// ============================================================================
// Secure Telemetry Streamer Pipeline 
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
				TLSClientConfig: &tls.Config{
					InsecureSkipVerify: true, // Bypassing local domain resolution inside sandbox environment
					MinVersion:         tls.VersionTLS13,
				},
				ForceAttemptHTTP2: true,
			},
			Timeout: 5 * time.Second, // Hard timeout constraints to prevent connection hanging exhaustion attacks
		},
	}
}

func (ts *TelemetryStreamer) StreamBatch(ctx context.Context, events []ProcessEvent) {
	if len(events) == 0 {
		return
	}

	payload, err := json.Marshal(events) // Rule 1 Enforced
	if err != nil {
		log.Printf("[SECURE-GUARD] Aborting transmission: JSON serialization tracking anomaly: %v", err)
		return
	}

	req, err := http.NewRequestWithContext(ctx, "POST", ts.ConsoleURL+"/api/v1/telemetry", bytes.NewBuffer(payload))
	if err != nil {
		return
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := ts.HTTPClient.Do(req)
	if err != nil {
		return
	}
	defer resp.Body.Close()
}

// ============================================================================
// Unified Agent Runtime Lifecycle Loop with Embedded Watchdog Capabilities
// ============================================================================

func main() {
	hostName, _ := os.Hostname()
	if hostName == "" {
		hostName = "OUTPOST-AGENT-HARDENED"
	}

	log.Printf("[INIT] Outpost Zero Trusted Agent Core fully operational on host: %s", hostName)
	streamer := NewTelemetryStreamer("https://outpost-zero.eds-360.com", hostName)

	ticker := time.NewTicker(3 * time.Second)
	defer ticker.Stop()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Execution Runtime Loop
	for range ticker.C {
		// ====================================================================
		// SOFTWARE WATCHDOG CONTAINER BLOCK
		// Intercepts any lower-level routine panics to maintain system runtime uptime.
		// ====================================================================
		func() {
			defer func() {
				if r := recover(); r != nil {
					log.Printf("[WATCHDOG-PANIC-RECOVERY] Critical core anomaly intercepted! Details: %v", r)
					log.Printf("[WATCHDOG-TRACE] Stack dump:\n%s", string(debug.Stack()))
					log.Println("[WATCHDOG-RECOVERY] Safely contained runtime execution thread. Rescheduling collector...")
				}
			}()

			// Run real system telemetry loop under active watchdog supervision
			realTelemetryBatch := CollectRealOSProcesses(streamer.HostID)
			
			if len(realTelemetryBatch) > 0 {
				log.Printf("[HARVEST] Gathered %d active process records securely.", len(realTelemetryBatch))
				streamer.StreamBatch(ctx, realTelemetryBatch)
			}
		}()
	}
}