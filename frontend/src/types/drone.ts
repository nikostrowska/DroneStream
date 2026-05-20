/**
 * @interface DroneDTO
 * @description Represents a drone object with its properties and types.
 * Defines the structure of a drone object with properties:
 * - id: A unique identifier for the drone (number).
 * - name: The name of the drone (string).
 * - status: The current status of the drone (string), e.g., "Active" or "Inactive".
 */

export interface DroneDTO {
  id: string;
  name: string;
  model?: string;
  serialNumber: string;
  isOnline: boolean;
  lastActivity?: string | null;
}

export interface AddDroneDTO {
  name: string;
  model?: string;
  serialNumber: string;
}

export interface UpdateDroneDTO {
  name?: string;
  model?: string;
  serialNumber?: string;
}
