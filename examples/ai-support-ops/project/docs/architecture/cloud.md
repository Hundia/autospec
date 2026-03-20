# Cloud Architecture

AWS-compatible baseline:
- CloudFront for asset delivery
- ALB for web and API ingress
- ECS or Kubernetes for api, worker, and web services
- RDS PostgreSQL
- ElastiCache Redis
- S3 for attachments and export files
- CloudWatch or compatible stack for logs, metrics, and alerts

## Networking
- Public subnets: ALB only
- Private subnets: api, worker, database, redis
- Security groups restrict DB and Redis to app services

## Scaling
- Scale API on CPU and p95 latency
- Scale worker on queue depth and oldest job age
- Use read replicas only after analytics load demands it

## Cost Notes
Cache expensive analytics snapshots and cap long export concurrency to protect spend.
