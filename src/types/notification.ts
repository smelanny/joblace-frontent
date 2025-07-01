export interface Notification {
  id: string;
  estado: 'aceptado' | 'rechazado';
  mensaje: string;
  timestamp: Date;
  read: boolean;
}

export interface PusherNotification {
  estado: 'aceptado' | 'rechazado';
  mensaje: string;
} 