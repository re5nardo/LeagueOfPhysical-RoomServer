redis.pcall("SETEX", KEYS[1], ARGV[1], ARGV[2]);
return redis.pcall("GET", KEYS[1]);