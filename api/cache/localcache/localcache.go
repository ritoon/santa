package localcache

import "sync"

// sync Map implement l'interface Cacher
// https://pkg.go.dev/sync#Map

type LocalCache struct {
	cache sync.Map
}

func New() *LocalCache {
	return &LocalCache{}
}

func (lc *LocalCache) Set(key string, value any) {
	lc.cache.Store(key, value)
}
func (lc *LocalCache) Get(key string) (value any, exists bool) {
	return lc.cache.Load(key)
}
