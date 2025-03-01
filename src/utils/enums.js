export const LOCATION_TYPES = Object.freeze({
    OFFICE: "Office",
    SITE: "Site",
    FIELD: "Field",
    OTHER: "Other"
}
)


export const USER_ROLE = Object.freeze({
    FIELD_OFFICERS: "Field Officer",
    COLLECTOR: "Collector",
    INSPECTOR: "Inspector",
    HOD: "Head of Department",
    ADMIN: "System Administrator"
})

export const VISIT_TYPES = Object.freeze({
    ROUTINE: "Routine",
    SURPRISE: "Surprise",
    COMPLAINT_BASED: "Complaint Based",
    FOLLOW_UP: "Follow Up",
    EMERGENCY: "Emergency"
})

export const DEPARTMENTS = Object.freeze({
    REVENUE: "Revenue Department",
    RURAL_DEVELOPMENT: "Rural Development Department",
    AGRICULTURE: "Agriculture Department",
    EDUCATION: "Education Department",
    HEALTH: "Health Department",
    PUBLIC_WORKS: "Public Works Department",
    FOREST: "Forest Department",
    WATER_RESOURCES: "Water Resources Department",
    DISASTER_MANAGEMENT: "Disaster Management Department",
    INDUSTRIAL: "Industrial Development Department",
    FOOD_SUPPLY: "Food & Civil Supplies Department",
    POLICE: "Police Department",
    SOCIAL_WELFARE: "Social Welfare Department",
    URBAN_DEVELOPMENT: "Urban Development Department",
    ENERGY: "Energy Department",
    ENVIRONMENT: "Environment & Climate Change Department",
    TRIBAL_WELFARE: "Tribal Welfare Department",
    MINING: "Mining Department",
    TRANSPORT: "Transport Department",
    TOURISM: "Tourism Department"
})


export const FIELD_VISIT_STATUS = Object.freeze({
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    NEEDS_REVISION: "needs_revision"
})

export const AUTH_METHODS = Object.freeze({
    OTP: "OTP",
    FINGERPRINT: "Fingerprint",
    PASSWORD: "Password"
})

export const PRIORITY_LEVELS = Object.freeze({
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    CRITICAL: "Critical"
})


export const REPORT_FORMATS = Object.freeze({
    PDF: "PDF",
    EXCEL: "Excel",
    WORD: "Word",
    HTML: "HTML"
})

export const CONNECTIVITY_STATUS = Object.freeze({
    ONLINE: "Online",
    OFFLINE: "Offline",
    POOR_CONNECTION: "Poor Connection"
})

export const MEDIA_TYPES = Object.freeze({
    PHOTO: "Photo",
    VIDEO: "Video",
    DOCUMENT: "Document",
    AUDIO: "Audio"
})

export const STATUS_CODES = Object.freeze({
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504

})