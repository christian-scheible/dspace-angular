
import { ObjectCacheEffects } from './data/object-cache.effects';
import { RequestCacheEffects } from './data/request-cache.effects';
import { UUIDIndexEffects } from './index/uuid-index.effects';
import { RequestEffects } from './data/request.effects';

export const coreEffects = [
  RequestCacheEffects,
  RequestEffects,
  ObjectCacheEffects,
  UUIDIndexEffects,
];
