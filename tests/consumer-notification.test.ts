import { describe, it, expect, beforeEach } from "vitest"

// Mock contract state
const mockContract = {
  notifications: new Map(),
  nextNotificationId: 1,
  contractOwner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
}

// Mock contract functions
const createNotification = (notificationType, title, message, urgencyLevel, targetBatch, sender) => {
  if (sender !== mockContract.contractOwner) {
    return { error: "ERR_UNAUTHORIZED" }
  }
  
  const notificationId = mockContract.nextNotificationId
  mockContract.notifications.set(notificationId, {
    notificationType,
    title,
    message,
    urgencyLevel,
    targetBatch,
    createdDate: Date.now(),
    status: "active",
    createdBy: sender,
  })
  
  mockContract.nextNotificationId++
  return { success: notificationId }
}

const updateNotificationStatus = (notificationId, status, sender) => {
  if (sender !== mockContract.contractOwner) {
    return { error: "ERR_UNAUTHORIZED" }
  }
  
  const notification = mockContract.notifications.get(notificationId)
  if (!notification) {
    return { error: "ERR_NOTIFICATION_NOT_FOUND" }
  }
  
  notification.status = status
  return { success: true }
}

const getNotification = (notificationId) => {
  return mockContract.notifications.get(notificationId) || null
}

describe("Consumer Notification Contract", () => {
  beforeEach(() => {
    mockContract.notifications.clear()
    mockContract.nextNotificationId = 1
  })
  
  describe("createNotification", () => {
    it("should create notification successfully", () => {
      const result = createNotification(
          "recall",
          "Product Recall Alert",
          "Fresh lettuce from batch BATCH001 has been recalled due to E.coli contamination",
          3,
          "BATCH001",
          mockContract.contractOwner,
      )
      
      expect(result.success).toBe(1)
      
      const notification = getNotification(1)
      expect(notification.notificationType).toBe("recall")
      expect(notification.title).toBe("Product Recall Alert")
      expect(notification.urgencyLevel).toBe(3)
      expect(notification.targetBatch).toBe("BATCH001")
      expect(notification.status).toBe("active")
    })
    
    it("should fail when non-owner tries to create notification", () => {
      const result = createNotification(
          "recall",
          "Product Recall Alert",
          "Test message",
          2,
          "BATCH001",
          "ST2DIFFERENT_ADDRESS",
      )
      
      expect(result.error).toBe("ERR_UNAUTHORIZED")
    })
    
    it("should handle different notification types", () => {
      const types = ["recall", "contamination", "safety_alert", "general"]
      
      types.forEach((type, index) => {
        const result = createNotification(
            type,
            `${type} Alert`,
            `Test message for ${type}`,
            1,
            `BATCH00${index + 1}`,
            mockContract.contractOwner,
        )
        
        expect(result.success).toBe(index + 1)
        
        const notification = getNotification(index + 1)
        expect(notification.notificationType).toBe(type)
      })
    })
  })
  
  describe("updateNotificationStatus", () => {
    it("should update notification status successfully", () => {
      // First create a notification
      createNotification("recall", "Test Alert", "Test message", 2, "BATCH001", mockContract.contractOwner)
      
      // Then update its status
      const result = updateNotificationStatus(1, "sent", mockContract.contractOwner)
      
      expect(result.success).toBe(true)
      
      const notification = getNotification(1)
      expect(notification.status).toBe("sent")
    })
    
    it("should fail to update non-existent notification", () => {
      const result = updateNotificationStatus(999, "sent", mockContract.contractOwner)
      
      expect(result.error).toBe("ERR_NOTIFICATION_NOT_FOUND")
    })
    
    it("should fail when non-owner tries to update", () => {
      createNotification("recall", "Test Alert", "Test message", 2, "BATCH001", mockContract.contractOwner)
      
      const result = updateNotificationStatus(1, "sent", "ST2DIFFERENT_ADDRESS")
      
      expect(result.error).toBe("ERR_UNAUTHORIZED")
    })
    
    it("should handle different status updates", () => {
      createNotification("recall", "Test Alert", "Test message", 2, "BATCH001", mockContract.contractOwner)
      
      const statuses = ["sent", "delivered", "read", "expired"]
      
      statuses.forEach((status) => {
        const result = updateNotificationStatus(1, status, mockContract.contractOwner)
        expect(result.success).toBe(true)
        
        const notification = getNotification(1)
        expect(notification.status).toBe(status)
      })
    })
  })
})
