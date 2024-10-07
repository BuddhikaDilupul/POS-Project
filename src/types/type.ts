// An enum for staff roles
export enum StaffRoles {
    ADMIN = "ADMIN",
    CASHIER = "CASHIER",
    MANAGER = "MANAGER",
    CHEF = "CHEF"
  }
  
// An enum for staff EmploymentType
export enum EmploymentTypeStaff {
    FULL_TIME_PROBATION = "FULL_TIME_PROBATION",
    FULL_TIME_PERMENENT = "FULL_TIME_PERMENENT",
    PART_TIME = "PART_TIME",
    CONTRACT = "CONTRACT",
    INTERNSHIP = "INTERNSHIP",
}

// An enum for gender
export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}

// An enum for unit
export enum Unit {
    g = "g",
    ml = "ml",
}

// An enum for stock
export enum Status {
    ACTIVE = "ACTIVE",
    CLOSED = "CLOSED",
    DELETED = "DELETE"
}

// An enum for user
export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED",
    BLACKLISTED = "BLACKLISTED"
}

//enum for product status
export enum ProductStatus{
    IN_STOCK = "IN_STOCK",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    LOW_STOCK = "LOW_STOCK",
}

//enum for order status
export enum OrderStatus{
    PLACED = "PLACED",
    PROCESSING = "PROCESSING",
    WAITING = "WAITING",
    COMPLETED = "COMPLETED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELED = "CANCELED",
    RETURNED = "RETURNED",
}
//enum for order payment
export enum PaymentMethod{
    CASH = "CASH",
    CARD = "CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
}

//enum for order payment status
export enum PaymentStatus{
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}