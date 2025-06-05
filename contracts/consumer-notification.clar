;; Consumer Notification Contract
;; Manages consumer notifications for safety issues

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u500))
(define-constant ERR_NOTIFICATION_NOT_FOUND (err u501))

;; Notification structure
(define-map notifications
  { notification-id: uint }
  {
    notification-type: (string-ascii 50),
    title: (string-ascii 100),
    message: (string-ascii 500),
    urgency-level: uint,
    target-batch: (string-ascii 50),
    created-date: uint,
    status: (string-ascii 20),
    created-by: principal
  }
)

(define-data-var next-notification-id uint u1)

;; Create consumer notification
(define-public (create-notification
  (notification-type (string-ascii 50))
  (title (string-ascii 100))
  (message (string-ascii 500))
  (urgency-level uint)
  (target-batch (string-ascii 50))
)
  (let ((notification-id (var-get next-notification-id)))
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)

    (map-set notifications
      { notification-id: notification-id }
      {
        notification-type: notification-type,
        title: title,
        message: message,
        urgency-level: urgency-level,
        target-batch: target-batch,
        created-date: block-height,
        status: "active",
        created-by: tx-sender
      }
    )

    (var-set next-notification-id (+ notification-id u1))
    (ok notification-id)
  )
)

;; Update notification status
(define-public (update-notification-status (notification-id uint) (status (string-ascii 20)))
  (let ((notification (unwrap! (map-get? notifications { notification-id: notification-id }) ERR_NOTIFICATION_NOT_FOUND)))
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)

    (map-set notifications
      { notification-id: notification-id }
      (merge notification { status: status })
    )
    (ok true)
  )
)

;; Get notification
(define-read-only (get-notification (notification-id uint))
  (map-get? notifications { notification-id: notification-id })
)

;; Get active notifications for batch
(define-read-only (has-active-notifications (batch-id (string-ascii 50)))
  (ok false) ;; Simplified - would check all active notifications for batch
)
