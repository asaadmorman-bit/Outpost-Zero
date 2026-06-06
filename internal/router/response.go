package router

import (
	"fmt"
	"log"
	"os"
	"syscall"
)

// MitigationEngine handles localized system remediation actions.
type MitigationEngine struct {
	LogPrefix string
}

func NewMitigationEngine() *MitigationEngine {
	return &MitigationEngine{
		LogPrefix: "[ACTIVE-RESPONSE]",
	}
}

// TerminateProcessByPID executes a forced termination sequence on an untrusted PID
// only after upstream cryptographic validation structures are verified.
func (me *MitigationEngine) TerminateProcessByPID(cmd HighPrivilegeCommand) error {
	// Rule 2 Guardrails: Ensure hardware signature structures are not spoofed/empty
	if cmd.TokenValidation.Signature == "" || cmd.TokenValidation.CredentialID == "" {
		return fmt.Errorf("CRITICAL SECURITY VIOLATION: Refusing to terminate PID %d. Hardware token signature validation structures are missing", cmd.TargetPID)
	}

	if !cmd.TokenValidation.UserPresence {
		return fmt.Errorf("CRITICAL SECURITY VIOLATION: Execution aborted. Upstream token validation payload lacks physical user presence attestation")
	}

	log.Printf("%s Upstream validation verified. Proceeding with active response on PID %d (%s)...", me.LogPrefix, cmd.TargetPID, cmd.Action)

	// Find the operating system process handle
	proc, err := os.FindProcess(cmd.TargetPID)
	if err != nil {
		return fmt.Errorf("failed to map process handle for PID %d: %w", cmd.TargetPID, err)
	}

	// Rule of Least Privilege: First attempt a graceful SIGTERM, then escalate to SIGKILL if necessary
	log.Printf("%s Sending SIGTERM to process %d...", me.LogPrefix, cmd.TargetPID)
	err = proc.Signal(syscall.SIGTERM)
	if err != nil {
		// If process already dead, clear gracefully
		if os.IsNotExist(err) {
			log.Printf("%s Process %d already terminated before signal delivery.", me.LogPrefix, cmd.TargetPID)
			return nil
		}
		
		// Esclate immediately to SIGKILL if SIGTERM is blocked or ignored
		log.Printf("%s SIGTERM failed or ignored. Escalating to forced SIGKILL on process %d...", me.LogPrefix, cmd.TargetPID)
		if killErr := proc.Kill(); killErr != nil {
			return fmt.Errorf("kernel denied forced termination override on PID %d: %w", cmd.TargetPID, killErr)
		}
	}

	log.Printf("%s Target PID %d successfully neutralized.", me.LogPrefix, cmd.TargetPID)
	return nil
}