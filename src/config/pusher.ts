import Pusher from 'pusher-js';

// Configuración de Pusher (solo para frontend)
export const pusherConfig = {
  key: '4fc41154944393957383',
  cluster: 'us2',
  forceTLS: true
};

// Crear instancia de Pusher
export const pusher = new Pusher(pusherConfig.key, {
  cluster: pusherConfig.cluster,
  forceTLS: true
});

export default pusher; 