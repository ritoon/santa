package cache

// Créer une interface de contract Cacher
// Set(key string,value any) any
// Get(key string) (value any, exists ok)

type Cacher interface {
	Set(key string, value any)
	Get(key string) (value any, exists bool)
}
