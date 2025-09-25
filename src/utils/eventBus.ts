// Simple event bus for forcing component updates
class EventBus {
  private listeners: { [key: string]: Array<() => void> } = {};

  on(event: string, callback: () => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: () => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string) {
    if (!this.listeners[event]) return;
    console.log(`📢 EventBus: emitting ${event} to ${this.listeners[event].length} listeners`);
    this.listeners[event].forEach(callback => callback());
  }
}

export const eventBus = new EventBus();