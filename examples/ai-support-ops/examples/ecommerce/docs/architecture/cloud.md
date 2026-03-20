# ShopFlow Cloud Architecture (AWS)

## Infrastructure Overview

ShopFlow is deployed on AWS using a containerized, highly available architecture.

### ASCII Cloud Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AWS CLOUD ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   Route 53  │
                              │     DNS     │
                              └──────┬──────┘
                                     │
                              ┌──────▼──────┐
                              │ CloudFront  │
                              │    CDN      │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
             ┌───────────┐    ┌───────────┐    ┌───────────┐
             │    S3     │    │    ALB    │    │   WAF     │
             │ (Static)  │    │           │    │           │
             └───────────┘    └─────┬─────┘    └───────────┘
                                    │
┌───────────────────────────────────┼───────────────────────────────────────┐
│                                   │                           VPC          │
│  ┌────────────────────────────────┼────────────────────────────────────┐  │
│  │                         Public Subnets                               │  │
│  │   ┌─────────────┐    ┌─────────▼─────────┐    ┌─────────────┐       │  │
│  │   │ NAT Gateway │    │       ALB         │    │ NAT Gateway │       │  │
│  │   │   (AZ-a)    │    │  (Multi-AZ)       │    │   (AZ-b)    │       │  │
│  │   └──────┬──────┘    └─────────┬─────────┘    └──────┬──────┘       │  │
│  └──────────┼─────────────────────┼─────────────────────┼──────────────┘  │
│             │                     │                     │                  │
│  ┌──────────┼─────────────────────┼─────────────────────┼──────────────┐  │
│  │          │              Private Subnets               │              │  │
│  │          ▼                     ▼                     ▼              │  │
│  │  ┌─────────────┐    ┌─────────────────────┐    ┌─────────────┐      │  │
│  │  │  ECS Task   │    │     ECS Task        │    │  ECS Task   │      │  │
│  │  │   (AZ-a)    │    │    (AZ-a/b)         │    │   (AZ-b)    │      │  │
│  │  └─────────────┘    └─────────────────────┘    └─────────────┘      │  │
│  │                              │                                       │  │
│  │          ┌───────────────────┼───────────────────┐                  │  │
│  │          ▼                   ▼                   ▼                  │  │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │  │
│  │  │ PostgreSQL  │    │ ElastiCache │    │    SQS      │              │  │
│  │  │    RDS      │    │   Redis     │    │   Queue     │              │  │
│  │  │ (Multi-AZ)  │    │  Cluster    │    │             │              │  │
│  │  └─────────────┘    └─────────────┘    └─────────────┘              │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

### Mermaid Cloud Architecture

```mermaid
graph TB
    subgraph Global["Global Services"]
        Route53[Route 53 DNS]
        CloudFront[CloudFront CDN]
        WAF[AWS WAF]
        ACM[ACM Certificates]
    end

    subgraph Storage["Storage Services"]
        S3Static[S3 Static Assets]
        S3Media[S3 Product Images]
        S3Logs[S3 Logs Bucket]
    end

    subgraph VPC["VPC - us-east-1"]
        subgraph PublicSubnets["Public Subnets"]
            ALB[Application Load Balancer]
            NATa[NAT Gateway AZ-a]
            NATb[NAT Gateway AZ-b]
        end

        subgraph PrivateSubnets["Private Subnets"]
            ECSa[ECS Tasks AZ-a]
            ECSb[ECS Tasks AZ-b]
        end

        subgraph DataSubnets["Data Subnets"]
            RDS[(RDS PostgreSQL)]
            Redis[(ElastiCache Redis)]
        end
    end

    subgraph Async["Async Processing"]
        SQS[SQS Queue]
        Worker[Worker Service]
    end

    subgraph Monitoring["Monitoring"]
        CloudWatch[CloudWatch]
        XRay[X-Ray Tracing]
    end

    Route53 --> CloudFront
    CloudFront --> WAF
    WAF --> ALB
    CloudFront --> S3Static

    ALB --> ECSa
    ALB --> ECSb

    ECSa --> RDS
    ECSb --> RDS
    ECSa --> Redis
    ECSb --> Redis
    ECSa --> SQS
    ECSb --> SQS
    ECSa --> S3Media

    SQS --> Worker
    Worker --> RDS

    ECSa --> CloudWatch
    ECSb --> CloudWatch
    ECSa --> XRay
```

## Service Configuration

### ECS Fargate

```yaml
# ECS Task Definition
{
  "family": "shopflow-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "shopflow/api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"}
      ],
      "secrets": [
        {"name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:..."}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/shopflow-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "api"
        }
      }
    }
  ]
}
```

### RDS PostgreSQL

```
┌─────────────────────────────────────────────────────────────┐
│                    RDS Configuration                         │
├─────────────────────────────────────────────────────────────┤
│  Instance Class:     db.r6g.xlarge                          │
│  Storage:            500 GB gp3                              │
│  Multi-AZ:           Enabled                                 │
│  Read Replicas:      2 (us-east-1a, us-east-1b)             │
│  Backup Retention:   7 days                                  │
│  Encryption:         AES-256                                 │
│  Parameter Group:    Custom (optimized for e-commerce)       │
└─────────────────────────────────────────────────────────────┘
```

### Mermaid RDS Architecture

```mermaid
graph LR
    subgraph Primary["Primary AZ (us-east-1a)"]
        Writer[(RDS Writer)]
    end

    subgraph Standby["Standby AZ (us-east-1b)"]
        StandbyDB[(Standby Instance)]
    end

    subgraph ReadReplicas["Read Replicas"]
        Reader1[(Read Replica 1)]
        Reader2[(Read Replica 2)]
    end

    subgraph Application["Application"]
        API1[API Instance 1]
        API2[API Instance 2]
    end

    Writer -->|Sync Replication| StandbyDB
    Writer -->|Async Replication| Reader1
    Writer -->|Async Replication| Reader2

    API1 -->|Write| Writer
    API2 -->|Write| Writer
    API1 -->|Read| Reader1
    API2 -->|Read| Reader2
```

### ElastiCache Redis

```mermaid
graph TB
    subgraph Cluster["Redis Cluster"]
        Primary1[Primary Node 1]
        Primary2[Primary Node 2]
        Replica1a[Replica 1a]
        Replica1b[Replica 1b]
        Replica2a[Replica 2a]
        Replica2b[Replica 2b]
    end

    Primary1 --> Replica1a
    Primary1 --> Replica1b
    Primary2 --> Replica2a
    Primary2 --> Replica2b

    subgraph UseCase["Use Cases"]
        Sessions[Session Storage]
        Cache[API Response Cache]
        Cart[Cart Data]
        Queue[Rate Limit Counters]
    end

    Sessions --> Cluster
    Cache --> Cluster
    Cart --> Cluster
    Queue --> Cluster
```

## Auto Scaling

### ASCII Scaling Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTO SCALING POLICY                          │
└─────────────────────────────────────────────────────────────────┘

   Load      1──────2──────3──────4──────5──────6──────7──────8
              │      │      │      │      │      │      │      │
              │      │      │      │      │      │      │      │
 Instances    2      2      3      4      6      8      10     10
              │      │      │      │      │      │      │      │
              │      │      │      │      │      │      │      │
 CPU Usage   20%    40%    50%    60%    70%    75%    80%    85%
              │      │      │      │      │      │      │      │
              ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
                     ▲      ▲             ▲      ▲
                  Scale  Scale         Scale  Scale
                   Out    Out           Out    Out
```

### Mermaid Auto Scaling

```mermaid
graph TD
    subgraph Trigger["Scaling Triggers"]
        CPU[CPU > 70%]
        Memory[Memory > 80%]
        Requests[Requests > 1000/min]
    end

    subgraph Policy["Scaling Policy"]
        ScaleOut[Scale Out +2]
        ScaleIn[Scale In -1]
        Cooldown[300s Cooldown]
    end

    subgraph Limits["Scaling Limits"]
        Min[Min: 2 tasks]
        Max[Max: 20 tasks]
        Desired[Desired: 4 tasks]
    end

    CPU --> ScaleOut
    Memory --> ScaleOut
    Requests --> ScaleOut

    ScaleOut --> Cooldown
    ScaleIn --> Cooldown
```

## Cost Breakdown (Monthly)

| Service | Configuration | Estimated Cost |
|---------|--------------|----------------|
| ECS Fargate | 4 tasks avg | $150 |
| RDS PostgreSQL | db.r6g.xlarge + 2 replicas | $800 |
| ElastiCache | r6g.large cluster | $300 |
| CloudFront | 100GB transfer | $50 |
| S3 | 500GB storage | $15 |
| ALB | Standard | $25 |
| NAT Gateway | 2 x Multi-AZ | $100 |
| Route 53 | 1 hosted zone | $1 |
| **Total** | | **~$1,441/mo** |

## Deployment Pipeline

```mermaid
graph LR
    subgraph Source["Source"]
        GitHub[GitHub]
    end

    subgraph Build["Build"]
        CodeBuild[CodeBuild]
        ECR[ECR Registry]
    end

    subgraph Deploy["Deploy"]
        CodeDeploy[CodeDeploy]
        ECS[ECS Service]
    end

    subgraph Stages["Environments"]
        Dev[Development]
        Staging[Staging]
        Prod[Production]
    end

    GitHub -->|Push| CodeBuild
    CodeBuild -->|Image| ECR
    ECR -->|Deploy| CodeDeploy
    CodeDeploy -->|Blue/Green| ECS

    ECS --> Dev
    Dev -->|Approve| Staging
    Staging -->|Approve| Prod
```

## Disaster Recovery

| Metric | Target | Strategy |
|--------|--------|----------|
| RTO | 4 hours | Multi-AZ failover |
| RPO | 1 hour | Point-in-time recovery |
| Backup Frequency | Daily | Automated snapshots |
| Cross-Region | Passive | S3 replication |
