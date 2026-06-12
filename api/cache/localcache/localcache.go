package localcache

import (
	"log"
	"sync"
	"time"
)

// sync Map implement l'interface Cacher
// https://pkg.go.dev/sync#Map

type LocalCache struct {
	cache sync.Map
	ttl   time.Duration
}

func New(ttl time.Duration) *LocalCache {
	lc := &LocalCache{
		ttl: ttl,
	}
	go func() {
		tick := time.NewTicker(ttl)
		for range tick.C {
			log.Println("tick for cache")
			lc.cache.Range(func(key, value any) bool {
				v, ok := value.(cacheValue)
				if ok {
					if v.exp.Unix() < time.Now().Unix() {
						log.Println("cache: delete value with ticker")
						lc.cache.Delete(key)
						return true
					}
				}
				return true
			})
		}
	}()
	return lc
}

func (lc *LocalCache) Set(key string, value any) {

	lc.cache.Store(key, cacheValue{
		value: value,
		exp:   time.Now().Add(lc.ttl),
	})
}
func (lc *LocalCache) Get(key string) (value any, exists bool) {
	cv, ok := lc.cache.Load(key)
	if !ok {
		return nil, false
	}
	v, ok := cv.(cacheValue)
	if !ok {
		return nil, false
	}
	return v.value, true
}

type cacheValue struct {
	exp   time.Time
	value any
}
