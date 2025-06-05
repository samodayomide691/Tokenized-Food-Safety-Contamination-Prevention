;; Contamination Tracking Contract
;; Tracks contamination incidents and affected batches

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u300))
(define-constant ERR_INCIDENT_NOT_FOUND (err u301))
(define-constant ERR_INVALID_SEVERITY (err u302))

;; Contamination incident structure
(define-map contamination-incidents
  { incident-id: uint }
  {
    producer-id: uint,
    batch-id: (string-ascii 50),
    contamination-type: (string-ascii 50),
    severity-level: uint,
    detection-date: uint,
    source: (string-ascii 100),
    status: (string-ascii 20),
    reported-by: principal
  }
)

(define-data-var next-incident-id uint u1)

;; Report contamination incident
(define-public (report-contamination
  (producer-id uint)
  (batch-id (string-ascii 50))
  (contamination-type (string-ascii 50))
  (severity-level uint)
  (source (string-ascii 100))
)
  (let ((incident-id (var-get next-incident-id)))
    (asserts! (and (>= severity-level u1) (<= severity-level u5)) ERR_INVALID_SEVERITY)

    (map-set contamination-incidents
      { incident-id: incident-id }
      {
        producer-id: producer-id,
        batch-id: batch-id,
        contamination-type: contamination-type,
        severity-level: severity-level,
        detection-date: block-height,
        source: source,
        status: "active",
        reported-by: tx-sender
      }
    )

    (var-set next-incident-id (+ incident-id u1))
    (ok incident-id)
  )
)

;; Update incident status
(define-public (update-incident-status (incident-id uint) (status (string-ascii 20)))
  (let ((incident (unwrap! (map-get? contamination-incidents { incident-id: incident-id }) ERR_INCIDENT_NOT_FOUND)))
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)

    (map-set contamination-incidents
      { incident-id: incident-id }
      (merge incident { status: status })
    )
    (ok true)
  )
)

;; Get contamination incident
(define-read-only (get-incident (incident-id uint))
  (map-get? contamination-incidents { incident-id: incident-id })
)

;; Check if batch is contaminated
(define-read-only (is-batch-contaminated (batch-id (string-ascii 50)))
  (ok false) ;; Simplified - would check all incidents for batch
)
