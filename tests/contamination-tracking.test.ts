import { describe, it, expect, beforeEach } from "vitest"

// Mock contract state
const mockContract = {
  contaminationIncidents: new Map(),
  nextIncidentId: 1,
  contractOwner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
}

// Mock contract functions
const reportContamination = (producerId, batchId, contaminationType, severityLevel, source, sender) => {
  if (severityLevel < 1 || severityLevel > 5) {
    return { error: "ERR_INVALID_SEVERITY" }
  }
  
  const incidentId = mockContract.nextIncidentId
  mockContract.contaminationIncidents.set(incidentId, {
    producerId,
    batchId,
    contaminationType,
    severityLevel,
    detectionDate: Date.now(),
    source,
    status: "active",
    reportedBy: sender,
  })
  
  mockContract.nextIncidentId++
  return { success: incidentId }
}

const updateIncidentStatus = (incidentId, status, sender) => {
  if (sender !== mockContract.contractOwner) {
    return { error: "ERR_UNAUTHORIZED" }
  }
  
  const incident = mockContract.contaminationIncidents.get(incidentId)
  if (!incident) {
    return { error: "ERR_INCIDENT_NOT_FOUND" }
  }
  
  incident.status = status
  return { success: true }
}

const getIncident = (incidentId) => {
  return mockContract.contaminationIncidents.get(incidentId) || null
}

describe("Contamination Tracking Contract", () => {
  beforeEach(() => {
    mockContract.contaminationIncidents.clear()
    mockContract.nextIncidentId = 1
  })
  
  describe("reportContamination", () => {
    it("should report contamination successfully", () => {
      const result = reportContamination(1, "BATCH001", "bacterial", 3, "production line", "ST1REPORTER_ADDRESS")
      
      expect(result.success).toBe(1)
      
      const incident = getIncident(1)
      expect(incident.producerId).toBe(1)
      expect(incident.batchId).toBe("BATCH001")
      expect(incident.contaminationType).toBe("bacterial")
      expect(incident.severityLevel).toBe(3)
      expect(incident.status).toBe("active")
    })
    
    it("should fail with invalid severity level", () => {
      const result = reportContamination(1, "BATCH001", "bacterial", 6, "production line", "ST1REPORTER_ADDRESS")
      
      expect(result.error).toBe("ERR_INVALID_SEVERITY")
    })
    
    it("should accept severity levels 1-5", () => {
      for (let severity = 1; severity <= 5; severity++) {
        const result = reportContamination(
            1,
            `BATCH00${severity}`,
            "bacterial",
            severity,
            "production line",
            "ST1REPORTER_ADDRESS",
        )
        
        expect(result.success).toBe(severity)
      }
    })
  })
  
  describe("updateIncidentStatus", () => {
    it("should update incident status successfully", () => {
      // First report an incident
      reportContamination(1, "BATCH001", "bacterial", 3, "production line", "ST1REPORTER_ADDRESS")
      
      // Then update its status
      const result = updateIncidentStatus(1, "resolved", mockContract.contractOwner)
      
      expect(result.success).toBe(true)
      
      const incident = getIncident(1)
      expect(incident.status).toBe("resolved")
    })
    
    it("should fail to update non-existent incident", () => {
      const result = updateIncidentStatus(999, "resolved", mockContract.contractOwner)
      
      expect(result.error).toBe("ERR_INCIDENT_NOT_FOUND")
    })
    
    it("should fail when non-owner tries to update", () => {
      reportContamination(1, "BATCH001", "bacterial", 3, "production line", "ST1REPORTER_ADDRESS")
      
      const result = updateIncidentStatus(1, "resolved", "ST2DIFFERENT_ADDRESS")
      
      expect(result.error).toBe("ERR_UNAUTHORIZED")
    })
  })
})
